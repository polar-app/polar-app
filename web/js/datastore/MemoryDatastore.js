const {Datastore} = require("./Datastore.js");
const {DiskDatastore} = require("./DiskDatastore");
const {Preconditions} = require("../Preconditions");
const {Paths} = require("../util/Paths");

/**
 * Datastore just in memory with no on disk persistence.
 */
class MemoryDatastore extends Datastore {

    constructor() {

        super();

        // these dir values are used in the UI and other places so we need to
        // actually have values for them.
        this.dataDir = DiskDatastore.getDataDir();
        this.stashDir = Paths.create(this.dataDir, "stash");

        /**
         *
         * @type map<string,string>
         */
        this.docMetas = {};

    }

    async init() {

    }

    /**
     * @return {string}
     */
    async getDocMeta(fingerprint) {

        let nrDocs = Object.keys(this.docMetas).length;

        console.log(`Fetching document from datastore with fingerprint ${fingerprint} of ${nrDocs} docs.`)

        return this.docMetas[fingerprint];
    }

    /**
     * Write the datastore to disk.
     */
    async sync(fingerprint, data) {

        Preconditions.assertTypeOf(data, "string", "data");

        this.docMetas[fingerprint] = data;
    }

};

module.exports.MemoryDatastore = MemoryDatastore;
