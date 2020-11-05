import * as React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {SetStore, createObservableStore} from "../react/store/ObservableStore";

/**
 * High level store so that sub-components can determine if we're in zen mode to turn on/off specific UI components.
 */
interface IZenModeStore {
    readonly zenMode: boolean;
}

interface IZenModeCallbacks {

    readonly toggleZenMode: () => void;

    readonly setZenMode: (zenMode: boolean) => void;

}

const initialStore: IZenModeStore = {
    zenMode: false
}

interface Mutation {
}

interface Mutator {

}

function mutatorFactory(storeProvider: Provider<IZenModeStore>,
                        setStore: SetStore<IZenModeStore>): Mutator {

    return {};

}

function callbacksFactory(storeProvider: Provider<IZenModeStore>,
                          setStore: (store: IZenModeStore) => void,
                          mutator: Mutator): IZenModeCallbacks {

    return React.useMemo(() => {

        function toggleZenMode() {
            const store = storeProvider();
            setZenMode(! store.zenMode);
        }

        function setZenMode(zenMode: boolean) {
            const store = storeProvider();
            setStore({...store, zenMode});
        }

        return {
            toggleZenMode,
            setZenMode,
        };

    }, [storeProvider, setStore]);


}

export const [ZenModeStoreProviderDelegate, useZenModeStore, useZenModeCallbacks, useZenModeMutator] =
    createObservableStore<IZenModeStore, Mutator, IZenModeCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });

