import * as React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {createObservableStore, SetStore} from "../react/store/ObservableStore";

interface IActiveKeyboardShortcutsStore {

    /**
     * True when we should show the active shortcuts dialog.
     */
    readonly showActiveShortcuts: boolean;

}

interface IActiveKeyboardShortcutsCallbacks {
    readonly setShowActiveShortcuts: (showActiveShortcuts: boolean) => void;
}

const initialStore: IActiveKeyboardShortcutsStore = {
    showActiveShortcuts: false
}

interface Mutator {
}

function mutatorFactory(storeProvider: Provider<IActiveKeyboardShortcutsStore>,
                        setStore: SetStore<IActiveKeyboardShortcutsStore>): Mutator {
    return {};
}

function useCallbacksFactory(storeProvider: Provider<IActiveKeyboardShortcutsStore>,
                             setStore: (store: IActiveKeyboardShortcutsStore) => void,
                             mutator: Mutator): IActiveKeyboardShortcutsCallbacks {

    return React.useMemo(() => {

        function setShowActiveShortcuts(showActiveShortcuts: boolean) {
            const store = storeProvider();
            setStore({...store, showActiveShortcuts});
        }

        return {
            setShowActiveShortcuts
        };

    }, [setStore, storeProvider])

}

export const [ActiveKeyboardShortcutsStoreProvider, useActiveKeyboardShortcutsStore, useActiveKeyboardShortcutsCallbacks, useActiveKeyboardShortcutsMutator]
    = createObservableStore<IActiveKeyboardShortcutsStore, Mutator, IActiveKeyboardShortcutsCallbacks>({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory
});

ActiveKeyboardShortcutsStoreProvider.displayName='ActiveKeyboardShortcutsStoreProvider';