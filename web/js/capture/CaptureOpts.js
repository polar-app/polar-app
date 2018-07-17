class CaptureOpts {

    constructor(opts) {

        /**
         * When true, do not use AMP pages.
         *
         * @type {boolean}
         */
        this.amp = true;

        /**
         * A callback which receives updates about the pending web requests for
         * updating the UI.
         *
         * @type {Function}
         */
        this.pendingWebRequestsCallback = null;

        Object.assign(this, opts);

    }

}

module.exports.CaptureOpts = CaptureOpts;
