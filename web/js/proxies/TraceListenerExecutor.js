"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MutationType_1 = require("./MutationType");
const TraceEvent_1 = require("./TraceEvent");
const FunctionalInterface_1 = require("../util/FunctionalInterface");
class TraceListenerExecutor {
    constructor(traceListeners, traceHandler) {
        this.traceListeners = traceListeners;
        this.traceHandler = traceHandler;
    }
    sync() {
        const path = this.traceHandler.path;
        const target = this.traceHandler.target;
        this.traceListeners.forEach(traceListener => {
            traceListener = FunctionalInterface_1.FunctionalInterface.create("onMutation", traceListener);
            for (const key in target) {
                if (target.hasOwnProperty(key)) {
                    const val = target[key];
                    const traceEvent = new TraceEvent_1.TraceEvent({
                        path,
                        mutationType: MutationType_1.MutationType.INITIAL,
                        target,
                        property: key,
                        value: val
                    });
                    traceListener.onMutation(traceEvent);
                }
            }
        });
    }
}
exports.TraceListenerExecutor = TraceListenerExecutor;
;
//# sourceMappingURL=TraceListenerExecutor.js.map