const BaseWebRequestsListener = require("./BaseWebRequestsListener").BaseWebRequestsListener;

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
    }

    /**
     * Called when we receive an event.  All the events give us a 'details'
     * object.
     */
    eventListener(name, details, callback) {

        if(name === "onCompleted" || name === "onErrorOccurred") {
            // this request has already completed so is not considered against
            // pending any longer
            --this.pending;
        }

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

module.exports.PendingWebRequestsListener = PendingWebRequestsListener;
