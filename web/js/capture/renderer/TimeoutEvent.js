
/**
 *
 */
class TimeoutEvent {

    constructor(opts) {

        this.pending = 0;

        Object.assign(this, opts);

    }
}

module.exports.TimeoutEvent = TimeoutEvent;
