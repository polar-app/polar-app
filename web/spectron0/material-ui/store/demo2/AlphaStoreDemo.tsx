import {CallbacksFactory, createObservableStore} from "../ObservableStore";
import {Tag, Tags} from "polar-shared/src/tags/Tags";

interface IAlphaStore {
    readonly name: string;
}

interface IAlphaCallbacks {
    readonly setName: (name: string) => void;
}

interface Mutator {

}

function mutatorFactory() {
    return {};
}

const callbacksFactory: CallbacksFactory<IAlphaStore, Mutator, IAlphaCallbacks> = (storeProvider, setStore, mutator) => {

    function setName(name: string) {

        const store = storeProvider();
        setStore({...store, name});
    }

    return {
        setName
    };
};

const store: IAlphaStore = {
    name: "alpha-default"
}

export const [AlphaStoreProvider, useAlphaStore, useAlphaStoreCallbacks]
    = createObservableStore<IAlphaStore, Mutator, IAlphaCallbacks>(store, mutatorFactory, callbacksFactory);
