"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardShortcutHandlers = void 0;
var KeyboardShortcutHandlers;
(function (KeyboardShortcutHandlers) {
    function withPreventDefault(delegate) {
        return (event) => {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            delegate();
        };
    }
    KeyboardShortcutHandlers.withPreventDefault = withPreventDefault;
})(KeyboardShortcutHandlers = exports.KeyboardShortcutHandlers || (exports.KeyboardShortcutHandlers = {}));
//# sourceMappingURL=KeyboardShortcutHandlers.js.map