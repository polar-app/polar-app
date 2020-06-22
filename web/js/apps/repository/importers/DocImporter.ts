import {PersistenceLayerProvider} from '../../../datastore/PersistenceLayer';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {DocMetas} from '../../../metadata/DocMetas';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {FileHandle} from 'polar-shared/src/util/Files';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DatastoreFiles} from '../../../datastore/DatastoreFiles';
import {
    HashAlgorithm,
    Hashcode,
    HashEncoding
} from 'polar-shared/src/metadata/Hashcode';
import {BackendFileRefData, BinaryFileData} from '../../../datastore/Datastore';
import {URLs} from 'polar-shared/src/util/URLs';
import {InputSources} from 'polar-shared/src/util/input/InputSources';
import {BackendFileRefs} from '../../../datastore/BackendFileRefs';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";
import {IParsedDocMeta} from "polar-shared/src/util/IParsedDocMeta";
import {DocMetadata} from "./DocMetadata";

const log = Logger.create();

/**
 * Handles taking a given file, parsing the metadata, and then writing a new
 * DocMeta file and importing the PDF file to the stash.
 */
export class DocImporter {

    constructor(private readonly persistenceLayerProvider: PersistenceLayerProvider) {
    }

    /**
     *
     * @param docPath
     * @param basename The basename of the file - 'mydoc.pdf' without the full
     *                 path information.  This is needed because blob URLs might
     *                 not actually have the full metadata we need that the
     *                 original input URL has given us.
     * @param opts The PDF importer options.
     */
    public async importFile(docPath: string,
                            basename: string,
                            opts: PDFImportOpts = {}): Promise<Optional<ImportedFile>> {

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

        const isPath = ! URLs.isURL(docPath);

        log.info(`Working with document: ${docPath}: ${isPath}`);

        const rawMeta = opts.parsedDocMeta || await DocMetadata.getMetadata(docPath, docType);

        const persistenceLayer = this.persistenceLayerProvider();

        if (await persistenceLayer.contains(rawMeta.fingerprint)) {

            log.warn(`File already present in datastore: fingerprint=${rawMeta.fingerprint}: ${docPath}`);

            const docMeta = await persistenceLayer.getDocMeta(rawMeta.fingerprint);

            if (docMeta) {

                if (docMeta.docInfo.filename) {

                    // return the existing doc meta information.

                    const backendFileRef = BackendFileRefs.toBackendFileRef(docMeta);

                    const basename = FilePaths.basename(docMeta.docInfo.filename);
                    return Optional.of({
                        basename,
                        docInfo: docMeta.docInfo,
                        backendFileRef: backendFileRef!
                    });

                }

            }

            return Optional.empty();

        }

        // create a default title from the path which is used as sometimes the
        // filename is actually a decent first attempt at a document title.

        if (!basename && ! docPath.startsWith("blob:")) {
            basename = FilePaths.basename(docPath);
        }

        const defaultTitle = opts?.docInfo?.title || basename || "";

        // TODO: this is not particularly efficient to create the hashcode
        // first, then copy the bytes to the target location.  It would be
        // better, locally, copy and compute the hash on copy but we would have
        // to rename it and that's not an operation I want to support in the
        // datastore. This could be optimized but wait until people complain
        // about it as it's probably premature at this point.

        // TODO(webapp): this doesn't work either becasue it assumes that we can
        // easily and cheaply read from the URL / blob URL but I guess that's
        // true in this situation though it's assuming a FILE and not a blob URL
        const fileHashMeta = await DocImporter.computeHashPrefix(docPath);

        const filename = `${fileHashMeta.hashPrefix}-` + DatastoreFiles.sanitizeFileName(basename!);

        // always read from a stream here as some of the documents we might want
        // to import could be rather large.  Also this needs to be a COPY of the
        // data, not a symlink since that's not really portable and it would
        // also be danging if the user deleted the file.  Wasting space here is
        // a good thing.  Space is cheap.

        const toBinaryFileData = async (): Promise<BinaryFileData> => {

            // TODO(webapp): make this into a toBlob function call
            if (URLs.isURL(docPath)) {
                log.info("Reading data from URL: ", docPath);
                const response = await fetch(docPath);
                const blob = await response.blob();
                return blob;
            }

            return <FileHandle> {path: docPath};

        };

        const binaryFileData: BinaryFileData = await toBinaryFileData();

        const docMeta = DocMetas.create(rawMeta.fingerprint, rawMeta.nrPages, filename);

        docMeta.docInfo.title = Optional.of(rawMeta.title)
                                        .getOrElse(defaultTitle);

        docMeta.docInfo.description = rawMeta.description;
        docMeta.docInfo.doi = rawMeta.doi;

        docMeta.docInfo.hashcode = {
            enc: HashEncoding.BASE58CHECK,
            alg: HashAlgorithm.KECCAK256,
            data: fileHashMeta.hashcode
        };

        const fileRef = {
            name: filename,
            hashcode: docMeta.docInfo.hashcode
        };

        const writeFile: BackendFileRefData = {
            backend: Backend.STASH,
            data: binaryFileData,
            ...fileRef
        };

        await persistenceLayer.write(rawMeta.fingerprint, docMeta, {writeFile});

        const backendFileRef = BackendFileRefs.toBackendFileRef(docMeta);

        return Optional.of({
            basename,
            docInfo: docMeta.docInfo,
            backendFileRef: backendFileRef!
        });

    }

    public static async computeHashcode(docPath: string): Promise<Hashcode> {

        const fileHashMeta = await DocImporter.computeHashPrefix(docPath);

        const hashcode: Hashcode = {
            enc: HashEncoding.BASE58CHECK,
            alg: HashAlgorithm.KECCAK256,
            data: fileHashMeta.hashcode
        };

        return hashcode;

    }

    private static async computeHashPrefix(docPath: string): Promise<FileHashMeta> {

        const inputSource = await InputSources.ofValue(docPath);

        const hashcode = await Hashcodes.createFromInputSource(inputSource);
        const hashPrefix = hashcode.substring(0, 10);

        return { hashcode, hashPrefix };

    }

}

export interface ImportedFile {

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

interface FileHashMeta {
    readonly hashPrefix: string;

    readonly hashcode: string;
}

interface PDFImportOpts {
    readonly parsedDocMeta?: IParsedDocMeta;
    readonly docInfo?: Partial<IDocInfo>;
}
