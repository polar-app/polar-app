import {CallbacksFactory, createObservableStore} from "../ObservableStore";
import {Tag, Tags} from "polar-shared/src/tags/Tags";

interface ITagStore {
    readonly tags: ReadonlyArray<Tag>;
}

interface ITagCallbacks {
    readonly tagsProvider: () => ReadonlyArray<Tag>;
}

const callbacksFactory: CallbacksFactory<ITagStore, ITagCallbacks> = (store, setStore) => {
    return {
        tagsProvider: () => store.current.tags
    }
};

const tagStore: ITagStore = {
    tags: [Tags.create('hello')]
}

export const [TagStoreProvider, useTagStore, useTagStoreCallbacks]
    = createObservableStore<ITagStore, ITagCallbacks>(tagStore, callbacksFactory);
