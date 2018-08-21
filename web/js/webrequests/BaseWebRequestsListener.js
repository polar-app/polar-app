"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../logger/Logger");
const log = Logger_1.Logger.create();
class BaseWebRequestsListener {
    constructor() {
    }
    onWebRequestEvent(event) {
    }
    register(webRequestReactor) {
        webRequestReactor.register(this.onWebRequestEvent.bind(this));
    }
}
exports.BaseWebRequestsListener = BaseWebRequestsListener;
//# sourceMappingURL=BaseWebRequestsListener.js.map