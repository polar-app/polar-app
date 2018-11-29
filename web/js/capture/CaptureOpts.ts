import {PendingWebRequestsCallback} from '../webrequests/PendingWebRequestsListener';
import {Capture} from './Capture';

export interface CaptureOpts {

    /**
     * A callback which receives updates about the pending web requests for
     * updating the UI.
     */
    readonly pendingWebRequestsCallback?: PendingWebRequestsCallback;

    /**
     * When true, index amp content.
     */
    readonly amp: boolean;

    /**
     * When given a link go ahead and start by capturing it.
     */
    readonly link?: string;

}

export class DefaultCaptureOpts implements CaptureOpts {
    public readonly amp: boolean = false;
}
