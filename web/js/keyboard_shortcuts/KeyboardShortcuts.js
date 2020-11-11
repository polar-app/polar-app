"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardShortcuts = void 0;
const react_1 = __importDefault(require("react"));
const ReactUtils_1 = require("../react/ReactUtils");
const KeyboardShortcutsStore_1 = require("./KeyboardShortcutsStore");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const ReactLifecycleHooks_1 = require("../hooks/ReactLifecycleHooks");
const ReactHooks_1 = require("../hooks/ReactHooks");
function createPredicate3(keys) {
    return (event) => {
        function matchesModifier(key) {
            if (key === 'ctrl' && event.ctrlKey) {
                return true;
            }
            if (key === 'command' && event.metaKey) {
                return true;
            }
            if (key === 'shift' && event.shiftKey) {
                return true;
            }
            return false;
        }
        function matchesKey0() {
            return matchesModifier(keys[0]);
        }
        function matchesKey1() {
            return matchesModifier(keys[1]);
        }
        function matchesKey2() {
            const key = keys[2];
            if (key === event.key) {
                return true;
            }
            return false;
        }
        if (matchesKey0() && matchesKey1() && matchesKey2()) {
            return true;
        }
        return false;
    };
}
function createPredicate2(keys) {
    return (event) => {
        function matchesKey0() {
            const key = keys[0];
            if (key === 'ctrl' && event.ctrlKey) {
                return true;
            }
            if (key === 'command' && event.metaKey) {
                return true;
            }
            if (key === 'shift' && event.shiftKey) {
                return true;
            }
            return false;
        }
        function matchesKey1() {
            const key = keys[1];
            if (key === event.key) {
                return true;
            }
            return false;
        }
        if (matchesKey0() && matchesKey1()) {
            return true;
        }
        return false;
    };
}
function createPredicate1(keys) {
    return (event) => {
        return event.key === keys[0] && !(event.metaKey || event.ctrlKey || event.shiftKey);
    };
}
function createHandler(sequence, handler) {
    function createPredicate() {
        switch (sequence) {
            case "command++":
                return createPredicate2(['command', '+']);
            case "ctrl++":
                return createPredicate2(['ctrl', '+']);
        }
        const keys = sequence.split('+');
        switch (keys.length) {
            case 1:
                return createPredicate1(keys);
            case 2:
                return createPredicate2(keys);
            case 3:
                return createPredicate3(keys);
            default:
                throw new Error("Too many keys for event: " + keys.length);
        }
    }
    const predicate = createPredicate();
    return (event) => {
        if (predicate(event)) {
            event.stopPropagation();
            event.preventDefault();
            setTimeout(() => handler(event), 1);
            return true;
        }
        return false;
    };
}
function isIgnorableKeyboardEvent(event) {
    if (event.target instanceof HTMLElement) {
        if (['input', 'select', 'textarea'].includes(event.target.tagName.toLowerCase())) {
            return true;
        }
        if (event.target.getAttribute('isContentEditable') === 'true') {
            return true;
        }
        if (event.target.getAttribute('contenteditable') === 'true') {
            return true;
        }
    }
    return false;
}
exports.KeyboardShortcuts = ReactUtils_1.deepMemo(() => {
    const { shortcuts, active } = KeyboardShortcutsStore_1.useKeyboardShortcutsStore(['shortcuts', 'active']);
    const shortcutsRef = ReactHooks_1.useRefWithUpdates(shortcuts);
    const activeRef = ReactHooks_1.useRefWithUpdates(active);
    function computeKeyToHandlers() {
        function toKeyToHandler(keyboardShortcut) {
            function toKeyboardEventHandlerPredicate(seq) {
                return createHandler(seq, keyboardShortcut.handler);
            }
            return keyboardShortcut.sequences.map(seq => ([seq, toKeyboardEventHandlerPredicate(seq)]));
        }
        return ArrayStreams_1.arrayStream(Object.values(shortcutsRef.current))
            .flatMap(toKeyToHandler)
            .collect();
    }
    const keyToHandlers = ReactHooks_1.useRefProvider(() => computeKeyToHandlers());
    const handleKeyDown = react_1.default.useCallback((event) => {
        if (isIgnorableKeyboardEvent(event)) {
            return;
        }
        if (!activeRef.current) {
            return;
        }
        for (const keyToHandler of keyToHandlers.current) {
            const handler = keyToHandler[1];
            if (handler(event)) {
                break;
            }
        }
    }, [activeRef, keyToHandlers]);
    const register = react_1.default.useCallback(() => {
        window.addEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    const unregister = react_1.default.useCallback(() => {
        window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    unregister();
    register();
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        unregister();
    });
    return null;
});
//# sourceMappingURL=KeyboardShortcuts.js.map