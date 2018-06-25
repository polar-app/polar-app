/**
 * Lightweight document descriptor representing documents easily without having
 * to pass around the full document.
 */
class DocDescriptor {

    constructor(opts) {

        /**
         * The fingerprint representing the document we're working with.
         * @type {null}
         */
        this.fingerprint = null;

        Object.assign(this, opts);

    }

}

module.exports.DocDescriptor = DocDescriptor;
