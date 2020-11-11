import * as React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {createObservableStore, SetStore} from "../react/store/ObservableStore";

/**
 * High level store so that sub-components can determine if we're in zen mode to turn on/off specific UI components.
 */
interface IMUIHoverStore {
    readonly active: boolean;
}

interface IMUIHoverCallbacks {
    readonly setActive: (active: boolean) => void;
}

const initialStore: IMUIHoverStore = {
    active: false
}

interface Mutation {
}

interface Mutator {

}

function mutatorFactory(storeProvider: Provider<IMUIHoverStore>,
                        setStore: SetStore<IMUIHoverStore>): Mutator {

    return {};

}

function useCallbacksFactory(storeProvider: Provider<IMUIHoverStore>,
                             setStore: (store: IMUIHoverStore) => void,
                             mutator: Mutator): IMUIHoverCallbacks {

    return React.useMemo(() => {

        function setActive(active: boolean) {
            setStore({active})
        }

        return {
            setActive,
        };

    }, [setStore]);


}

export const [MUIHoverStoreProvider, useMUIHoverStore, useMUIHoverCallbacks, useMUIHoverMutator] =
    createObservableStore<IMUIHoverStore, Mutator, IMUIHoverCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory
    });

export interface IMUIHoverListener {
    readonly onMouseEnter: () => void;
    readonly onMouseLeave: () => void;
}

export function useMUIHoverListener(): IMUIHoverListener {

    const {setActive} = useMUIHoverCallbacks();

    const onMouseEnter = React.useCallback(() => {
        setActive(true);
    }, [setActive]);

    const onMouseLeave = React.useCallback(() => {
        setActive(false);
    }, [setActive]);

    return {onMouseEnter, onMouseLeave};

}

export function useMUIHoverActive() {
    const {active} = useMUIHoverStore(['active']);
    return active;
}