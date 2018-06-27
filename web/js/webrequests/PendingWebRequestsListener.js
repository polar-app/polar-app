const BaseWebRequestsListener = require("./BaseWebRequestsListener").BaseWebRequestsListener;
const {Logger} = require("../logger/Logger");
const log = Logger.create();

/**
 * Tracks the number of pending requests.
 *
 */
class PendingWebRequestsListener extends BaseWebRequestsListener {

    constructor() {

        super();

        /** The number of pending requests
         *
         * @type {number}
         */
        this.pending = 0;

        /**
         * Registered event listeners that we would need to dispatch.
         *
         * @type {Array<Function>}
         */
        this.eventListeners = [];

    }

    /**
     * Called when we receive an event.  All the events give us a 'details'
     * object.
     */
    onWebRequestEvent(name, details, callback) {

        if(name === "onCompleted" || name === "onErrorOccurred") {
            // this request has already completed so is not considered against
            // pending any longer
            --this.pending;
            this.dispatchEventListeners({pending: this.pending});
        }

        if(name === "onBeforeRequest") {
            // after this request the pending will be incremented.
            ++this.pending;
            this.dispatchEventListeners({pending: this.pending});
        }

        if(callback) {
            // the callback always has to be used or the requests will be
            // cancelled.
            callback({cancel: false});
        }

    }

    /**
     *
     * @param eventListener {Function}
     */
    addEventListener(eventListener) {
        this.eventListeners.push(eventListener);
    }

    dispatchEventListeners(event) {
        this.eventListeners.forEach(eventListener => {
            eventListener(event);
        })
    }

}

module.exports.PendingWebRequestsListener = PendingWebRequestsListener;
