
/**
 *
 */
class TimeoutEvent {

    constructor(opts) {

        /**
         * The total pending number of timeouts.
         *
         * @type {number}
         */
        this.pending = undefined;

        /**
         * The timeout for this registered callback.
         *
         * @type {number}
         */
        this.timeout = undefined;

        Object.assign(this, opts);

    }

}

module.exports.TimeoutEvent = TimeoutEvent;
