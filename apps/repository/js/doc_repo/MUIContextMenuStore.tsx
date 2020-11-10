import * as React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {createObservableStore, SetStore} from "../../../../web/js/react/store/ObservableStore";

/**
 * High level store so that sub-components can determine if we're in zen mode to turn on/off specific UI components.
 */
interface IMUIContextMenuStore {
    readonly active: boolean;
}

interface IMUIContextMenuCallbacks {
    readonly setActive: (active: boolean) => void;
}

const initialStore: IMUIContextMenuStore = {
    active: false
}

interface Mutation {
}

interface Mutator {

}

function mutatorFactory(storeProvider: Provider<IMUIContextMenuStore>,
                        setStore: SetStore<IMUIContextMenuStore>): Mutator {

    return {};

}

function useCallbacksFactory(storeProvider: Provider<IMUIContextMenuStore>,
                             setStore: (store: IMUIContextMenuStore) => void,
                             mutator: Mutator): IMUIContextMenuCallbacks {

    return React.useMemo(() => {

        function setActive(active: boolean) {
            setStore({active})
        }

        return {
            setActive,
        };

    }, [storeProvider, setStore]);


}

export const [MUIContextMenuStoreProvider, useMUIContextMenuStore, useMUIContextMenuCallbacks, useMUIContextMenuMutator] =
    createObservableStore<IMUIContextMenuStore, Mutator, IMUIContextMenuCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory
    });

