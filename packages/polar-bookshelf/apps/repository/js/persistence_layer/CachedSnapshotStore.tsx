import * as React from 'react';
import {
    createObservableStore,
    SetStore
} from "../../../../web/js/react/store/ObservableStore";
import {Provider} from "polar-shared/src/util/Providers";

interface ISnapshot {
    readonly value: any;
    readonly exists: boolean;
}

interface ICachedSnapshotStore {
    readonly snapshot: ISnapshot | undefined;
}

interface ICachedSnapshotCallbacks {
    readonly set: (snapshot: ISnapshot) => void;
}

const initialStore: ICachedSnapshotStore = {
    snapshot: undefined
}

interface Mutator {

}

function mutatorFactory<A>(storeProvider: Provider<ICachedSnapshotStore>,
                           setStore: SetStore<ICachedSnapshotStore>): Mutator {

    return {};

}

function useCallbacksFactory(storeProvider: Provider<ICachedSnapshotStore>,
                             setStore: (store: ICachedSnapshotStore) => void,
                             mutator: Mutator): ICachedSnapshotCallbacks {

    return React.useMemo(() => {

        function set(snapshot: ISnapshot) {
            setStore({snapshot});
        }

        return {
            set
        };

    }, [setStore]);

}

export function createCacheSnapshotStore() {
    return createObservableStore<ICachedSnapshotStore, Mutator, ICachedSnapshotCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory
    });
}

interface IPropsWithChildren {
    readonly children: JSX.Element;
}

export function createCachedSnapshotProvider() {

    const [CachedSnapshotStoreProvider, useCachedSnapshotStore, useCachedSnapshotCallbacks] = createCacheSnapshotStore();

    return (props: IPropsWithChildren) => {

        return (
            <CachedSnapshotStoreProvider>
                {props.children}
            </CachedSnapshotStoreProvider>
        );
    }

}