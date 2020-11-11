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
exports.useOutlinerMutator = exports.useOutlinerCallbacks = exports.useOutlinerStore = exports.OutlinerStoreProviderDelegate = void 0;
const React = __importStar(require("react"));
const ObservableStore_1 = require("../../../../web/js/react/store/ObservableStore");
const FolderSelectionEvents_1 = require("../../../repository/js/folder_sidebar/FolderSelectionEvents");
const initialStore = {
    selected: [],
    expanded: []
};
function mutatorFactory(storeProvider, setStore) {
    return {};
}
function useCallbacksFactory(storeProvider, setStore, mutator) {
    return React.useMemo(() => {
        function selectRow(node, event, source) {
            const store = storeProvider();
            function toSelected() {
                if (store.selected.length > 1) {
                    return 'multiple';
                }
                else if (store.selected.length === 1) {
                    return 'single';
                }
                else {
                    return 'none';
                }
            }
            function toSelfSelected() {
                return store.selected.includes(node) ? 'yes' : 'no';
            }
            const eventType = FolderSelectionEvents_1.FolderSelectionEvents.toEventType(event, source);
            const selected = toSelected();
            const selfSelected = toSelfSelected();
            const strategy = FolderSelectionEvents_1.FolderSelectionEvents.toStrategy({ eventType, selected, selfSelected });
            const newSelected = FolderSelectionEvents_1.FolderSelectionEvents.executeStrategy(strategy, node, store.selected);
            setStore(Object.assign(Object.assign({}, store), { selected: newSelected }));
        }
        function toggleExpanded(nodes) {
            const store = storeProvider();
            setStore(Object.assign(Object.assign({}, store), { expanded: nodes }));
        }
        function collapseNode(node) {
            const store = storeProvider();
            const expanded = [...store.expanded]
                .filter(current => current !== node);
            setStore(Object.assign(Object.assign({}, store), { expanded }));
        }
        function expandNode(node) {
            const store = storeProvider();
            const expanded = [...store.expanded];
            if (!expanded.includes(node)) {
                expanded.push(node);
            }
            setStore(Object.assign(Object.assign({}, store), { expanded }));
        }
        return {
            toggleExpanded,
            collapseNode,
            expandNode,
            selectRow
        };
    }, [storeProvider, setStore]);
}
_a = ObservableStore_1.createObservableStore({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory
}), exports.OutlinerStoreProviderDelegate = _a[0], exports.useOutlinerStore = _a[1], exports.useOutlinerCallbacks = _a[2], exports.useOutlinerMutator = _a[3];
//# sourceMappingURL=OutlinerStore.js.map