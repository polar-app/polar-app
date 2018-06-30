const {Reactor} = require("../reactor/Reactor");
const {Preconditions} = require("../Preconditions");

class WebRequestReactor {

    constructor(webRequest) {
        this.webRequest = Preconditions.assertNotNull(webRequest, "webRequest");
        this.reactor = new Reactor();
        this.started = false;
    }

    /**
     * Bind each webRequest event to go into the reactor.
     */
    start() {

        const eventRegisterFunctions = this.toEventRegisterFunctions();

        eventRegisterFunctions.forEach((eventRegisterFunction) => {
            let functionName = eventRegisterFunction.name;
            eventRegisterFunction = eventRegisterFunction.bind(this.webRequest);

            this.reactor.registerEvent(functionName);

            eventRegisterFunction((details, callback) => {

                // the functionName needs to be here twice because the first is
                // the event name and the second is the event name we're giving
                // to the callback.

                this.reactor.dispatchEvent(functionName, functionName, details, callback);

            })

        });

        this.started = true;

    }

    register(callback) {

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

    toEventRegisterFunctions() {

        return [
            this.webRequest.onBeforeRedirect,
            this.webRequest.onBeforeRequest,
            this.webRequest.onBeforeSendHeaders,
            this.webRequest.onCompleted,
            this.webRequest.onErrorOccurred,
            this.webRequest.onResponseStarted,
            this.webRequest.onSendHeaders
        ];

    }

}

module.exports.WebRequestReactor = WebRequestReactor;
