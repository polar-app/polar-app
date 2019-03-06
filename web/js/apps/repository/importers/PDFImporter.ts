import {PersistenceLayer} from '../../../datastore/PersistenceLayer';
import {FilePaths} from '../../../util/FilePaths';
import {DocMetas} from '../../../metadata/DocMetas';
import {Logger} from '../../../logger/Logger';
import {PDFMetadata} from './PDFMetadata';
import {Optional} from '../../../util/ts/Optional';
import {FileHandle, Files} from '../../../util/Files';
import {Hashcodes} from '../../../Hashcodes';
import {Backend} from '../../../datastore/Backend';
import {Directories} from '../../../datastore/Directories';
import {DatastoreFiles} from '../../../datastore/DatastoreFiles';
import {DocInfo} from '../../../metadata/DocInfo';
import {HashAlgorithm, HashEncoding} from '../../../metadata/Hashcode';
import {IProvider} from '../../../util/Providers';
import {BinaryFileData} from '../../../datastore/Datastore';
import {URLs} from '../../../util/URLs';
import {InputSources} from '../../../util/input/InputSources';

const log = Logger.create();

/**
 * Handles taking a given file, parsing the metadata, and then writing a new
 * DocMeta file and importing the PDF file to the stash.
 */
export class PDFImporter {

    private readonly persistenceLayerProvider: IProvider<PersistenceLayer>;

    constructor(persistenceLayerProvider: IProvider<PersistenceLayer>) {
        this.persistenceLayerProvider = persistenceLayerProvider;
    }

    /**
     *
     * @param docPath
     * @param basename The basename of the file - 'mydoc.pdf' without the full
     *                 path information.  This is needed because blob URLs might
     *                 not actually have the full metadata we need that the
     *                 original input URL has given us.
     */
    public async importFile(docPath: string, basename?: string): Promise<Optional<ImportedFile>> {

        const directories = new Directories();

        const isPath = ! URLs.isURL(docPath);

        log.info(`Working with document: ${docPath}: ${isPath}`);

        if (isPath && await PDFImporter.isWithinStashdir(directories.stashDir, docPath)) {

            // prevent the user from re-importing/opening a file that is ALREADY
            // in the stash dir.

            log.warn("Skipping import of file that's already in the stashdir.");
            return Optional.empty();

        }

        const pdfMeta = await PDFMetadata.getMetadata(docPath);

        const persistenceLayer = this.persistenceLayerProvider.get();

        if (await persistenceLayer.contains(pdfMeta.fingerprint)) {

            log.warn(`File already present in datastore: fingerprint=${pdfMeta.fingerprint}: ${docPath}`);

            const docMeta = await persistenceLayer.getDocMeta(pdfMeta.fingerprint);

            if (docMeta) {

                if (docMeta.docInfo.filename) {

                    // return the existing doc meta information.

                    const stashFilePath = FilePaths.join(directories.stashDir, docMeta.docInfo.filename);
                    return Optional.of({
                        stashFilePath,
                        docInfo: docMeta.docInfo
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

        const defaultTitle = basename || "";

        // TODO: this is not particularly efficient to create the hashcode
        // first, then copy the bytes to the target location.  It would be
        // better, locally, copy and compute the hash on copy but we would have
        // to rename it and that's not an operation I want to support in the
        // datastore. This could be optimized but wait until people complain
        // about it as it's probably premature at this point.

        // TODO(webapp): this doesn't work either becasue it assumes that we can
        // easily and cheaply read from the URL / blob URL but I guess that's
        // true in this situation though it's assuming a FILE and not a blob URL
        const fileHashMeta = await PDFImporter.computeHashPrefix(docPath);

        const filename = `${fileHashMeta.hashPrefix}-` + DatastoreFiles.sanitizeFileName(basename!);

        const stashFilePath = FilePaths.join(directories.stashDir, filename);

        // always read from a stream here as some of the PDFs we might want to
        // import could be rather large.  Also this needs to be a COPY of the
        // data, not a symlink since that's not really portable and it would
        // also be danging if the user deleted the file.  Wasting space here is
        // a good thing.  Space is cheap.

        const toData = async (): Promise<BinaryFileData> => {

            // TODO(webapp): make this into a toBlob function call
            if (docPath.startsWith("blob:")) {
                return await fetch(docPath).then(r => r.blob());
            }

            return <FileHandle> {path: docPath};

        };

        const data: BinaryFileData = await toData();

        const docMeta = DocMetas.create(pdfMeta.fingerprint, pdfMeta.nrPages, filename);

        docMeta.docInfo.title = Optional.of(pdfMeta.title)
                                        .getOrElse(defaultTitle);

        docMeta.docInfo.description = pdfMeta.description;
        docMeta.docInfo.doi = pdfMeta.doi;

        docMeta.docInfo.hashcode = {
            enc: HashEncoding.BASE58CHECK,
            alg: HashAlgorithm.KECCAK256,
            data: fileHashMeta.hashcode
        };

        const fileRef = {
            name: filename,
            hashcode: docMeta.docInfo.hashcode
        };

        await persistenceLayer.writeFile(Backend.STASH, fileRef, data);

        await persistenceLayer.write(pdfMeta.fingerprint, docMeta);

        return Optional.of({
            stashFilePath,
            docInfo: docMeta.docInfo
        });

    }

    private static async computeHashPrefix(docPath: string): Promise<FileHashMeta> {

        const inputSource = await InputSources.ofValue(docPath);

        const hashcode = await Hashcodes.createFromInputSource(inputSource);
        const hashPrefix = hashcode.substring(0, 10);

        return { hashcode, hashPrefix };

    }

    private static async isWithinStashdir(stashDir: string, path: string): Promise<boolean> {

        const currentDirname = await Files.realpathAsync(FilePaths.dirname(path));

        stashDir = await Files.realpathAsync(stashDir);

        return currentDirname === stashDir;

    }

}

export interface ImportedFile {

    /**
     * The DocInfo for the file we just imported.
     */
    docInfo: DocInfo;

    /**
     * The full path of the file that we imported and where it is in the stash.
     */
    stashFilePath: string;

}

interface FileHashMeta {
    hashPrefix: string;
    hashcode: string;
}
