/**
 * Datastore just in memory with no on disk persistence.
 */
import {DiskDatastore} from './DiskDatastore';
import {Datastore} from './Datastore';
import {Preconditions} from '../Preconditions';
import {DocMetaRef} from './DocMetaRef';
import {FilePaths} from '../util/FilePaths';

export class MemoryDatastore implements Datastore {

    public readonly stashDir: string;

    public readonly dataDir: string;

    public readonly logsDir: string;

    protected readonly docMetas: {[fingerprint: string]: string} = {};

    constructor() {

        // these dir values are used in the UI and other places so we need to
        // actually have values for them.
        this.dataDir = DiskDatastore.getDataDir();
        this.stashDir = FilePaths.create(this.dataDir, "stash");
        this.logsDir = FilePaths.create(this.dataDir, "logs");

        this.docMetas = {};

    }

    async init() {

    }

    public async contains(fingerprint: string): Promise<boolean> {
        return fingerprint in this.docMetas;
    }

    /**
     */
    async getDocMeta(fingerprint: string): Promise<string | null> {

        let nrDocs = Object.keys(this.docMetas).length;

        console.log(`Fetching document from datastore with fingerprint ${fingerprint} of ${nrDocs} docs.`)

        return this.docMetas[fingerprint];
    }

    /**
     * Write the datastore to disk.
     */
    async sync(fingerprint: string, data: string) {

        Preconditions.assertTypeOf(data, "string", "data");

        this.docMetas[fingerprint] = data;
    }

    async getDocMetaFiles(): Promise<DocMetaRef[]> {

        return Object.keys(this.docMetas)
            .map(fingerprint => <DocMetaRef>{fingerprint});

    }

}
