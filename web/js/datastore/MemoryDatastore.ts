/**
 * Datastore just in memory with no on disk persistence.
 */
import {Datastore} from './Datastore';
import {Preconditions} from '../Preconditions';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {FilePaths} from '../util/FilePaths';
import {Directories} from './Directories';
import {Logger} from '../logger/Logger';
import {DeleteResult} from './DiskDatastore';
import {FileDeleted} from '../util/Files';

const log = Logger.create();

export class MemoryDatastore implements Datastore {

    public readonly stashDir: string;

    public readonly dataDir: string;

    public readonly logsDir: string;

    protected readonly docMetas: {[fingerprint: string]: string} = {};

    constructor() {

        // these dir values are used in the UI and other places so we need to
        // actually have values for them.
        this.dataDir = Directories.getDataDir().path;
        this.stashDir = FilePaths.create(this.dataDir, "stash");
        this.logsDir = FilePaths.create(this.dataDir, "logs");

        this.docMetas = {};

    }

    // noinspection TsLint
    public async init() {

    }

    public async contains(fingerprint: string): Promise<boolean> {
        return fingerprint in this.docMetas;
    }

    public async delete(docMetaFileRef: DocMetaFileRef): Promise<Readonly<DeleteResult>> {

        const result: any = {
            docMetaFile: {
                path: `/${docMetaFileRef.fingerprint}.json`,
                deleted: false
            },
            dataFile: {
                path: `/${docMetaFileRef.filename}`,
                deleted: false
            }
        };

        if (await this.contains(docMetaFileRef.fingerprint)) {
            result.docMetaFile.deleted = true;
            result.dataFile.deleted = true;
        }

        return result;

    }

    /**
     */
    public async getDocMeta(fingerprint: string): Promise<string | null> {

        const nrDocs = Object.keys(this.docMetas).length;

        log.info(`Fetching document from datastore with fingerprint ${fingerprint} of ${nrDocs} docs.`);

        return this.docMetas[fingerprint];
    }

    /**
     * Write the datastore to disk.
     */
    public async sync(fingerprint: string, data: string) {

        Preconditions.assertTypeOf(data, "string", "data");

        this.docMetas[fingerprint] = data;
    }

    public async getDocMetaFiles(): Promise<DocMetaRef[]> {

        return Object.keys(this.docMetas)
            .map(fingerprint => <DocMetaRef> {fingerprint});

    }

}
