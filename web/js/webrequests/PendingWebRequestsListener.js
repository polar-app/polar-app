"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { BaseWebRequestsListener } = require("./BaseWebRequestsListener");
const { Logger } = require("../logger/Logger");
const { RequestState } = require("./RequestState");
const log = Logger.create();
class PendingWebRequestsListener extends BaseWebRequestsListener {
    constructor() {
        super();
        this.pendingRequests = {};
        this.eventListeners = [];
        this.requestState = new RequestState();
        this.startedRequests = {};
        this.finishedRequests = {};
    }
    onWebRequestEvent(event) {
        let { details, callback } = event;
        let pendingChange = null;
        if (name === "onBeforeRequest") {
            this.pendingRequests[details.id] = details;
            this.startedRequests[details.id] = {
                event: name,
                id: details.id,
                url: details.url
            };
            pendingChange = "INCREMENTED";
            this.requestState.markStarted(details.id, details.url);
        }
        if (name === "onCompleted" || name === "onErrorOccurred" || name === "onBeforeRedirect" || name === "onAuthRequired") {
            delete this.pendingRequests[details.id];
            this.finishedRequests[details.id] = {
                event: name,
                id: details.id,
                url: details.url
            };
            pendingChange = "DECREMENTED";
            this.requestState.markFinished(details.id, details.url);
        }
        let started = Object.keys(this.startedRequests).length;
        let finished = Object.keys(this.finishedRequests).length;
        let pending = started - finished;
        if (pendingChange) {
            log.info(`Pending state ${pendingChange} for request id=${details.id} to ${pending} on ${name} for URL: ${details.url}`);
        }
        let progress = this.calculateProgress(started, finished);
        if (pending < 5) {
            log.debug("The following pending requests remain: ", this.pendingRequests);
        }
        if (pending < 0) {
            let msg = `Pending request count is negative: ${pending} (started=${started}, finished=${finished})`;
            log.warn(msg);
        }
        log.debug(`Pending requests: ${pending}, started=${started}, finished=${finished}, progress=${progress}: ${name}: ` + JSON.stringify(details, null, "  "));
        this.dispatchEventListeners({
            name,
            details,
            pending,
            started,
            finished,
            progress
        });
        if (callback) {
            callback({ cancel: false });
        }
    }
    calculateProgress(started, finished) {
        return 100 * (finished / started);
    }
    captureRequestState() {
        let state = "";
        state += "==== started =====\n";
        state += JSON.stringify(this.startedRequests, null, "  ");
        state += "==== finished =====\n";
        state += JSON.stringify(this.finishedRequests, null, "  ");
        return state;
    }
    addEventListener(eventListener) {
        this.eventListeners.push(eventListener);
    }
    dispatchEventListeners(event) {
        this.eventListeners.forEach(eventListener => {
            eventListener(event);
        });
    }
}
exports.PendingWebRequestsListener = PendingWebRequestsListener;
//# sourceMappingURL=PendingWebRequestsListener.js.map