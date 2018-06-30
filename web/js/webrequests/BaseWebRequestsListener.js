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

    /**
     *
     * @param webRequestReactor {WebRequestReactor}
     */
    register(webRequestReactor) {
        webRequestReactor.register(this.onWebRequestEvent.bind(this));
    }

}

module.exports.BaseWebRequestsListener = BaseWebRequestsListener;
