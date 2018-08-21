import {PendingWebRequestsCallback} from '../webrequests/PendingWebRequestsListener';

export interface CaptureOpts {

    /**
     * A callback which receives updates about the pending web requests for
     * updating the UI.
     */
    readonly pendingWebRequestsCallback?: PendingWebRequestsCallback;

    /**
     * When true, do not use AMP pages.
     */
    readonly amp: boolean;

}
