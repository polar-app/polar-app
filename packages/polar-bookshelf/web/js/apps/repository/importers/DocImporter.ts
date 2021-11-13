import {PersistenceLayerProvider, WriteOpts} from '../../../datastore/PersistenceLayer';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {DocMetas} from 'polar-shared/src/metadata/DocMetas';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {FileHandle} from 'polar-shared/src/util/Files';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DatastoreFiles} from '../../../datastore/DatastoreFiles';
import {HashAlgorithm, Hashcode, HashEncoding} from 'polar-shared/src/metadata/Hashcode';
import {URLs} from 'polar-shared/src/util/URLs';
import {InputSources} from 'polar-shared/src/util/input/InputSources';
import {BackendFileRefs} from '../../../datastore/BackendFileRefs';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";
import {DocMetadata} from "./DocMetadata";
import {OnWriteController} from "../upload/UploadHandlers";
import {FirebaseDatastoresShared} from "polar-shared-datastore/src/FirebaseDatastoresShared";

const log = Logger.create();

export interface ImportedFile {

    /**
     * The action taken on this file:
     *
     * imported: it was imported and written to the store
     * skipped: the doc is already in the store.
     */
    readonly action: 'imported' | 'skipped';

    /**
     * The DocInfo for the file we just imported.
     */
    readonly docInfo: IDocInfo;

    /**
     * The basename of the file imported.
     */
    readonly basename: string;

    readonly backendFileRef: BackendFileRef;

}

/**
 * Handles taking a given file, parsing the metadata, and then writing a new
 * DocMeta file and importing the PDF file to the stash.
 */
export namespace DocImporter {

    import WriteFileProgressListener = FirebaseDatastoresShared.WriteFileProgressListener;
    import DatastoreConsistency = FirebaseDatastoresShared.DatastoreConsistency;
    import BinaryFileData = FirebaseDatastoresShared.BinaryFileData;
    import BackendFileRefData = FirebaseDatastoresShared.BackendFileRefData;

    /**
     * Minimal metadata for the doc we want to import so that, in theory, we
     * don't have to read the DocMetadata if we already know it.
     */
    export interface IDocImport {
        readonly fingerprint: string;
        readonly title: string;
        readonly description: string;
        readonly doi?: string;
        readonly nrPages: number;
        readonly webCapture: boolean;
    }

    export interface DocImporterOpts {
        readonly consistency?: DatastoreConsistency;
        readonly docInfo?: Partial<IDocInfo>;
        readonly docImport?: IDocImport;
        readonly progressListener?: WriteFileProgressListener;
        readonly onController?: OnWriteController
    }

