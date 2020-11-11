"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyHandlers = void 0;
var KeyHandlers;
(function (KeyHandlers) {
    function withDefaultBehavior(callbacks) {
        const result = Object.assign({}, callbacks);
        for (const key of Object.keys(result)) {
            result[key] = executedWithDefaultBehavior(result[key]);
        }
        return result;
    }
    KeyHandlers.withDefaultBehavior = withDefaultBehavior;
    function executedWithDefaultBehavior(delegate) {
        return (event) => {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            setTimeout(() => delegate(event), 1);
        };
    }
    KeyHandlers.executedWithDefaultBehavior = executedWithDefaultBehavior;
})(KeyHandlers = exports.KeyHandlers || (exports.KeyHandlers = {}));
//# sourceMappingURL=KeyHandlers.js.map