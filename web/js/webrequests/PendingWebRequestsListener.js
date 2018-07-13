const {BaseWebRequestsListener} = require("./BaseWebRequestsListener");
const {Logger} = require("../logger/Logger");
const {RequestState} = require("./RequestState");
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
         * The map of all states for all URLs.
         */
        this.requests = {};

        /**
         * Registered event listeners that we would need to dispatch.
         *
         * @type {Array<Function>}
         */
        this.eventListeners = [];

        /**
         * Keeps track of metadata for each request to help detect errors.
         *
         * @type {RequestState}
         */
        this.requestState = new RequestState();

        this.startedRequests = {};

        this.finishedRequests = {};

    }

    /**
     * Called when we receive an event.  All the events give us a 'details'
     * object.
     */
    onWebRequestEvent(name, details, callback) {

        let pendingChange = null;

        // https://developer.chrome.com/extensions/webRequest

        // WARN: I don't think increment + decrement work here as I suspect
        // multiple threads are calling us so we're having to keep requests
        // in maps which wastes a bit more memory. I suspect we have one thread
        // per iframe.  Either way using dictionaries avoided a -1 pending
        // count.

        if(name === "onBeforeRequest") {
            // after this request the pending will be incremented.

            this.pendingRequests[details.url] = details;

            this.startedRequests[details.id] = details.url;

            pendingChange = "INCREMENTED";

            this.requestState.markStarted(details.id, details.url);

        }

        if(name === "onCompleted" || name === "onErrorOccurred" || name === "onBeforeRedirect" || name === "onAuthRequired") {

            // this request has already completed so is not considered against
            // pending any longer

            delete this.pendingRequests[details.url];

            this.finishedRequests[details.id] = details.url;

            pendingChange = "DECREMENTED";

            this.requestState.markFinished(details.id, details.url);

        }

        this.finished = Object.keys(this.finishedRequests).length;
        this.started = Object.keys(this.startedRequests).length;

        this.pending = this.started - this.finished;

        if(pendingChange) {
            log.info(`Pending state ${pendingChange} for request id=${details.id} to ${this.pending} on ${name} for URL: ${details.url}`);
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
