"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePricingMutator = exports.usePricingCallbacks = exports.usePricingStore = exports.PricingStoreProvider = void 0;
const ObservableStore_1 = require("../../../../web/js/react/store/ObservableStore");
const initialStore = {
    interval: 'month'
};
function mutatorFactory(storeProvider, setStore) {
    return {};
}
function callbacksFactory(storeProvider, setStore, mutator) {
    function setInterval(interval) {
        const store = storeProvider();
        setStore(Object.assign(Object.assign({}, store), { interval }));
    }
    function toggleInterval() {
        const store = storeProvider();
        const interval = store.interval === 'month' ? 'year' : 'month';
        setStore(Object.assign(Object.assign({}, store), { interval }));
    }
    return {
        setInterval, toggleInterval
    };
}
_a = ObservableStore_1.createObservableStore({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory
}), exports.PricingStoreProvider = _a[0], exports.usePricingStore = _a[1], exports.usePricingCallbacks = _a[2], exports.usePricingMutator = _a[3];
//# sourceMappingURL=PricingStore.js.map