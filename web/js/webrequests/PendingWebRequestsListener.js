const {BaseWebRequestsListener} = require("./BaseWebRequestsListener");
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
         * The total number of requests that have been started.
         *
         * @type {number}
         */
        this.started = 0;

        /**
         * The total number of finished requests (either completed, or failed)
         *
         * @type {number}
         */
        this.finished = 0;

        /**
         * The current progress for the page from 0 to 100.
         *
         * @type {number}
         */
        this.progress = 0;

        /**
         * The actual events we've seen for tracking purposes.
         *
         * @type {Object<String,Object>}
         */
        this.pendingRequests = {};

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

        if(name === "onCompleted" || name === "onErrorOccurred" || name === "onBeforeRedirect" || name === "onAuthRequired") {
            // this request has already completed so is not considered against
            // pending any longer

            delete this.pendingRequests[details.url];

            --this.pending;
            ++this.finished;

        }

        if(name === "onBeforeRequest") {
            // after this request the pending will be incremented.

            this.pendingRequests[details.url] = details;

            ++this.pending;
            ++this.started;

        }

        this.progress = this.calculateProgress();

        if(this.pending < 5) {
            log.debug("The following pending requests remain: ", this.pendingRequests);
        }

        if(this.pending < 0) {
            throw new Error("Pending request count is negative: " + this.pending);
        }

        log.debug(`Pending requests: ${this.pending}, started=${this.started}, finished=${this.finished}, progress=${this.progress}: ` + JSON.stringify(details, null, "  "));

        this.dispatchEventListeners( {
            name,
            details,
            pending: this.pending,
            started: this.started,
            finished: this.finished,
            progress: this.progress
        });

        if(callback) {
            // the callback always has to be used or the requests will be
            // cancelled.
            callback({cancel: false});
        }

    }

    calculateProgress() {
        return 100 * (this.finished / this.started);
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
