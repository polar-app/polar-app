import React from 'react';
import {Provider} from 'polar-shared/src/util/Providers';
import {createObservableStore, SetStore} from "../../react/store/ObservableStore";
import {DockPanel, FixedDocPanelStateMap, SideType} from './DockLayoutManager';
import { arrayStream } from 'polar-shared/src/util/ArrayStreams';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export interface IDockLayoutStore {

    readonly panels: FixedDocPanelStateMap;

    readonly dockPanels: ReadonlyArray<DockPanel>;

    /**
     * Called when internal components resize.
     */
    readonly onResize: () => void;

}

export interface IDockLayoutCallbacks {

    readonly setPanels: (panels: FixedDocPanelStateMap) => void;
    readonly toggleSide: (side: SideType) => void;

}

const initialStore: IDockLayoutStore = {
    panels: {},
    dockPanels: [],
    onResize: NULL_FUNCTION
}

interface Mutator {
}

function mutatorFactory(storeProvider: Provider<IDockLayoutStore>,
                        setStore: SetStore<IDockLayoutStore>): Mutator {

    return {};

}

function useCallbacksFactory(storeProvider: Provider<IDockLayoutStore>,
                             setStore: (store: IDockLayoutStore) => void,
                             mutator: Mutator): IDockLayoutCallbacks {

    return React.useMemo((): IDockLayoutCallbacks => {

        function setPanels(panels: FixedDocPanelStateMap) {
            const store = storeProvider();
            setStore({...store, panels});
        }

        function toggleSide(side: SideType) {

            const store = storeProvider();

            const panel = arrayStream(Object.values(store.panels))
                              .filter(current => current.side === side)
                              .first();

            if (panel) {

                const newPanel = {...panel};
                newPanel.collapsed = ! panel.collapsed;

                const newPanels = {...store.panels}
                newPanels[newPanel.id] = newPanel;

                setStore({...store, panels: newPanels});

                setTimeout(store.onResize, 1);

            }

        }

        return {
            setPanels, toggleSide
        };

    }, [storeProvider, setStore]);

}

export function useDockLayoutResized() {
    useDockLayoutStore(['panels']);
}

export const [DockLayoutStoreProvider, useDockLayoutStore, useDockLayoutCallbacks] =
    createObservableStore<IDockLayoutStore, Mutator, IDockLayoutCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory
    });
