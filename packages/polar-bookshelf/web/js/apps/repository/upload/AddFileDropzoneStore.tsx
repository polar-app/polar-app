import {
    createObservableStore,
    SetStore
} from "../../../react/store/ObservableStore";
import {Provider} from "polar-shared/src/util/Providers";

export interface IAddFileDropzoneStore {

    readonly active: boolean;

}

export interface IAddFileDropzoneCallbacks {

    readonly setActive: (active: boolean) => void;

}

const initialStore: IAddFileDropzoneStore = {
    active: false,
}

interface Mutator {

}

function mutatorFactory(storeProvider: Provider<IAddFileDropzoneStore>,
                        setStore: SetStore<IAddFileDropzoneStore>): Mutator {

    return {};

}

function callbacksFactory(storeProvider: Provider<IAddFileDropzoneStore>,
                          setStore: (store: IAddFileDropzoneStore) => void,
                          mutator: Mutator): IAddFileDropzoneCallbacks {

    function setActive(active: boolean) {

        const store = storeProvider();

        if (store.active !== active) {
            // only change if the value changes
            setStore({active});
        }

    }

    return {setActive};

}

const observableStore = createObservableStore<IAddFileDropzoneStore, Mutator, IAddFileDropzoneCallbacks>({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory
});


export const [
    AddFileDropzoneProvider,
    useAddFileDropzoneStore,
    useAddFileDropzoneCallbacks,
    useAddFileDropzoneMutator
] = observableStore;

AddFileDropzoneProvider.displayName = 'AddFileDropzoneProvider';