import React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {ILocation} from "../../../../web/js/react/router/ReactRouters";
import {
    createObservableStore,
    SetStore
} from "../../../../web/js/react/store/ObservableStore";
import {useLocation} from 'react-router-dom';

interface IUseLocationChangeStore {

    /**
     * The previous location used to detect the first URL load and any updates
     * including between component mounts since we mount this as a root
     * component.
     */
    readonly prevLocation: ILocation | undefined;

    readonly location: ILocation;

}

interface IUseLocationChangeCallbacks {
    setPrevLocation: (location: ILocation) => void;
    setLocation: (location: ILocation) => void;
}

const initialStore: IUseLocationChangeStore = {
    prevLocation: undefined,
    location: document.location
}

interface Mutator {
}

function mutatorFactory(storeProvider: Provider<IUseLocationChangeStore>,
                        setStore: SetStore<IUseLocationChangeStore>): Mutator {

    return {};

}

function callbacksFactory(storeProvider: Provider<IUseLocationChangeStore>,
                          setStore: (store: IUseLocationChangeStore) => void,
                          mutator: Mutator): IUseLocationChangeCallbacks {

    function setPrevLocation(prevLocation: ILocation) {
        const store = storeProvider();
        setStore({...store, prevLocation});
    }

    function setLocation(location: ILocation) {
        const store = storeProvider();
        setStore({...store, location});
    }

    return {
        setPrevLocation, setLocation
    };

}

export const [UseLocationChangeStoreProvider, useLocationChangeStore, useUseLocationChangeCallbacks, useUseLocationChangeMutator]
    = createObservableStore<IUseLocationChangeStore, Mutator, IUseLocationChangeCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });

