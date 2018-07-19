/**
 * Listens to the metadata and syncs to the filesystem when the data is modified.
 *
 * We also
 *
 */
class DocMetaSyncListener {

    constructor(opts) {

        /**
         *
         * @type {boolean} True when we're currently writing data so that we're
         * not re-entrant.
         */
        this.writing = false;

        Object.assign(this, opts);

    }

}

module.exports.DocMetaSyncListener = DocMetaSyncListener;
