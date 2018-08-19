"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../logger/Logger");
const BaseWebRequestsListener_1 = require("./BaseWebRequestsListener");
const log = Logger_1.Logger.create();
class DebugWebRequestsListener extends BaseWebRequestsListener_1.BaseWebRequestsListener {
    constructor() {
        super();
        this.pending = 0;
    }
    onWebRequestEvent(event) {
        let { name, details, callback } = event;
        if (name === "onCompleted" || name === "onErrorOccurred") {
            --this.pending;
        }
        log.info(`${name} (pending=${this.pending}): `, JSON.stringify(details, null, "  "));
        if (name === "onBeforeRequest") {
            ++this.pending;
        }
        if (callback) {
            callback({ cancel: false });
        }
    }
}
exports.DebugWebRequestsListener = DebugWebRequestsListener;
//# sourceMappingURL=DebugWebRequestsListener.js.map