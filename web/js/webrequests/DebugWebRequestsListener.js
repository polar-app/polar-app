
const {BaseWebRequestsListener} = require("./BaseWebRequestsListener");
const {Logger} = require("../logger/Logger");

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
class DebugWebRequestsListener extends BaseWebRequestsListener {

    /**
     */
    constructor() {

        super();

        /**
         * The number of pending requests
         *
         * @type {number}
         */
        this.pending = 0;

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
        }

        log.info(`${name} (pending=${this.pending}): `, JSON.stringify(details, null, "  "));

        if(name === "onBeforeRequest") {
            // after this request the pending will be incremented.
            ++this.pending;
        }

        if(callback) {
            // the callback always has to be used or the requests will be
            // cancelled.
            callback({cancel: false});
        }

    }

}

module.exports.DebugWebRequestsListener = DebugWebRequestsListener;
