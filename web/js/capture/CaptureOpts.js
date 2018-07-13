class CaptureOpts {

    constructor(opts) {

        /**
         * When true, do not use AMP pages.
         *
         * @type {boolean}
         */
        this.amp = true;

        Object.assign(this, opts);

    }

}

module.exports.CaptureOpts = CaptureOpts;
