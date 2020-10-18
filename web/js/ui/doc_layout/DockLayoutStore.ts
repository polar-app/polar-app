import React from 'react';
import {Provider} from 'polar-shared/src/util/Providers';
import {createObservableStore, SetStore} from "../../react/store/ObservableStore";
import {FixedDocPanelStateMap} from './DockLayoutManager';

export interface IDockLayoutStore {

    readonly panels: FixedDocPanelStateMap;

}

export interface IDockLayoutCallbacks {

    readonly setPanels: (panels: FixedDocPanelStateMap) => void;

}

const initialStore: IDockLayoutStore = {
    panels: {}
}

interface Mutator {
}

function mutatorFactory(storeProvider: Provider<IDockLayoutStore>,
                        setStore: SetStore<IDockLayoutStore>): Mutator {

    return {};

}

function callbacksFactory(storeProvider: Provider<IDockLayoutStore>,
                          setStore: (store: IDockLayoutStore) => void,
                          mutator: Mutator): IDockLayoutCallbacks {

    return React.useMemo((): IDockLayoutCallbacks => {

        function setPanels(panels: FixedDocPanelStateMap) {
            const store = storeProvider();
            setStore({...store, panels});
        }

        return {
            setPanels
        };

    }, [storeProvider, setStore]);

}

export const [DockLayoutStoreProvider, useDockLayoutStore, useDockLayoutCallbacks] =
    createObservableStore<IDockLayoutStore, Mutator, IDockLayoutCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });