"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSideNavCallbacks = exports.useSideNavStore = exports.SideNavStoreProvider = exports.createSideNavStore = void 0;
const react_1 = __importDefault(require("react"));
const ObservableStore_1 = require("../react/store/ObservableStore");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const react_router_dom_1 = require("react-router-dom");
const Arrays_1 = require("polar-shared/src/util/Arrays");
const ReactHooks_1 = require("../hooks/ReactHooks");
function createInitialTabs() {
    return [];
}
const initialStore = {
    activeTab: 0,
    tabs: createInitialTabs(),
};
function mutatorFactory(storeProvider, setStore) {
    function doUpdate(mutation) {
        setStore(mutation);
    }
    return { doUpdate };
}
let seq = 0;
function useCallbacksFactory(storeProvider, setStore, mutator) {
    const history = react_router_dom_1.useHistory();
    const historyRef = ReactHooks_1.useRefValue(history);
    return react_1.default.useMemo(() => {
        console.log("Creating SideNav store");
        function tabByID(id) {
            const store = storeProvider();
            return Arrays_1.Arrays.first(store.tabs.filter(tab => tab.id === id));
        }
        function setActiveTab(activeTabID) {
            const store = storeProvider();
            setStore(Object.assign(Object.assign({}, store), { activeTab: activeTabID }));
            const activeTab = tabByID(activeTabID);
            if (activeTab) {
                historyRef.current.push(activeTab.url);
            }
        }
        function addTab(newTabDescriptor) {
            const tabDescriptor = Object.assign(Object.assign({}, newTabDescriptor), { id: seq++ });
            const store = storeProvider();
            function computeExistingTab() {
                return ArrayStreams_1.arrayStream(store.tabs)
                    .withIndex()
                    .filter(current => current.value.url === tabDescriptor.url)
                    .first();
            }
            function doTabMutation(newStore) {
                historyRef.current.push(tabDescriptor.url);
                setStore(newStore);
            }
            const existingTab = computeExistingTab();
            if (existingTab) {
                doTabMutation(Object.assign(Object.assign({}, store), { activeTab: existingTab.index }));
                return;
            }
            const tabs = [...store.tabs, tabDescriptor];
            const activeTab = tabDescriptor.id;
            doTabMutation(Object.assign(Object.assign({}, store), { tabs, activeTab }));
        }
        function removeTab(id) {
            const store = storeProvider();
            function computeTabs() {
                const tabs = [...store.tabs];
                tabs.splice(id, 1);
                return tabs;
            }
            function computeActiveTab() {
                if (store.activeTab === id) {
                    return Math.max(store.activeTab - 1, 1);
                }
                return store.activeTab;
            }
            const tabs = computeTabs();
            const activeTab = computeActiveTab();
            setStore(Object.assign(Object.assign({}, store), { tabs, activeTab }));
        }
        return {
            addTab, removeTab, setActiveTab
        };
    }, [storeProvider, setStore, historyRef]);
}
function createSideNavStore() {
    return ObservableStore_1.createObservableStore({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory
    });
}
exports.createSideNavStore = createSideNavStore;
_a = createSideNavStore(), exports.SideNavStoreProvider = _a[0], exports.useSideNavStore = _a[1], exports.useSideNavCallbacks = _a[2];
//# sourceMappingURL=SideNavStore.js.map