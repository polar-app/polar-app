"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTagStoreCallbacks = exports.useTagStore = exports.TagStoreProvider = void 0;
const ObservableStore_1 = require("../ObservableStore");
const Tags_1 = require("polar-shared/src/tags/Tags");
function mutatorFactory() {
    return {};
}
const callbacksFactory = (storeProvider, setStore, mutator) => {
    return class {
        static tagsProvider() {
            const store = storeProvider();
            return store.tags;
        }
    };
};
const tagStore = {
    tags: [Tags_1.Tags.create('hello')]
};
_a = ObservableStore_1.createObservableStore({
    initialValue: tagStore,
    mutatorFactory,
    callbacksFactory
}), exports.TagStoreProvider = _a[0], exports.useTagStore = _a[1], exports.useTagStoreCallbacks = _a[2];
//# sourceMappingURL=TagStoreDemo.js.map