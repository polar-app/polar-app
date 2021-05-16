import * as React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {createObservableStore, SetStore} from "../react/store/ObservableStore";

interface IActiveKeyboardShortcutsStore {

    /**
     * True when we should show the active shortcuts dialog.
     */
    readonly showActiveShortcuts: boolean;

    /**
     * The current active shortcut in the UI when the dialog is open
     */
    readonly index: number | undefined;

    readonly filter: string | undefined;

}

interface IActiveKeyboardShortcutsCallbacks {
    readonly setShowActiveShortcuts: (showActiveShortcuts: boolean) => void;
    readonly setIndex: (index: number | undefined) => void;
    readonly setFilter: (filter: string | undefined) => void;
}

const initialStore: IActiveKeyboardShortcutsStore = {
    showActiveShortcuts: false,
    index: undefined,
    filter: undefined,
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

        function setIndex(index: number | undefined) {
            const store = storeProvider();
            setStore({...store, index});
        }

        function setFilter(filter: string | undefined) {
            const store = storeProvider();
            setStore({...store, filter});
        }

        function setShowActiveShortcuts(showActiveShortcuts: boolean) {
            const store = storeProvider();
            setStore({...store, showActiveShortcuts});
        }

        return {
            setShowActiveShortcuts, setIndex, setFilter
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