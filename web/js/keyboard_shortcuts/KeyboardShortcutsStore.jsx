"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKeyboardShortcutsMutator = exports.useKeyboardShortcutsCallbacks = exports.useKeyboardShortcutsStore = exports.KeyboardShortcutsStoreProvider = void 0;
var ObservableStore_1 = require("../react/store/ObservableStore");
var Arrays_1 = require("polar-shared/src/util/Arrays");
var initialStore = {
    shortcuts: {},
    active: true
};
function mutatorFactory(storeProvider, setStore) {
    return {};
}
function callbacksFactory(storeProvider, setStore, mutator) {
    function addKeyboardShortcut(shortcut) {
        var store = storeProvider();
        var shortcuts = __assign({}, store.shortcuts);
        var sequence = Arrays_1.Arrays.first(shortcut.sequences);
        shortcuts[sequence] = shortcut;
        setStore(__assign(__assign({}, store), { shortcuts: shortcuts }));
    }
    function removeKeyboardShortcut(shortcut) {
        var store = storeProvider();
        var shortcuts = __assign({}, store.shortcuts);
        var sequence = Arrays_1.Arrays.first(shortcut.sequences);
        delete shortcuts[sequence];
        setStore(__assign(__assign({}, store), { shortcuts: shortcuts }));
    }
    function setActive(active) {
        var store = storeProvider();
        setStore(__assign(__assign({}, store), { active: active }));
    }
    return { addKeyboardShortcut: addKeyboardShortcut, removeKeyboardShortcut: removeKeyboardShortcut, setActive: setActive };
}
exports.KeyboardShortcutsStoreProvider = (_a = ObservableStore_1.createObservableStore({
    initialValue: initialStore,
    mutatorFactory: mutatorFactory,
    callbacksFactory: callbacksFactory
}), _a[0]), exports.useKeyboardShortcutsStore = _a[1], exports.useKeyboardShortcutsCallbacks = _a[2], exports.useKeyboardShortcutsMutator = _a[3];
