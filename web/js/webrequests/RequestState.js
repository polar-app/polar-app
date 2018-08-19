"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log = require("../logger/Logger").create();
const STATE_STARTED = "STARTED";
const STATE_FINISHED = "FINISHED";
class RequestState {
    constructor() {
        this.map = {};
        log.info("Tracking request state...");
    }
    markStarted(id, url) {
        let requestEntry = { id, url, state: STATE_STARTED };
        if (id in this.map) {
            log.warn("Request was started but already present in map." + this.map[id]);
            return;
        }
        this.map[id] = requestEntry;
    }
    markFinished(id, url) {
        let requestEntry = { id, url, state: STATE_FINISHED };
        if (!(id in this.map)) {
            log.warn("Request was marked finished but never marked started.");
            return;
        }
        if (this.map[id].state !== STATE_STARTED) {
            log.warn("Request was marked finished but is not currently started: " + this.map[id]);
            return;
        }
        this.map[id] = requestEntry;
    }
}
exports.RequestState = RequestState;
//# sourceMappingURL=RequestState.js.map