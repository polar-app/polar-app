import {IPersistenceLayer} from '../../../datastore/IPersistenceLayer';
import {FilePaths} from '../../../util/FilePaths';
import {DocMetas} from '../../../metadata/DocMetas';
import {FileLoader} from '../../main/loaders/FileLoader';
import {Logger} from '../../../logger/Logger';
import {PDFMetadata} from './PDFMetadata';
import {Optional} from '../../../util/ts/Optional';
import {Files} from '../../../util/Files';
import {Hashcodes} from '../../../Hashcodes';
import {Backend} from '../../../datastore/Backend';
import {Directories} from '../../../datastore/Directories';
import {DatastoreFiles} from '../../../datastore/DatastoreFiles';

const log = Logger.create();

/**
 * Handles taking a given file, parsing the metadata, and then writing a new
 * DocMeta file and importing the PDF file to the stash.
 */
export class PDFImporter {

    private readonly persistenceLayer: IPersistenceLayer;

    constructor(persistenceLayer: IPersistenceLayer) {
        this.persistenceLayer = persistenceLayer;
    }

    public async importFile(filePath: string): Promise<boolean> {

        if (await PDFImporter.isWithinStashdir(filePath)) {
            // prevent the user from re-importing/opening a file that is ALREADY
            // in the stash dir.

            log.warn("Skipping import of file that's already in the stashdir.");
            return false;
        }

        const pdfMeta = await PDFMetadata.getMetadata(filePath);

        if (this.persistenceLayer.contains(pdfMeta.fingerprint)) {
            log.warn(`This file is already present in the datastore with fingerprint ${pdfMeta.fingerprint}: ${filePath}`);
            return false;
        }

        // create a default title from the path which is used as sometimes the
        // filename is actually a decent first attempt at a document title.
        const basename = FilePaths.basename(filePath);
        const defaultTitle = basename;

        // TODO: this is not particularly efficient to create the hashcode
        // first, then copy the bytes to the target location.  It would be
        // better, locally, copy and compute the hash on copy but we would have
        // to rename it and that's not an operation I want to support in the
        // datastore. This could be optimized but wait until people complain
        // about it as it's probably premature at this point.

        const hashprefix = await Hashcodes.createFromStream(Files.createReadStream(filePath));

        const filename = `${hashprefix}-` + DatastoreFiles.sanitizeFileName(basename);

        // always read from a stream here as some of the PDFs we might want to
        // import could be rather large.  Also this needs to be a COPY of the
        // data, not a symlink since that's not really portable and it would
        // also be danging if the user deleted the file.  Wasting space here is
        // a good thing.  Space is cheap.
        this.persistenceLayer.addFile(Backend.STASH, filename, Files.createReadStream(filePath));

        const docMeta = DocMetas.create(pdfMeta.fingerprint, pdfMeta.nrPages, filename);

        docMeta.docInfo.title = Optional.of(pdfMeta.title)
                                        .getOrElse(defaultTitle);

        docMeta.docInfo.description = pdfMeta.description;

        await this.persistenceLayer.sync(pdfMeta.fingerprint, docMeta);

        return true;


    }

    private static async isWithinStashdir(path: string): Promise<boolean> {

        const directories = new Directories();

        const currentDirname = await Files.realpathAsync(FilePaths.dirname(path));

        const stashDir = await Files.realpathAsync(directories.stashDir);

        return currentDirname === stashDir;

    }

}
