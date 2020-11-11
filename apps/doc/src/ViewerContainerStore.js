"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useViewerContainerMutator = exports.useViewerContainerCallbacks = exports.useViewerContainerStore = exports.ViewerContainerProvider = void 0;
const ObservableStore_1 = require("../../../web/js/react/store/ObservableStore");
const initialStore = {
    viewerContainer: undefined,
};
function mutatorFactory(storeProvider, setStore) {
    return {};
}
function callbacksFactory(storeProvider, setStore, mutator) {
    function setViewerContainer(viewerContainer) {
        const store = storeProvider();
        if (viewerContainer && store.viewerContainer !== viewerContainer) {
            setStore(Object.assign(Object.assign({}, store), { viewerContainer }));
        }
    }
    return { setViewerContainer };
}
const observableStore = ObservableStore_1.createObservableStore({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory
});
exports.ViewerContainerProvider = observableStore[0], exports.useViewerContainerStore = observableStore[1], exports.useViewerContainerCallbacks = observableStore[2], exports.useViewerContainerMutator = observableStore[3];
//# sourceMappingURL=ViewerContainerStore.js.map