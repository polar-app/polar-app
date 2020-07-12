import React from 'react';
import { Provider } from 'polar-shared/src/util/Providers';
import {createObservableStore, SetStore} from '../react/store/ObservableStore';

export interface TabDescriptor {

    /**
     * The URL for this tab so that the router can be used with it.
     */
    readonly url: string;

    readonly title: string;

    /**
     * An icon to show for this tab.
     */
    readonly icon?: React.ReactNode;

    readonly component?: React.ReactNode;

}

interface IBrowserTabsStore {

    readonly activeTab: number | undefined;

    readonly tabs: ReadonlyArray<TabDescriptor>;

}

interface IBrowserTabsCallbacks {

    readonly setActiveTab: (id: number) => void;
    readonly addTab: (tabDescriptor: TabDescriptor) => void;
    readonly removeTab: (id: number) => void;

}

function createInitialTabs(): ReadonlyArray<TabDescriptor> {
    return [
        {
            url: '/',
            title: 'Polar: Document Repository'
        },
        // {
        //     id: 2,
        //     url: '/doc/39b730b6e9d281b0eae91b2c2c29b842',
        //     title: 'availability.pdf'
        // },
        // {
        //     id: 3,
        //     url: '/doc/65633831393839653565636565353663396137633437306630313331353264366266323462366463373335343834326562396534303262653534353034363564',
        //     title: 'Venture Deals'
        // }
    ]
}

const initialStore: IBrowserTabsStore = {
    activeTab: 0,
    tabs: createInitialTabs(),
}

interface Mutation {
    readonly activeTab: number;
    readonly tabs: ReadonlyArray<TabDescriptor>;
}

interface Mutator {

    readonly doUpdate: (mutation: Mutation) => void;

}

function mutatorFactory(storeProvider: Provider<IBrowserTabsStore>,
                        setStore: SetStore<IBrowserTabsStore>): Mutator {

    function doUpdate(mutation: Mutation) {
        setStore(mutation);
    }

    return {doUpdate};

}

function callbacksFactory(storeProvider: Provider<IBrowserTabsStore>,
                          setStore: (store: IBrowserTabsStore) => void,
                          mutator: Mutator): IBrowserTabsCallbacks {

    function setActiveTab(activeTab: number) {
        const store = storeProvider();
        setStore({...store, activeTab});
    }

    function addTab(tabDescriptor: TabDescriptor) {

        const store = storeProvider();

        const tabs = [...store.tabs, tabDescriptor];

        // now switch to the new tab
        const activeTab = tabs.length - 1;

        setStore({...store, tabs, activeTab});

    }

    function removeTab(id: number) {

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

        setStore({...store, tabs, activeTab});

    }

    return {
        addTab, removeTab, setActiveTab
    };

}

export function createBrowserTabsStore() {
    return createObservableStore<IBrowserTabsStore, Mutator, IBrowserTabsCallbacks>({
          initialValue: initialStore,
          mutatorFactory,
          callbacksFactory
    });
}

export const [BrowserTabsStoreProvider, useBrowserTabsStore, useBrowserTabsCallbacks]
    = createBrowserTabsStore();
