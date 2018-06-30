const {Logger} = require("../logger/Logger");
//const EventEmitter = electron.EventEmitter;
const log = Logger.create();


/**
 * Allows us to listen to all web requests and also register ourselves multiple
 * times.  The Electron WebRequests API says it's an EventEmitter but it's not
 * and addListener doesn't work so we had to add these ourselves.
 *
 */
class BaseWebRequestsListener {

    constructor() {
    }

    /**
     * Called when we receive an event.  All the events give us a 'details'
     * object.
     */
    onWebRequestEvent(name, details, callback) {

    }

    register(webRequestReactor) {
        webRequestReactor.register(this.onWebRequestEvent.bind(this));
    }

    //
    // /**
    //  * Register self with all callbacks to trace operation.
    //  *
    //  * @param webRequest {Electron.WebRequest}
    //  */
    // register(webRequest) {
    //
    //     //console.log("FIXME1 " + webRequest instanceof EventEmitter);
    //     console.log("FIXME2: ", webRequest.onBeforeRequest);
    //     console.log("FIXME5: ", webRequest.prototype);
    //
    //     console.log("FIXME4: ", webRequest.on);
    //     console.log("FIXME3: "  + webRequest.onBeforeRequest.addListener);
    //
    //     Preconditions.assertNotNull(webRequest, "webRequest")
    //
    //     const eventRegisterFunctions = [
    //         webRequest.onBeforeRedirect,
    //         webRequest.onBeforeRequest,
    //         webRequest.onBeforeSendHeaders,
    //         webRequest.onCompleted,
    //         webRequest.onErrorOccurred,
    //         webRequest.onResponseStarted,
    //         webRequest.onSendHeaders
    //     ];
    //
    //     // FIXME: refactor these to listen to use addListener which is
    //     // supported via EventEmitter
    //
    //     // eventRegisterFunctions.forEach((eventRegisterFunction) => {
    //     //     let functionName = eventRegisterFunction.name;
    //     //     eventRegisterFunction = eventRegisterFunction.bind(webRequest);
    //     //     eventRegisterFunction(this.onWebRequestEvent.bind(this, functionName));
    //     // });
    //
    //     eventRegisterFunctions.forEach((eventRegisterFunction) => {
    //         let functionName = eventRegisterFunction.name;
    //         eventRegisterFunction = eventRegisterFunction.bind(webRequest);
    //         //eventRegisterFunction(this.onWebRequestEvent.bind(this, functionName));
    //         //webRequest.addListener(functionName, this.onWebRequestEvent.bind(this, functionName));
    //
    //         webRequest.addListener("before-request", function(name, details, callback) {
    //
    //             log.info("HERE");
    //
    //             if(callback)
    //                 callback({cancel: false});
    //
    //         });
    //
    //     });
    //
    // }

}

module.exports.BaseWebRequestsListener = BaseWebRequestsListener;
