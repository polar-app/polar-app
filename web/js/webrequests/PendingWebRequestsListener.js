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
     * object about the request.
     */
    onWebRequestEvent(name, details, callback) {

        // WARNING: this code behaves VERY strangely and we DO NOT receive events
        // in the proper order for some reason.  I would expect to receive them
        // in the logical order detailed here:
        //
        // https://developer.chrome.com/extensions/webRequest
        //
        // but we actually receive them out of order.
        //
        // this means that the pending request count can go to negative until
        // it goes positive. I suspect that they're using some sort of multi-core
        // or unfair queue system that re-orders the events before I see it or
        // this code is executing across multiple threads on multiple cores and
        // the data is being handled balanced across cores which is why we see
        // ordering issues.
        //
        // I've added some logging to the code so we can trace this but it's
        // rather difficult to deal with because a real but could happen
        // around dropped messages but we wouldn't notice that where negative
        // counts could catch it.

        let pendingChange = null;


        // WARN: I don't think increment + decrement work here as I suspect
        // multiple threads are calling us so we're having to keep requests
        // in maps which wastes a bit more memory. I suspect we have one thread
        // per iframe.  Either way using dictionaries avoided a -1 pending
        // count.

        if(name === "onBeforeRequest") {
            // after this request the pending will be incremented.

            this.pendingRequests[details.url] = details;

            this.startedRequests[details.id] = {
                // the event used to mark the request started
                event: name,
                id: details.id,
                url: details.url
            };

            pendingChange = "INCREMENTED";

            this.requestState.markStarted(details.id, details.url);

        }


        // NOTE onErrorOccurred is a fail through for many of these I think.
        if(name === "onCompleted" || name === "onErrorOccurred" || name === "onBeforeRedirect" || name === "onAuthRequired") {

            // this request has already completed so is not considered against
            // pending any longer

            delete this.pendingRequests[details.url];

            this.finishedRequests[details.id] = {
                // the name of the event that we used to mark finished.
                event: name,
                id: details.id,
                url: details.url
            };

            pendingChange = "DECREMENTED";

            this.requestState.markFinished(details.id, details.url);

        }

        /**
         * The total number of requests that have been started.
         *
         * @type {number}
         */
        let started = Object.keys(this.startedRequests).length;

        /**
         * The total number of finished requests (either completed, or failed)
         *
         * @type {number}
         */
        let finished = Object.keys(this.finishedRequests).length;

        /**
         * The number of pending requests that have not yet finished.
         *
         * @type {number}
         */
        let pending = started - finished;

        if(pendingChange) {
            log.info(`Pending state ${pendingChange} for request id=${details.id} to ${pending} on ${name} for URL: ${details.url}`);
        }

        /**
         * The current progress for the page from 0 to 100.
         *
         * @type {number}
         */
        let progress = this.calculateProgress(started, finished);

        if(pending < 5) {
            log.debug("The following pending requests remain: ", this.pendingRequests);
        }

        if(pending < 0) {
            let msg = `Pending request count is negative: ${pending} (started=${started}, finished=${finished})`;
            log.warn(msg);
        }

        log.debug(`Pending requests: ${pending}, started=${started}, finished=${finished}, progress=${progress}: ${name}: ` + JSON.stringify(details, null, "  "));

        this.dispatchEventListeners( {
            name,
            details,
            pending,
            started,
            finished,
            progress
        });

        if(callback) {
            // the callback always has to be used or the requests will be
            // cancelled.
            callback({cancel: false});
        }

    }

    /**
     *
     * @return {number}
     */
    calculateProgress(started, finished) {
        return 100 * (finished / started);
    }

    /**
     * Go through all the started and finished requests and write a report about them.
     */
    captureRequestState() {

        let state = "";

        state += "==== started =====\n";
        state += JSON.stringify(this.startedRequests, null, "  ");

        state += "==== finished =====\n";
        state += JSON.stringify(this.finishedRequests, null, "  ");

        return state;

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
