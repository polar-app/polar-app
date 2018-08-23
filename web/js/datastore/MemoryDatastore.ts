/**
 * Datastore just in memory with no on disk persistence.
 */
import {Paths} from '../util/Paths';
import {DiskDatastore} from './DiskDatastore';
import {Datastore} from './Datastore';
import {Preconditions} from '../Preconditions';

export class MemoryDatastore extends Datastore {

    private readonly dataDir: string;

    private readonly stashDir: string;

    private readonly docMetas: {[fingerprint: string]: string} = {};

    constructor() {

        super();

        // these dir values are used in the UI and other places so we need to
        // actually have values for them.
        this.dataDir = DiskDatastore.getDataDir();
        this.stashDir = Paths.create(this.dataDir, "stash");

        this.docMetas = {};

    }

    async init() {

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

};
