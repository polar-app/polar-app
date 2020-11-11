"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithDeactivatedKeyboardShortcuts = void 0;
const ReactUtils_1 = require("../react/ReactUtils");
const KeyboardShortcutsStore_1 = require("./KeyboardShortcutsStore");
const ReactLifecycleHooks_1 = require("../hooks/ReactLifecycleHooks");
exports.WithDeactivatedKeyboardShortcuts = ReactUtils_1.deepMemo((props) => {
    const { setActive } = KeyboardShortcutsStore_1.useKeyboardShortcutsCallbacks();
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        setActive(false);
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        setActive(true);
    });
    return props.children;
});
//# sourceMappingURL=WithDeactivatedKeyboardShortcuts.js.map