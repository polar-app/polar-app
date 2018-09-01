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

        // TODO: this is a bit ugly to duplicate this but it might be possible
        // to refactor in the future to make it a bit cleaner.

        let eventNames = [
            "onBeforeRedirect",
            "onBeforeRequest",
            "onBeforeSendHeaders",
            "onCompleted",
            "onErrorOccurred",
            "onResponseStarted",
            "onSendHeaders",
        ];

        eventNames.forEach(eventName => {
            this.reactor.registerEvent(eventName);
        });

        this.started = true;

    }

    stop() {

        this.started = false;

        this.webRequest.onBeforeRedirect(null!);
        this.webRequest.onBeforeRequest(null!);
        this.webRequest.onBeforeSendHeaders(null!);
        this.webRequest.onCompleted(null!);
        this.webRequest.onErrorOccurred(null!);
        this.webRequest.onResponseStarted(null!);
        this.webRequest.onSendHeaders(null!);


        // TODO: consider clearing the reactor too.

    }


    register(callback: RegisterCallback) {

        Preconditions.assertNotNull(callback, "callback");

        if(! this.started) {
            throw new Error("Not started!");
        }

        // FIXME: this isnt' goign to have any event names to register..

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

    readonly details: WebRequestDetails;

    readonly callback?: (response: Electron.Response) => void;
}

export interface WebRequestDetails {

    readonly id: number;
    readonly url: string;
    readonly method: string;
    readonly webContentsId?: number;
    readonly resourceType: string;

}
