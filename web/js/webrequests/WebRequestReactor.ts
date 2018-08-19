import {WebRequest} from 'electron';
import {Preconditions} from '../Preconditions';

const {Reactor} = require("../reactor/Reactor");

export class WebRequestReactor {

    public readonly webRequest: WebRequest;

    public readonly reactor: any;

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

        const eventRegisterFunctions = this.toEventRegisterFunctions();

        let webRequestReactor = this;

        eventRegisterFunctions.forEach((eventRegisterFunction) => {

            // FIXME: this won't work as we need to keep the function mame
            let functionName = eventRegisterFunction.name;

            eventRegisterFunction = eventRegisterFunction.bind(this.webRequest);

            this.reactor.registerEvent(functionName);

            eventRegisterFunction((details, callback) => {

                // the functionName needs to be here twice because the first is
                // the event name and the second is the event name we're giving
                // to the callback.

                if(webRequestReactor.started) {
                    this.reactor.dispatchEvent(functionName, functionName, details, callback);
                }

            })

        });

        this.started = true;

    }

    stop() {

        // TODO: I don't think this properly removes the event we're trying to
        // remove.

        this.started = false;

        const eventRegisterFunctions = this.toEventRegisterFunctions();

        eventRegisterFunctions.forEach((eventRegisterFunction) => {

            let functionName = eventRegisterFunction.name;
            this.reactor.clearEvent(functionName);

            eventRegisterFunction = eventRegisterFunction.bind(this.webRequest);
            eventRegisterFunction((details, callback) => {

                if(callback)
                    callback({cancel: false})

            });

        });

    }


    register(callback: RegisterCallback) {

        Preconditions.assertNotNull(callback, "callback");

        if(! this.started) {
            throw new Error("Not started!");
        }

        const eventRegisterFunctions = this.toEventRegisterFunctions();

        // now for each off the events, register a function to call...
        eventRegisterFunctions.forEach((eventRegisterFunction) => {
            let functionName = eventRegisterFunction.name;
            this.reactor.addEventListener(functionName, callback);
        });

    }

    toEventRegisterFunctions(): {[name: string]: WebRequestEventCallback} {

        // FIXME: this won't work as we need to keep the function mame

        // FIXME: refactor this into a GenericCallback method with an optional
        // callback and a Details object that's standardized.

        return {
            //(listener: WebRequestEventListener) => this.webRequest.onBeforeRedirect((details: any) => {listener(details)}),
            'onBeforeRedirect': (listener: WebRequestEventListener) => this.webRequest.onBeforeRedirect(listener),
            'onBeforeRequest': (listener: WebRequestEventListener) => this.webRequest.onBeforeRequest((details: any, callback) => {listener(details, callback)}),
            // this.webRequest.onBeforeRequest,
            // this.webRequest.onBeforeSendHeaders,
            // this.webRequest.onCompleted,
            // this.webRequest.onErrorOccurred,
            // this.webRequest.onResponseStarted,
            // this.webRequest.onSendHeaders
        };

    }

}

export interface RegisterCallback {
    // FIXME: correct details and callback
    (name: string, details: any, callback: any): void;
}

export interface WebRequestEventCallback {
    (listener: WebRequestEventListener): void;
}

export interface WebRequestEventListener {
    (details: any, callback?: WebRequestCallbackFunction): void;
}

export interface WebRequestCallbackFunction {
    (response?: Electron.Response): void
}

export interface CallbackResponse {

    readonly cancel?: boolean;

    readonly redirectURL?: String;

}
