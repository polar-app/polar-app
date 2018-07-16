class CaptureResult {

    constructor(opts) {

        /**
         * The path to the resulting PHZ file.
         *
         * @type {string}
         */
        this.path = undefined;

        Object.assign(this, opts);

    }

}

module.exports.CaptureResult = CaptureResult;
