"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDockLayoutCallbacks = exports.useDockLayoutStore = exports.DockLayoutStoreProvider = exports.useDockLayoutResized = void 0;
const react_1 = __importDefault(require("react"));
const ObservableStore_1 = require("../../react/store/ObservableStore");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const Functions_1 = require("polar-shared/src/util/Functions");
const initialStore = {
    panels: {},
    onResize: Functions_1.NULL_FUNCTION
};
function mutatorFactory(storeProvider, setStore) {
    return {};
}
function useCallbacksFactory(storeProvider, setStore, mutator) {
    return react_1.default.useMemo(() => {
        function setPanels(panels) {
            const store = storeProvider();
            setStore(Object.assign(Object.assign({}, store), { panels }));
        }
        function toggleSide(side) {
            const store = storeProvider();
            const panel = ArrayStreams_1.arrayStream(Object.values(store.panels))
                .filter(current => current.side === side)
                .first();
            if (panel) {
                const newPanel = Object.assign({}, panel);
                newPanel.collapsed = !panel.collapsed;
                const newPanels = Object.assign({}, store.panels);
                newPanels[newPanel.id] = newPanel;
                setStore(Object.assign(Object.assign({}, store), { panels: newPanels }));
                setTimeout(store.onResize, 1);
            }
        }
        return {
            setPanels, toggleSide
        };
    }, [storeProvider, setStore]);
}
function useDockLayoutResized() {
    exports.useDockLayoutStore(['panels']);
}
exports.useDockLayoutResized = useDockLayoutResized;
_a = ObservableStore_1.createObservableStore({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory
}), exports.DockLayoutStoreProvider = _a[0], exports.useDockLayoutStore = _a[1], exports.useDockLayoutCallbacks = _a[2];
//# sourceMappingURL=DockLayoutStore.js.map