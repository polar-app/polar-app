"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyMapWithGroup = exports.GlobalKeyboardShortcuts = void 0;
const ReactUtils_1 = require("../react/ReactUtils");
const KeyboardShortcutsStore_1 = require("./KeyboardShortcutsStore");
const ReactLifecycleHooks_1 = require("../hooks/ReactLifecycleHooks");
exports.GlobalKeyboardShortcuts = ReactUtils_1.deepMemo((props) => {
    const { addKeyboardShortcut, removeKeyboardShortcut } = KeyboardShortcutsStore_1.useKeyboardShortcutsCallbacks();
    function toKeyboardShortcutWithHandler(key, shortcut) {
        const handler = props.handlerMap[key] || undefined;
        if (handler) {
            return Object.assign(Object.assign({}, shortcut), { handler });
        }
        else {
            return undefined;
        }
    }
    const keyboardShortcuts = Object.entries(props.keyMap)
        .map(entry => toKeyboardShortcutWithHandler(entry[0], entry[1]))
        .filter(current => current !== undefined)
        .map(current => current);
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        for (const keyboardShortcut of keyboardShortcuts) {
            addKeyboardShortcut(keyboardShortcut);
        }
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        for (const keyboardShortcut of keyboardShortcuts) {
            removeKeyboardShortcut(keyboardShortcut);
        }
    });
    return null;
});
function keyMapWithGroup(opts) {
    function toKeyboardShortcut(option) {
        return {
            sequences: option.sequences,
            name: option.name,
            description: option.description,
            priority: option.priority,
            group,
            groupPriority: groupPriority !== undefined ? groupPriority : 0
        };
    }
    const result = {};
    const { group, groupPriority, keyMap } = opts;
    for (const key of Object.keys(keyMap)) {
        result[key] = toKeyboardShortcut(keyMap[key]);
    }
    return result;
}
exports.keyMapWithGroup = keyMapWithGroup;
//# sourceMappingURL=GlobalKeyboardShortcuts.js.map