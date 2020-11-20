import {CallbacksFactory, createObservableStore} from "../ObservableStore";
import {useBetaStore} from "./BetaStoreDemo";

interface IAlphaStore {
    readonly name: string;
}

interface StoreNames {
    readonly alpha: string;
    readonly beta: string;
}

interface IAlphaCallbacks {
    readonly setName: (name: string) => void;
    readonly names: () => StoreNames;
}

interface Mutator {

}

function mutatorFactory() {
    return {};
}

const useCallbacksFactory: CallbacksFactory<IAlphaStore, Mutator, IAlphaCallbacks> = (storeProvider, setStore, mutator) => {

    const betaStore = useBetaStore(undefined);

    function setName(name: string) {

        const store = storeProvider();
        setStore({...store, name});
    }

    function names() {

        const store = storeProvider();

        return {
            alpha: store.name,
            beta: betaStore.name
        }
    }

    return {
        setName, names
    };
};

const store: IAlphaStore = {
    name: "alpha-default"
}

export const [AlphaStoreProvider, useAlphaStore, useAlphaStoreCallbacks]
    = createObservableStore<IAlphaStore, Mutator, IAlphaCallbacks>({
        initialValue: store,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory
    });
