import React from 'react';
import {Provider} from 'polar-shared/src/util/Providers';
import {createObservableStore, SetStore} from '../react/store/ObservableStore';
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {URLStr} from "polar-shared/src/util/Strings";
import { useHistory } from 'react-router-dom';
import { Arrays } from 'polar-shared/src/util/Arrays';
import {useRefValue} from '../hooks/ReactHooks';

export const SIDE_NAV_ENABLED = true;

export interface ITabImage {
    readonly url: string;
    readonly width: number;
    readonly height: number;
}

export interface TabDescriptorInit {

    /**
     * The URL for this tab so that the router can be used with it.
     */
    readonly url: URLStr;

    /**
     * The title for the tab
     */
    readonly title: string;

    /**
     * An icon to show for this tab
     */
    readonly icon?: React.ReactNode;

    /**
     * The main content for the tab.
     */
    readonly content?: React.ReactNode;

    readonly image?: ITabImage;

}

export interface TabDescriptor extends TabDescriptorInit {

    readonly id: number;

}

interface ISideNavStore {

    readonly activeTab: number | undefined;

    readonly tabs: ReadonlyArray<TabDescriptor>;

}

interface ISideNavCallbacks {

    readonly setActiveTab: (id: number) => void;
    readonly addTab: (tabDescriptor: TabDescriptorInit) => void;
    readonly removeTab: (id: number) => void;

}

function createInitialTabs(): ReadonlyArray<TabDescriptor> {
    return [
        // {
        //     id: 0,
        //     url: '/',
        //     title: 'Documents'
        // },
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

const initialStore: ISideNavStore = {
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

function mutatorFactory(storeProvider: Provider<ISideNavStore>,
                        setStore: SetStore<ISideNavStore>): Mutator {

    function doUpdate(mutation: Mutation) {
        setStore(mutation);
    }

    return {doUpdate};

}

let seq = 0;

function useCallbacksFactory(storeProvider: Provider<ISideNavStore>,
                             setStore: (store: ISideNavStore) => void,
                             mutator: Mutator): ISideNavCallbacks {

    // TODO: NEITHER one of these is trigginer the store to reload.  Not sure
    // what's happening her.e.
    const history = useHistory();
    const historyRef = useRefValue(history);

    // useLogWhenChanged('history', history);
    // useLogWhenChanged('historyRef', historyRef);
    // useLogWhenChanged('storeProvider', storeProvider);
    // useLogWhenChanged('setStore', setStore);

    return React.useMemo((): ISideNavCallbacks => {

        // useMemo SEEMs to be called over and over aain but not sure wy... it should be useMemo...
        // and NONE of its deps are changing.
        console.log("FIXME: Creating SideNav store");

        function tabByID(id: number) {
            const store = storeProvider();
            return Arrays.first(store.tabs.filter(tab => tab.id === id));
        }

        function setActiveTab(activeTabID: number) {
            const store = storeProvider();
            setStore({...store, activeTab: activeTabID});

            const activeTab = tabByID(activeTabID);

            if (activeTab) {
                historyRef.current.push(activeTab.url);
            }

        }

        function addTab(newTabDescriptor: TabDescriptorInit) {

            const tabDescriptor: TabDescriptor = {
                ...newTabDescriptor,
                id: seq++
            }

            const store = storeProvider();

            function computeExistingTab() {
                return arrayStream(store.tabs)
                    .withIndex()
                    .filter(current => current.value.url === tabDescriptor.url)
                    .first();
            }

            function doTabMutation(newStore: ISideNavStore) {
                historyRef.current.push(tabDescriptor.url);
                setStore(newStore);
            }

            const existingTab = computeExistingTab();

            if (existingTab) {
                // just switch to the existing tab when one already exists and we
                // want to switch to it again.
                doTabMutation({...store, activeTab: existingTab.index});
                return;
            }

            const tabs = [...store.tabs, tabDescriptor];

            // now switch to the new tab
            const activeTab = tabDescriptor.id;

            doTabMutation({...store, tabs, activeTab});

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

            // FIXME: this needs to change the URL too..
            setStore({...store, tabs, activeTab});

        }

        return {
            addTab, removeTab, setActiveTab
        };

    }, [historyRef, setStore, storeProvider]);

}

export function createSideNavStore() {

    return createObservableStore<ISideNavStore, Mutator, ISideNavCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory
    });
}

export const [SideNavStoreProvider, useSideNavStore, useSideNavCallbacks]
    = createSideNavStore();
