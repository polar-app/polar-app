import {WebRequest} from 'electron';
import {Preconditions} from '../Preconditions';
import {Reactor} from '../reactor/Reactor';
import OnBeforeRedirectDetails = Electron.OnBeforeRedirectDetails;
import OnBeforeRequestDetails = Electron.OnBeforeRequestDetails;
import OnCompletedDetails = Electron.OnCompletedDetails;
import OnErrorOccurredDetails = Electron.OnErrorOccurredDetails;
import OnResponseStartedDetails = Electron.OnResponseStartedDetails;
import OnSendHeadersDetails = Electron.OnSendHeadersDetails;


export class WebRequestReactor {

    public readonly webRequest: WebRequest;

    public readonly reactor: Reactor<NamedWebRequestEvent>;

    public started = false;

    constructor(webRequest: WebRequest) {
        this.webRequest = webRequest;
        this.reactor = new Reactor();
        this.started = false;
    }

    /**
     * Bind each webRequest event to go into the reactor.
     */
    start() {

        this.webRequest.onBeforeRedirect(this.handleBeforeRedirect.bind(this));
        this.webRequest.onBeforeRequest(this.handleBeforeRequest.bind(this));
        this.webRequest.onBeforeSendHeaders(this.handleBeforeSendHeaders.bind(this));
        this.webRequest.onCompleted(this.handleCompleted.bind(this));
        this.webRequest.onErrorOccurred(this.handleErrorOccurred.bind(this));
        this.webRequest.onResponseStarted(this.handleResponseStarted.bind(this));
        this.webRequest.onSendHeaders(this.handleSendHeaders.bind(this));

        this.started = true;

        // FIXME: our methods needc to call callback({cancel: false})

    }

    stop() {

        this.started = false;

        // TODO: consider clearing the reactor too.

    }


    register(callback: RegisterCallback) {

        Preconditions.assertNotNull(callback, "callback");

        if(! this.started) {
            throw new Error("Not started!");
        }

        this.reactor.eventNames().forEach(eventName => {
            this.reactor.addEventListener(eventName, callback);
        });

    }

    private handleBeforeRequest(details: OnBeforeRequestDetails, callback: (response: Electron.Response) => void): void {

        this.handleEvent({
            name: 'onBeforeRequest',
            details,
            callback,
        });

    }

    private handleBeforeSendHeaders(details: OnBeforeRequestDetails, callback: (response: Electron.Response) => void): void {

        this.handleEvent({
            name: 'onBeforeSendHeaders',
            details,
            callback,
        });

    }

    private handleBeforeRedirect(details: OnBeforeRedirectDetails): void {

        this.handleEvent({
            name: 'onBeforeRedirect',
            details
        });

    }

    private handleCompleted(details: OnCompletedDetails): void {

        this.handleEvent({
            name: 'onCompleted',
            details,
        });

    }

    private handleErrorOccurred(details: OnErrorOccurredDetails): void {

        this.handleEvent({
            name: 'onErrorOccurred',
            details,
        });

    }

    private handleResponseStarted(details: OnResponseStartedDetails): void {

        this.handleEvent({
            name: 'onResponseStarted',
            details,
        });

    }

     private handleSendHeaders(details: OnSendHeadersDetails): void {

        this.handleEvent({
            name: 'onSendHeaders',
            details,
        });

    }

    private handleEvent(event: NamedWebRequestEvent, callback?: (response: Electron.Response) => void) {

        if(! this.started) {

            if(callback) {
                callback({cancel: false});
            }

            return;
        }

        this.reactor.dispatchEvent(event.name, event);

    }

}

export interface RegisterCallback {
    (event: NamedWebRequestEvent): void;
}

export interface NamedWebRequestEvent {
    readonly name: string;

    // FIXME: correct details and callback
    readonly details: any;
    readonly callback?: (response: Electron.Response) => void;
}

