"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithDeactivatedKeyboardShortcuts = void 0;
var ReactUtils_1 = require("../react/ReactUtils");
var KeyboardShortcutsStore_1 = require("./KeyboardShortcutsStore");
var ReactLifecycleHooks_1 = require("../hooks/ReactLifecycleHooks");
exports.WithDeactivatedKeyboardShortcuts = ReactUtils_1.deepMemo(function (props) {
    var setActive = KeyboardShortcutsStore_1.useKeyboardShortcutsCallbacks().setActive;
    ReactLifecycleHooks_1.useComponentDidMount(function () {
        setActive(false);
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(function () {
        setActive(true);
    });
    return props.children;
});
