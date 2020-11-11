"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAlphaStoreCallbacks = exports.useAlphaStore = exports.AlphaStoreProvider = void 0;
const ObservableStore_1 = require("../ObservableStore");
const BetaStoreDemo_1 = require("./BetaStoreDemo");
function mutatorFactory() {
    return {};
}
const useCallbacksFactory = (storeProvider, setStore, mutator) => {
    const betaStore = BetaStoreDemo_1.useBetaStore(undefined);
    function setName(name) {
        const store = storeProvider();
        setStore(Object.assign(Object.assign({}, store), { name }));
    }
    function names() {
        const store = storeProvider();
        return {
            alpha: store.name,
            beta: betaStore.name
        };
    }
    return {
        setName, names
    };
};
const store = {
    name: "alpha-default"
};
_a = ObservableStore_1.createObservableStore({
    initialValue: store,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory
}), exports.AlphaStoreProvider = _a[0], exports.useAlphaStore = _a[1], exports.useAlphaStoreCallbacks = _a[2];
//# sourceMappingURL=AlphaStoreDemo.js.map