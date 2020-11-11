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
            tabContentIndex: 0,
            title: "Polar: Document Repository",
            url: "/"
        }
    ];
}
function createInitialTabContents() {
    return [
        {
            url: "/"
        }
    ];
}
const initialStore = {
    activeTab: 0,
    tabs: createInitialTabs(),
    tabContents: createInitialTabContents()
};
function mutatorFactory(storeProvider, setStore) {
    function doUpdate(mutation) {
        setStore(mutation);
    }
    return { doUpdate };
}
function callbacksFactory(storeProvider, setStore, mutator) {
    return react_1.default.useMemo(() => {
        function setActiveTab(activeTab) {
            const store = storeProvider();
            setStore(Object.assign(Object.assign({}, store), { activeTab }));
        }
        function addTab(tabDescriptor) {
            const store = storeProvider();
            function computeExistingTab() {
                return ArrayStreams_1.arrayStream(store.tabContents)
                    .withIndex()
                    .filter((current) => current.value.url === tabDescriptor.url)
                    .first();
            }
            const doTabMutation = (newStore) => {
                setStore(newStore);
            };
            const existingTab = computeExistingTab();
            if (existingTab) {
                doTabMutation(Object.assign(Object.assign({}, store), { activeTab: existingTab.index }));
                return;
            }
            const newTabDescriptor = Object.assign(Object.assign({}, tabDescriptor), { tabContentIndex: store.tabContents.length });
            const tabs = [...store.tabs, newTabDescriptor];
            const tabContents = [...store.tabContents, { url: tabDescriptor.url }];
            const activeTab = tabs.length - 1;
            doTabMutation(Object.assign(Object.assign({}, store), { activeTab, tabs, tabContents }));
        }
        function removeTab(id) {
            const store = storeProvider();
            function computeTabs() {
                const tabs = [...store.tabs];
                tabs.splice(id, 1);
                return tabs;
            }
            function computeTabContents() {
                const tabContentIndex = store.tabs[id].tabContentIndex;
                const tabContents = [...store.tabContents];
                tabContents[tabContentIndex].url = undefined;
                return tabContents;
            }
            const tabs = computeTabs();
            const tabContents = computeTabContents();
            setStore(Object.assign(Object.assign({}, store), { tabs, tabContents }));
        }
        function swapTabs(id1, id2) {
            const store = storeProvider();
            const tabs = [...store.tabs];
            [tabs[id1], tabs[id2]] = [tabs[id2], tabs[id1]];
            setStore(Object.assign(Object.assign({}, store), { tabs }));
        }
        return {
            addTab,
            removeTab,
            setActiveTab,
            swapTabs
        };
    }, [storeProvider, setStore]);
}
function createBrowserTabsStore() {
    return ObservableStore_1.createObservableStore({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });
}
exports.createBrowserTabsStore = createBrowserTabsStore;
_a = createBrowserTabsStore(), exports.BrowserTabsStoreProvider = _a[0], exports.useBrowserTabsStore = _a[1], exports.useBrowserTabsCallbacks = _a[2];
//# sourceMappingURL=BrowserTabsStore.js.map