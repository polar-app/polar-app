"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEPUBDocumentMutator = exports.useEPUBDocumentCallbacks = exports.useEPUBDocumentStore = exports.EPUBDocumentStoreProvider = void 0;
const ObservableStore_1 = require("../../../../../web/js/react/store/ObservableStore");
const initialStore = {
    renderIter: 0
};
function mutatorFactory(storeProvider, setStore) {
    return {};
}
function callbacksFactory(storeProvider, setStore, mutator) {
    function incrRenderIter() {
        const store = storeProvider();
        setStore(Object.assign(Object.assign({}, store), { renderIter: store.renderIter + 1 }));
    }
    function setSection(section) {
        const store = storeProvider();
        setStore(Object.assign(Object.assign({}, store), { section }));
    }
    return { incrRenderIter, setSection };
}
const observableStore = ObservableStore_1.createObservableStore({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory
});
exports.EPUBDocumentStoreProvider = observableStore[0], exports.useEPUBDocumentStore = observableStore[1], exports.useEPUBDocumentCallbacks = observableStore[2], exports.useEPUBDocumentMutator = observableStore[3];
//# sourceMappingURL=EPUBDocumentStore.js.map