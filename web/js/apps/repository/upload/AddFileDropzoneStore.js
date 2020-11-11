"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAddFileDropzoneMutator = exports.useAddFileDropzoneCallbacks = exports.useAddFileDropzoneStore = exports.AddFileDropzoneProvider = void 0;
const ObservableStore_1 = require("../../../react/store/ObservableStore");
const initialStore = {
    active: false,
};
function mutatorFactory(storeProvider, setStore) {
    return {};
}
function callbacksFactory(storeProvider, setStore, mutator) {
    function setActive(active) {
        const store = storeProvider();
        if (store.active !== active) {
            setStore({ active });
        }
    }
    return { setActive };
}
const observableStore = ObservableStore_1.createObservableStore({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory
});
exports.AddFileDropzoneProvider = observableStore[0], exports.useAddFileDropzoneStore = observableStore[1], exports.useAddFileDropzoneCallbacks = observableStore[2], exports.useAddFileDropzoneMutator = observableStore[3];
//# sourceMappingURL=AddFileDropzoneStore.js.map