const {TimeoutEvent} = require("./TimeoutEvent");

/**
 * Creates a way to handle callbacks on setTimeout and listen to the state of
 * which are pending.  We're planning on using this in the future to keep track
 * of page loads that are pending.
 */
class TimeoutManager {

    /**
     *
     * @param listener {Function}
     */
    constructor(listener) {

        this.listener = listener;

        /**
         * The total number of pending timeouts.
         * @type {number}
         */
        this.pending = 0;

        // the REAL setTimeout function.
        this.setTimeoutDelegate = null;
    }

    register() {
        this.setTimeoutDelegate = window.setTimeout;
        window.setTimeout = this.setTimeout;
    }

    unregister() {
        window.setTimeout = this.setTimeoutDelegate;
    }

    setTimeout(callback, timeout, ...args) {

        ++this.pending;
        this.fireListener(timeout);

        this.setTimeoutDelegate((...args) => {

            try {
                callback(...args);
            } finally {
                --this.pending;
                this.fireListener(timeout);
            }

        }, timeout, ...args);

    }

    fireListener(timeout) {

        let timeoutEvent = new TimeoutEvent({
            pending: this.pending,
            timeout
        });

        this.listener(timeoutEvent);

    }

}

module.exports.TimeoutManager = TimeoutManager;
