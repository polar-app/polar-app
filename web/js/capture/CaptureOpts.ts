export class CaptureOpts {

    /**
     * When true, do not use AMP pages.
     *
     * @type {boolean}
     */
    public readonly amp = true;

    /**
     * A callback which receives updates about the pending web requests for
     * updating the UI.
     */
    public readonly pendingWebRequestsCallback: Function;

    constructor(opts: any = {}) {

        this.pendingWebRequestsCallback = opts.pendingWebRequestsCallback;

        Object.assign(this, opts);

    }

}
