"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveKeyboardShortcuts = exports.ActiveKeyboardShortcutsTable = void 0;
const react_1 = __importDefault(require("react"));
const DialogTitle_1 = __importDefault(require("@material-ui/core/DialogTitle"));
const DialogContent_1 = __importDefault(require("@material-ui/core/DialogContent"));
const DialogActions_1 = __importDefault(require("@material-ui/core/DialogActions"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const Table_1 = __importDefault(require("@material-ui/core/Table"));
const TableBody_1 = __importDefault(require("@material-ui/core/TableBody"));
const TableRow_1 = __importDefault(require("@material-ui/core/TableRow"));
const TableCell_1 = __importDefault(require("@material-ui/core/TableCell"));
const Dialog_1 = __importDefault(require("@material-ui/core/Dialog"));
const ReactUtils_1 = require("../react/ReactUtils");
const KeyboardShortcutsStore_1 = require("../keyboard_shortcuts/KeyboardShortcutsStore");
const GlobalKeyboardShortcuts_1 = require("../keyboard_shortcuts/GlobalKeyboardShortcuts");
const ReactLifecycleHooks_1 = require("../hooks/ReactLifecycleHooks");
const KeySequence_1 = require("./KeySequence");
const ActiveKeyboardShortcutsStore_1 = require("./ActiveKeyboardShortcutsStore");
const GroupRow = (props) => {
    return (react_1.default.createElement(TableRow_1.default, null,
        react_1.default.createElement(TableCell_1.default, { style: { fontSize: '1.2em' } },
            react_1.default.createElement("b", null, props.group))));
};
const ActiveBinding = (props) => {
    return (react_1.default.createElement(TableRow_1.default, null,
        react_1.default.createElement(TableCell_1.default, { style: { fontSize: '1.2em' } },
            react_1.default.createElement("b", null, props.name || 'unnamed')),
        react_1.default.createElement(TableCell_1.default, { style: { fontSize: '1.2em' } }, props.description),
        react_1.default.createElement(TableCell_1.default, null,
            react_1.default.createElement("div", { style: { display: 'flex' } }, props.sequences.map((current, idx) => react_1.default.createElement(KeySequence_1.KeySequence, { key: idx, sequence: current }))))));
};
const GroupBindings = (props) => {
    return (react_1.default.createElement(react_1.default.Fragment, null));
};
exports.ActiveKeyboardShortcutsTable = () => {
    const { shortcuts } = KeyboardShortcutsStore_1.useKeyboardShortcutsStore(['shortcuts']);
    const { setActive } = KeyboardShortcutsStore_1.useKeyboardShortcutsCallbacks();
    function toPartition(shortcut) {
        const id = shortcut.group || '';
        const group = {
            group: shortcut.group || '',
            groupPriority: shortcut.groupPriority !== undefined ? shortcut.groupPriority : 0
        };
        return [id, group];
    }
    const bindings = Object.values(shortcuts)
        .sort((a, b) => (b.priority || 0) - (a.priority || 0));
    ReactLifecycleHooks_1.useComponentDidMount(() => setActive(false));
    ReactLifecycleHooks_1.useComponentWillUnmount(() => setActive(true));
    return (react_1.default.createElement(Table_1.default, { size: "small" },
        react_1.default.createElement(TableBody_1.default, null, bindings.map((binding, idx) => react_1.default.createElement(ActiveBinding, Object.assign({ key: idx }, binding))))));
};
const keyMap = {
    SHOW_ALL_HOTKEYS: {
        name: 'Show Keyboard Shortcuts',
        description: "Show the currently active keyboard shortcuts",
        sequences: ["shift+?", '/'],
        priority: -1
    }
};
exports.ActiveKeyboardShortcuts = ReactUtils_1.deepMemo(() => {
    const { showActiveShortcuts } = ActiveKeyboardShortcutsStore_1.useActiveKeyboardShortcutsStore(['showActiveShortcuts']);
    const { setShowActiveShortcuts } = ActiveKeyboardShortcutsStore_1.useActiveKeyboardShortcutsCallbacks();
    function handleClose() {
        setShowActiveShortcuts(false);
    }
    const handlers = {
        SHOW_ALL_HOTKEYS: () => setShowActiveShortcuts(true)
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(GlobalKeyboardShortcuts_1.GlobalKeyboardShortcuts, { keyMap: keyMap, handlerMap: handlers }),
        react_1.default.createElement(Dialog_1.default, { fullWidth: true, maxWidth: "lg", open: showActiveShortcuts, onClose: handleClose },
            react_1.default.createElement(DialogTitle_1.default, null, "Active Keyboard Shortcuts"),
            react_1.default.createElement(DialogContent_1.default, null,
                react_1.default.createElement(exports.ActiveKeyboardShortcutsTable, null)),
            react_1.default.createElement(DialogActions_1.default, null,
                react_1.default.createElement(Button_1.default, { onClick: handleClose, size: "large", color: "primary", variant: "contained" }, "Close")))));
});
//# sourceMappingURL=ActiveKeyboardShortcuts.js.map