    export async function importFile(persistenceLayerProvider: PersistenceLayerProvider,
                                     docPathOrURL: string,
                                     basename: string,
                                     opts: DocImporterOpts = {}): Promise<ImportedFile> {

        console.log(`Importing doc docPathOrURL: ${docPathOrURL}, basename: ${basename}, opts: `, opts);

        const toDocType = () => {

            if (basename.toLowerCase().endsWith(".epub")) {
                return 'epub';
            }

            if (basename.toLowerCase().endsWith(".pdf")) {
                return 'pdf';
            }

            throw new Error("Unable to determine type from basename: " + basename);

        };

        const docType = toDocType();

        const isPath = ! URLs.isURL(docPathOrURL);

        log.info(`Working with document: ${docPathOrURL}: isPath: ${isPath}`);

        const docMetadata = opts.docImport || await DocMetadata.getMetadata(docPathOrURL, docType);

        // NOTE: about hashcode computation.  We perform all hashcode computation
        // on the client.  If the user gives a URL to the chrome extension, we
        // first download it, then work with the blob locally, and never re-download
        // it if we're using the Cache API to write the blobl

        // TODO(webapp): this doesn't work either becasue it assumes that we can
        // easily and cheaply read from the URL / blob URL but I guess that's
        // true in this situation though it's assuming a FILE and not a blob URL
        const fileHashMeta = await computeHashPrefix(docPathOrURL);

        const persistenceLayer = persistenceLayerProvider();

        const docID = fileHashMeta.hashcode;

        // TODO: this is slow to begin with... maybe we NEVER need to check if
        // we know we're always writing a NEW document.
        if (await persistenceLayer.contains(docID)) {

            log.warn(`File already present in datastore: docID=${docID}: ${docPathOrURL}`);

            const docMeta = await persistenceLayer.getDocMeta(docID);

            if (docMeta) {

                if (docMeta.docInfo.filename) {

                    // return the existing doc meta information.

                    const backendFileRef = BackendFileRefs.toBackendFileRef(docMeta);

                    const basename = FilePaths.basename(docMeta.docInfo.filename);
                    return {
                        action: 'skipped',
                        basename,
                        docInfo: docMeta.docInfo,
                        backendFileRef: backendFileRef!
                    };

                }

            }

        }

        // create a default title from the path which is used as sometimes the
        // filename is actually a decent first attempt at a document title.

        if (!basename && ! docPathOrURL.startsWith("blob:")) {
            basename = FilePaths.basename(docPathOrURL);
        }

        const defaultTitle = opts?.docInfo?.title || basename || "";

        const sanitizedFilename = DatastoreFiles.sanitizeFileName(basename!);
        const filename = `${fileHashMeta.hashPrefix}-${sanitizedFilename}`;

        // always read from a stream here as some of the documents we might want
        // to import could be rather large.  Also this needs to be a COPY of the
        // data, not a symlink since that's not really portable and it would
        // also be danging if the user deleted the file.  Wasting space here is
        // a good thing.  Space is cheap.

        const toBinaryFileData = async (): Promise<BinaryFileData> => {

            // TODO(webapp): make this into a toBlob function call
            if (URLs.isURL(docPathOrURL)) {
                log.info("Reading data from URL: ", docPathOrURL);
                const response = await fetch(docPathOrURL);
                return await response.blob();
            }

            return <FileHandle> {path: docPathOrURL};

        };

        const binaryFileData: BinaryFileData = await toBinaryFileData();

        const docMeta = DocMetas.create(docID, docMetadata.nrPages, filename);

        const docInfo: IDocInfo = {
            ...docMeta.docInfo,
            title: Optional.of(docMetadata.title).getOrElse(defaultTitle),
            description: docMetadata.description,
            doi: docMetadata.doi,
            hashcode: {
                enc: HashEncoding.BASE58CHECK,
                alg: HashAlgorithm.KECCAK256,
                data: fileHashMeta.hashcode
            },
            ...(opts.docInfo || {})
        }

        docMeta.docInfo = docInfo;

        const fileRef = {
            name: filename,
            hashcode: docMeta.docInfo.hashcode
        };

        const writeFile: BackendFileRefData = {
            backend: Backend.STASH,
            data: binaryFileData,
            ...fileRef,
        };

        const writeFileOpts: WriteOpts = {
            consistency: opts.consistency,
            writeFile,
            progressListener: opts.progressListener,
            onController: opts.onController
        }

        await persistenceLayer.write(docID, docMeta, writeFileOpts);

        const backendFileRef = BackendFileRefs.toBackendFileRef(docMeta);

        return {
            action: 'imported',
            basename,
            docInfo: docMeta.docInfo,
            backendFileRef: backendFileRef!
        };

    }

    export async function computeHashcode(docPath: string): Promise<Hashcode> {

        const fileHashMeta = await computeHashPrefix(docPath);

        const hashcode: Hashcode = {
            enc: HashEncoding.BASE58CHECK,
            alg: HashAlgorithm.KECCAK256,
            data: fileHashMeta.hashcode
        };

        return hashcode;

    }

    async function computeHashPrefix(docPath: string): Promise<FileHashMeta> {

        const inputSource = await InputSources.ofValue(docPath);

        const hashcode = await Hashcodes.createFromInputSource(inputSource);
        const hashPrefix = hashcode.substring(0, 10);

        return { hashcode, hashPrefix };

    }

}

interface FileHashMeta {
    readonly hashPrefix: string;

    readonly hashcode: string;
}
