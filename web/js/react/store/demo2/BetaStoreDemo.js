"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBetaStoreCallbacks = exports.useBetaStore = exports.BetaStoreProvider = void 0;
const ObservableStore_1 = require("../ObservableStore");
const AlphaStoreDemo_1 = require("./AlphaStoreDemo");
function mutatorFactory() {
    return {};
}
const useCallbacksFactory = (storeProvider, setStore, mutator) => {
    const alphaStore = AlphaStoreDemo_1.useAlphaStore(undefined);
    function setName(name) {
        const store = storeProvider();
        setStore(Object.assign(Object.assign({}, store), { name }));
    }
    function names() {
        const store = storeProvider();
        return {
            alpha: alphaStore.name,
            beta: store.name
        };
    }
    return {
        setName, names
    };
};
const store = {
    name: "beta-default"
};
_a = ObservableStore_1.createObservableStore({
    initialValue: store,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory
}), exports.BetaStoreProvider = _a[0], exports.useBetaStore = _a[1], exports.useBetaStoreCallbacks = _a[2];
//# sourceMappingURL=BetaStoreDemo.js.map