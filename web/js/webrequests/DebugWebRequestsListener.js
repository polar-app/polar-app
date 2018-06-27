const Logger = require("../logger/Logger").Logger;

const log = Logger.create();

/**
 * A simple debug web requests listener which just traces the output so that we
 * can better understand the event flow.
 *
 * Main API documentation is here:
 *
 * https://electronjs.org/docs/api/web-request
 *
 */
class DebugWebRequestsListener {

    /**
     * Called when we receive an event.  All the events give us a 'details'
     * object.
     */
    eventListener(name, details, callback) {

        log.info(`${name}: `, JSON.stringify(details, null, "  "));

        if(callback) {
            // the callback always has to be used or the requests will be
            // cancelled.
            callback({cancel: false});
        }

    }

    /**
     * Register self with all callbacks to trace operation.
     *
     * @param webRequest {Electron.WebRequest}
     */
    register(webRequest) {

        const eventRegisterFunctions = [
            webRequest.onBeforeRedirect,
            webRequest.onBeforeRequest,
            webRequest.onBeforeSendHeaders,
            webRequest.onCompleted,
            webRequest.onErrorOccurred,
            webRequest.onResponseStarted,
            webRequest.onSendHeaders
        ];

        eventRegisterFunctions.forEach((eventRegisterFunction) => {
            eventRegisterFunction = eventRegisterFunction.bind(webRequest);
            eventRegisterFunction(this.eventListener.bind(this, eventRegisterFunction.name));
        });

        console.log(webRequest);

    }

}

module.exports.DebugWebRequestsListener = DebugWebRequestsListener;
