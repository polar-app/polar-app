"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotKeyCallbacks = void 0;
var HotKeyCallbacks;
(function (HotKeyCallbacks) {
    function withPreventDefault(delegate) {
        return (event) => {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            delegate();
        };
    }
    HotKeyCallbacks.withPreventDefault = withPreventDefault;
})(HotKeyCallbacks = exports.HotKeyCallbacks || (exports.HotKeyCallbacks = {}));
//# sourceMappingURL=HotKeyCallbacks.js.map