"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCachedSnapshotProvider = exports.createCacheSnapshotStore = void 0;
const React = __importStar(require("react"));
const ObservableStore_1 = require("../../../../web/js/react/store/ObservableStore");
const initialStore = {
    snapshot: undefined
};
function mutatorFactory(storeProvider, setStore) {
    return {};
}
function useCallbacksFactory(storeProvider, setStore, mutator) {
    return React.useMemo(() => {
        function set(snapshot) {
            setStore({ snapshot });
        }
        return {
            set
        };
    }, [setStore]);
}
function createCacheSnapshotStore() {
    return ObservableStore_1.createObservableStore({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory
    });
}
exports.createCacheSnapshotStore = createCacheSnapshotStore;
function createCachedSnapshotProvider() {
    const [CachedSnapshotStoreProvider, useCachedSnapshotStore, useCachedSnapshotCallbacks] = createCacheSnapshotStore();
    return (props) => {
        return (React.createElement(CachedSnapshotStoreProvider, null, props.children));
    };
}
exports.createCachedSnapshotProvider = createCachedSnapshotProvider;
//# sourceMappingURL=CachedSnapshotStore.js.map