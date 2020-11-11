"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEPUBFinderMutator = exports.useEPUBFinderCallbacks = exports.useEPUBFinderStore = exports.EPUBFinderProvider = void 0;
const ObservableStore_1 = require("../../../../../web/js/react/store/ObservableStore");
const DocViewerStore_1 = require("../../DocViewerStore");
const initialStore = {
    hits: undefined,
    current: undefined
};
function mutatorFactory(storeProvider, setStore) {
    return {};
}
function useCallbacksFactory(storeProvider, setStore, mutator) {
    const { page } = DocViewerStore_1.useDocViewerStore(['page']);
    function setHits(hits) {
        const store = storeProvider();
        setStore(Object.assign(Object.assign({}, store), { hits, current: -1 }));
    }
    function setCurrent(current) {
        const store = storeProvider();
        setStore(Object.assign(Object.assign({}, store), { current }));
    }
    function reset() {
        const store = storeProvider();
        setStore(Object.assign(Object.assign({}, store), { hits: undefined, current: undefined }));
    }
    function changeCurrent(delta) {
        const store = storeProvider();
        if (store.hits === undefined || store.current === undefined) {
            return undefined;
        }
        const newCurrent = store.current + delta;
        const min = 0;
        const max = (store.hits.length - 1);
        if (newCurrent >= min && newCurrent <= max) {
            setStore(Object.assign(Object.assign({}, store), { current: newCurrent }));
            const hit = store.hits[newCurrent];
            return Object.assign({ idx: newCurrent, pageNum: page }, hit);
        }
        return undefined;
    }
    function next() {
        return changeCurrent(1);
    }
    function prev() {
        return changeCurrent(-1);
    }
    return { setHits, setCurrent, reset, next, prev };
}
const observableStore = ObservableStore_1.createObservableStore({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory
});
exports.EPUBFinderProvider = observableStore[0], exports.useEPUBFinderStore = observableStore[1], exports.useEPUBFinderCallbacks = observableStore[2], exports.useEPUBFinderMutator = observableStore[3];
//# sourceMappingURL=EPUBFinderStore.js.map