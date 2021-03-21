import {CallbacksFactory, createObservableStore} from "../ObservableStore";
import {Tag, Tags} from "polar-shared/src/tags/Tags";

interface ITagStore {
    readonly tags: ReadonlyArray<Tag>;
}

interface ITagCallbacks {
    readonly tagsProvider: () => ReadonlyArray<Tag>;
}

interface Mutator {

}

function mutatorFactory() {
    return {};
}

const callbacksFactory: CallbacksFactory<ITagStore, Mutator, ITagCallbacks> = (storeProvider, setStore, mutator) => {
    return class {
        public static tagsProvider() {
            const store = storeProvider();
            return store.tags;
        }
    };
};

const tagStore: ITagStore = {
    tags: [Tags.create('hello')]
}

export const [TagStoreProvider, useTagStore, useTagStoreCallbacks]
    = createObservableStore<ITagStore, Mutator, ITagCallbacks>({
        initialValue: tagStore,
        mutatorFactory,
        callbacksFactory
    });
