import {CallbacksFactory, createObservableStore} from "../ObservableStore";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {useAlphaStore} from "./AlphaStoreDemo";

interface IBetaStore {
    readonly name: string;
}

interface StoreNames {
    readonly alpha: string;
    readonly beta: string;
}

interface IBetaCallbacks {
    readonly setName: (name: string) => void;
    readonly names: () => StoreNames;

}

interface Mutator {

}

function mutatorFactory() {
    return {};
}

const useCallbacksFactory: CallbacksFactory<IBetaStore, Mutator, IBetaCallbacks> = (storeProvider, setStore, mutator) => {

    const alphaStore = useAlphaStore(undefined);

    function setName(name: string) {

        const store = storeProvider();
        setStore({...store, name});
    }

    function names() {

        const store = storeProvider();

        return {
            alpha: alphaStore.name,
            beta: store.name
        }
    }

    return {
        setName, names
    };
};

const store: IBetaStore = {
    name: "beta-default"
}

export const [BetaStoreProvider, useBetaStore, useBetaStoreCallbacks]
    = createObservableStore<IBetaStore, Mutator, IBetaCallbacks>({
        initialValue: store,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory
    });
