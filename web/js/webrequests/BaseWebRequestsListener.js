
/**
 * Allows us to listen to all web requests.
 *
 */
class BaseWebRequestsListener {

    /**
     * Called when we receive an event.  All the events give us a 'details'
     * object.
     */
    onWebRequestEvent(name, details, callback) {

    }

    /**
     * Register self with all callbacks to trace operation.
     *
     * @param webRequest {Electron.WebRequest}
     */
    register(webRequest) {
        console.log("FIXME: 00!!!!");

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
            let functionName = eventRegisterFunction.name;
            eventRegisterFunction = eventRegisterFunction.bind(webRequest);
            eventRegisterFunction(this.onWebRequestEvent.bind(this, functionName));
        });

    }

}

module.exports.BaseWebRequestsListener = BaseWebRequestsListener;
