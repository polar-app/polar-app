import React from "react";
import { Provider } from "polar-shared/src/util/Providers";
import {createObservableStore, SetStore} from '../react/store/ObservableStore';
import { arrayStream } from "polar-shared/src/util/ArrayStreams";

export interface TabDescriptor {
  // The URL for this tab so that the router can be used with it.
  readonly title: string;

  // An icon to show for this tab.
  // Currently doesn't work
  readonly icon?: React.ReactNode;

  // Index of TabContent associated with tab
  readonly tabContentIndex: number;

  readonly url: string;
}

export interface TabContentDescriptor {
  // Url of tab content
  // If undefined, then iframe isn't rendered
  readonly url: string | undefined;
}

interface IBrowserTabsStore {
  readonly activeTab: number | undefined;
  readonly tabs: ReadonlyArray<TabDescriptor>;
  readonly tabContents: ReadonlyArray<TabContentDescriptor>;
}

interface IBrowserTabsCallbacks {
  readonly setActiveTab: (id: number) => void;
  readonly addTab: (
    tabDescriptor: TabDescriptor,
  ) => void;
  readonly removeTab: (id: number) => void;
  readonly swapTabs: (id1: number, id2: number) => void;
}

function createInitialTabs(): ReadonlyArray<TabDescriptor> {
  return [
    {
      tabContentIndex: 0,
      title: "Polar: Document Repository",
      url: "/"
    }
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
  ];
}

function createInitialTabContents(): ReadonlyArray<TabContentDescriptor> {
  return [
    {
      url: "/"
    }
  ];
}

const initialStore: IBrowserTabsStore = {
  activeTab: 0,
  tabs: createInitialTabs(),
  tabContents: createInitialTabContents()
};

interface Mutation {
  readonly activeTab: number;
  readonly tabs: ReadonlyArray<TabDescriptor>;
  readonly tabContents: ReadonlyArray<TabContentDescriptor>;
}

interface Mutator {
  readonly doUpdate: (mutation: Mutation) => void;
}

function mutatorFactory(
  storeProvider: Provider<IBrowserTabsStore>,
  setStore: SetStore<IBrowserTabsStore>
): Mutator {
  function doUpdate(mutation: Mutation) {
    setStore(mutation);
  }

  return { doUpdate };
}

function callbacksFactory(
  storeProvider: Provider<IBrowserTabsStore>,
  setStore: (store: IBrowserTabsStore) => void,
  mutator: Mutator
): IBrowserTabsCallbacks {
  // FIXME: now the issue is useHistory here I think...
  // FIXME: useHistory caues the components to reload and it might be that
  // we have two BrowserRouters at the root. I think we should try to go with
  // just ONE router if possible and more properly use switches.

  // const history = useHistory();

  // FIXME: I think this is better BUT ... the memo is still being called
  // and created at least once...

  // eslint-disable-next-line
  return React.useMemo((): IBrowserTabsCallbacks => {
    function setActiveTab(activeTab: number) {
      const store = storeProvider();
      setStore({ ...store, activeTab });
    }

    function addTab(
      tabDescriptor: TabDescriptor,
    ) {
      const store = storeProvider();

      function computeExistingTab() {
        return arrayStream(store.tabContents)
          .withIndex()
          .filter((current) => current.value.url === tabDescriptor.url)
          .first();
      }

      const doTabMutation = (newStore: IBrowserTabsStore) => {
        setStore(newStore);
      }

      const existingTab = computeExistingTab();

      if (existingTab) {
        // just switch to the existing tab when one already exists and we
        // want to switch to it again.
        doTabMutation({ ...store, activeTab: existingTab.index });
        return;
      }

      const newTabDescriptor: TabDescriptor = {
        ...tabDescriptor,
        tabContentIndex: store.tabContents.length
      };

      const tabs = [...store.tabs, newTabDescriptor];
      const tabContents = [...store.tabContents, {url: tabDescriptor.url}];

      // now switch to the new tab
      const activeTab = tabs.length - 1;

      doTabMutation({ ...store, activeTab, tabs, tabContents });
    }

    function removeTab(id: number) {
      const store = storeProvider();

      function computeTabs() {
        const tabs = [...store.tabs];
        tabs.splice(id, 1);
        return tabs;
      }

      function computeTabContents(): TabContentDescriptor[] {
        // Determines tab panel index based on tabContentIndex
        const tabContentIndex = store.tabs[id].tabContentIndex;
        const tabContents = [...store.tabContents] as any[];

        // Set to undefined to remove iframe from DOM
        tabContents[tabContentIndex].url = undefined;
        return tabContents;
      }

      const tabs = computeTabs();
      const tabContents = computeTabContents();

      setStore({ ...store, tabs, tabContents });
    }

    function swapTabs(id1: number, id2: number) {
      const store = storeProvider();

      const tabs = [...store.tabs];
      [tabs[id1], tabs[id2]] = [tabs[id2], tabs[id1]];
      setStore({ ...store, tabs });
    }

    return {
      addTab,
      removeTab,
      setActiveTab,
      swapTabs
    };
  }, [storeProvider, setStore]);
}

export function createBrowserTabsStore() {
  return createObservableStore<
    IBrowserTabsStore,
    Mutator,
    IBrowserTabsCallbacks
  >({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory
  });
}

export const [
  BrowserTabsStoreProvider,
  useBrowserTabsStore,
  useBrowserTabsCallbacks
] = createBrowserTabsStore();
