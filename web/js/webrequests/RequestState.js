const log = require("../logger/Logger").create();

const STATE_STARTED = "STARTED";
const STATE_FINISHED = "FINISHED";

/**
 * Keep an index of the requests that are executing so that we can detect
 * problems with pending URLs.
 */
class RequestState {

    constructor() {
        this.map = {};
        log.info("Tracking request state...");
    }

    // check for double started and double finished too..

    markStarted(id, url) {

        let requestEntry = new RequestEntry({id, url, state: STATE_STARTED});

        if(id in this.map) {
            log.warn("Request was started but already present in map." + this.map[id]);
            return;
        }

        this.map[id] = requestEntry;

    }

    markFinished(id, url) {

        let requestEntry = new RequestEntry({id, url, state: STATE_FINISHED});

        if(! (id in this.map)) {
            log.warn("Request was marked finished but never marked started.");
            return;
        }

        if(this.map[id].state !== STATE_STARTED) {
            log.warn("Request was marked finished but is not currently started: " + this.map[id]);
            return;
        }

        this.map[id] = requestEntry;

    }

}

/**
 * Represents a request stored in the backing map.
 */
class RequestEntry {

    constructor(opts) {

        /**
         *
         * @type {number}
         */
        this.id = undefined;

        /**
         *
         * @type {string}
         */
        this.url = undefined;

        /**
         *
         * @type {string}
         */
        this.state = undefined;

        Object.assign(this, opts);
    }

    toString() {
        return `(id=${this.id}, url='${this.url}')`;
    }

}

module.exports.RequestState = RequestState;
