"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKeyboardShortcutsMutator = exports.useKeyboardShortcutsCallbacks = exports.useKeyboardShortcutsStore = exports.KeyboardShortcutsStoreProvider = void 0;
const ObservableStore_1 = require("../react/store/ObservableStore");
const Arrays_1 = require("polar-shared/src/util/Arrays");
const initialStore = {
    shortcuts: {},
    active: true
};
function mutatorFactory(storeProvider, setStore) {
    return {};
}
function callbacksFactory(storeProvider, setStore, mutator) {
    function addKeyboardShortcut(shortcut) {
        const store = storeProvider();
        const shortcuts = Object.assign({}, store.shortcuts);
        const sequence = Arrays_1.Arrays.first(shortcut.sequences);
        shortcuts[sequence] = shortcut;
        setStore(Object.assign(Object.assign({}, store), { shortcuts }));
    }
    function removeKeyboardShortcut(shortcut) {
        const store = storeProvider();
        const shortcuts = Object.assign({}, store.shortcuts);
        const sequence = Arrays_1.Arrays.first(shortcut.sequences);
        delete shortcuts[sequence];
        setStore(Object.assign(Object.assign({}, store), { shortcuts }));
    }
    function setActive(active) {
        const store = storeProvider();
        setStore(Object.assign(Object.assign({}, store), { active }));
    }
    return { addKeyboardShortcut, removeKeyboardShortcut, setActive };
}
_a = ObservableStore_1.createObservableStore({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory
}), exports.KeyboardShortcutsStoreProvider = _a[0], exports.useKeyboardShortcutsStore = _a[1], exports.useKeyboardShortcutsCallbacks = _a[2], exports.useKeyboardShortcutsMutator = _a[3];
//# sourceMappingURL=KeyboardShortcutsStore.js.map