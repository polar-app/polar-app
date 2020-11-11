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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZenModeMutator = exports.useZenModeCallbacks = exports.useZenModeStore = exports.ZenModeStoreProviderDelegate = void 0;
const React = __importStar(require("react"));
const ObservableStore_1 = require("../react/store/ObservableStore");
const initialStore = {
    zenMode: false
};
function mutatorFactory(storeProvider, setStore) {
    return {};
}
function useCallbacksFactory(storeProvider, setStore, mutator) {
    return React.useMemo(() => {
        function toggleZenMode() {
            const store = storeProvider();
            setZenMode(!store.zenMode);
        }
        function setZenMode(zenMode) {
            const store = storeProvider();
            setStore(Object.assign(Object.assign({}, store), { zenMode }));
        }
        return {
            toggleZenMode,
            setZenMode,
        };
    }, [storeProvider, setStore]);
}
_a = ObservableStore_1.createObservableStore({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory
}), exports.ZenModeStoreProviderDelegate = _a[0], exports.useZenModeStore = _a[1], exports.useZenModeCallbacks = _a[2], exports.useZenModeMutator = _a[3];
//# sourceMappingURL=ZenModeStore.js.map