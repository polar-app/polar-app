"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationRepoGlobalHotKeys = void 0;
const react_1 = __importDefault(require("react"));
const AnnotationRepoStore_1 = require("./AnnotationRepoStore");
const GlobalKeyboardShortcuts_1 = require("../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts");
const KeyboardShortcutHandlers_1 = require("../../../../web/js/keyboard_shortcuts/KeyboardShortcutHandlers");
const globalKeyMap = GlobalKeyboardShortcuts_1.keyMapWithGroup({
    group: "Annotations",
    keyMap: {
        TAG: {
            name: "Tag",
            description: "Tag the current annotation.",
            sequences: ['t'],
        },
        DELETE: {
            name: "Delete",
            description: "Delete the current annotation.",
            sequences: ['Delete', 'Backspace'],
        }
    }
});
exports.AnnotationRepoGlobalHotKeys = react_1.default.memo(() => {
    const callbacks = AnnotationRepoStore_1.useAnnotationRepoCallbacks();
    const globalKeyHandlers = {
        TAG: KeyboardShortcutHandlers_1.KeyboardShortcutHandlers.withPreventDefault(callbacks.onTagged),
        DELETE: KeyboardShortcutHandlers_1.KeyboardShortcutHandlers.withPreventDefault(callbacks.onDeleted),
    };
    return (react_1.default.createElement(GlobalKeyboardShortcuts_1.GlobalKeyboardShortcuts, { keyMap: globalKeyMap, handlerMap: globalKeyHandlers }));
});
//# sourceMappingURL=AnnotationRepoGlobalHotKeys.js.map