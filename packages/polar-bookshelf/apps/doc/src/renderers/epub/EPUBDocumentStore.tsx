import {Provider} from "polar-shared/src/util/Providers";
import {
    createObservableStore,
    SetStore
} from "../../../../../web/js/react/store/ObservableStore";
import Section from "epubjs/types/section";

export interface IEPUBDocumentStore {

    /**
     * The number of times the epub has been rendered so that we can rebuild
     * the UI if the EPUB is rendered via page change, resize, etc.
     */
    readonly renderIter: number;

    /**
     * The current section of the epub.
     */
    readonly section?: Section;

}

export interface IEPUBDocumentCallbacks {

    /**
     * Increment the render iter.
     */
    readonly incrRenderIter: () => void;

    readonly setSection: (section: Section) => void;
}

const initialStore: IEPUBDocumentStore = {
    renderIter: 0
}

interface Mutator {

}

function mutatorFactory(storeProvider: Provider<IEPUBDocumentStore>,
                        setStore: SetStore<IEPUBDocumentStore>): Mutator {

    return {};

}

function callbacksFactory(storeProvider: Provider<IEPUBDocumentStore>,
                          setStore: (store: IEPUBDocumentStore) => void,
                          mutator: Mutator): IEPUBDocumentCallbacks {

    function incrRenderIter() {
        const store = storeProvider();
        setStore({...store, renderIter: store.renderIter + 1});
    }

    function setSection(section: Section) {
        const store = storeProvider();
        setStore({...store, section});
    }

    return {incrRenderIter, setSection};

}

const observableStore = createObservableStore<IEPUBDocumentStore, Mutator, IEPUBDocumentCallbacks>({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory
});


export const [
    EPUBDocumentStoreProvider,
    useEPUBDocumentStore,
    useEPUBDocumentCallbacks,
    useEPUBDocumentMutator
] = observableStore;
