"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUseLocationChangeMutator = exports.useUseLocationChangeCallbacks = exports.useLocationChangeStore = exports.UseLocationChangeStoreProvider = void 0;
const ObservableStore_1 = require("../../../../web/js/react/store/ObservableStore");
const initialStore = {
    initialScrollLoader: () => console.warn("Using null initialScrollLoader")
};
function mutatorFactory(storeProvider, setStore) {
    return {};
}
function callbacksFactory(storeProvider, setStore, mutator) {
    function setInitialScrollLoader(initialScrollLoader) {
        const store = storeProvider();
        setStore(Object.assign(Object.assign({}, store), { initialScrollLoader }));
    }
    return {
        setInitialScrollLoader
    };
}
_a = ObservableStore_1.createObservableStore({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory
}), exports.UseLocationChangeStoreProvider = _a[0], exports.useLocationChangeStore = _a[1], exports.useUseLocationChangeCallbacks = _a[2], exports.useUseLocationChangeMutator = _a[3];
//# sourceMappingURL=UseLocationChangeStore.js.map