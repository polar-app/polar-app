const {TimeoutEvent} = require("./TimeoutEvent");

/**
 *
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
        this.fireListener();

        this.setTimeoutDelegate((...args) => {

            callback(...args);

            --this.pending;
            this.fireListener();

        }, timeout, ...args);

    }

    fireListener() {

        let timeoutEvent = new TimeoutEvent({
            pending: this.pending
        });

        this.listener(timeoutEvent);

    }

}

module.exports.TimeoutManager = TimeoutManager;
