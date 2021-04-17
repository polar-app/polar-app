import * as React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {IDStr} from "polar-shared/src/util/Strings";
import {createObservableStore, SetStore} from "../../../web/js/react/store/ObservableStore";
import {IBlock} from "../../../web/js/notes/store/IBlock";

export type NoteIDStr = IDStr;
export type NoteNameStr = string;

export type AbortedRenderIndex = Readonly<{[id: string /* NoteIDStr */]: IBlock}>;
export type AbortedRenderIndexByName = Readonly<{[name: string /* NoteNameStr */]: IBlock}>;

export type ReverseAbortedRenderIndex = Readonly<{[id: string /* NoteIDStr */]: ReadonlyArray<NoteIDStr>}>;

interface IAbortedRenderStore {

    /**
     * True when we should show the active shortcuts dialog.
     */
    readonly value: number;

}

interface IAbortedRenderCallbacks {
    readonly incr: () => void
}

const initialStore: IAbortedRenderStore = {
    value: 0,
}

interface Mutator {
}

function mutatorFactory(storeProvider: Provider<IAbortedRenderStore>,
                        setStore: SetStore<IAbortedRenderStore>): Mutator {
    return {};
}

function useCallbacksFactory(storeProvider: Provider<IAbortedRenderStore>,
                             setStore: (store: IAbortedRenderStore) => void,
                             mutator: Mutator): IAbortedRenderCallbacks {

    return React.useMemo(() => {

        function incr() {
            const store = storeProvider();
            setStore({
                value: store.value + 1
            });
        }

        return {
            incr
        };

    }, [setStore, storeProvider])

}

export const [AbortedRenderStoreProvider, useAbortedRenderStore, useAbortedRenderStoreCallbacks, useAbortedRenderMutator]
    = createObservableStore<IAbortedRenderStore, Mutator, IAbortedRenderCallbacks>({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory,
    enableShallowEquals: true
});

