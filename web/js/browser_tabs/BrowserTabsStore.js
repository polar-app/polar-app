"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBrowserTabsCallbacks = exports.useBrowserTabsStore = exports.BrowserTabsStoreProvider = exports.createBrowserTabsStore = void 0;
const react_1 = __importDefault(require("react"));
const ObservableStore_1 = require("../react/store/ObservableStore");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
function createInitialTabs() {
    return [
        {
            url: '/',
            title: 'Polar: Document Repository'
        },
    ];
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
function useCallbacksFactory(storeProvider, setStore, mutator) {
    return react_1.default.useMemo(() => {
        function setActiveTab(activeTab) {
            const store = storeProvider();
            setStore(Object.assign(Object.assign({}, store), { activeTab }));
        }
        function addTab(tabDescriptor) {
            const store = storeProvider();
            function computeExistingTab() {
                return ArrayStreams_1.arrayStream(store.tabs)
                    .withIndex()
                    .filter(current => current.value.url === tabDescriptor.url)
                    .first();
            }
            function doTabMutation(newStore) {
                history.replaceState(null, tabDescriptor.title, tabDescriptor.url);
                setStore(newStore);
            }
            const existingTab = computeExistingTab();
            if (existingTab) {
                doTabMutation(Object.assign(Object.assign({}, store), { activeTab: existingTab.index }));
                return;
            }
            const tabs = [...store.tabs, tabDescriptor];
            const activeTab = tabs.length - 1;
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
    }, [storeProvider, setStore]);
}
function createBrowserTabsStore() {
    return ObservableStore_1.createObservableStore({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory
    });
}
exports.createBrowserTabsStore = createBrowserTabsStore;
_a = createBrowserTabsStore(), exports.BrowserTabsStoreProvider = _a[0], exports.useBrowserTabsStore = _a[1], exports.useBrowserTabsCallbacks = _a[2];
//# sourceMappingURL=BrowserTabsStore.js.map