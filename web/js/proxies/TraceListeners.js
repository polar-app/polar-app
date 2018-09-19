"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TraceListeners {
    static asArray(input) {
        if (!input) {
            return [];
        }
        if (!Array.isArray(input)) {
            return [input];
        }
        return input;
    }
}
exports.TraceListeners = TraceListeners;
//# sourceMappingURL=TraceListeners.js.map