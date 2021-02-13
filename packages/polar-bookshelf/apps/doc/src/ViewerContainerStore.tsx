import {Provider} from "polar-shared/src/util/Providers";
import {
    createObservableStore,
    SetStore
} from "../../../web/js/react/store/ObservableStore";

export interface IViewerContainerStore {
    readonly viewerContainer: HTMLElement | undefined;
}

export interface IViewerContainerCallbacks {
    readonly setViewerContainer: (viewerContainer: HTMLElement | null) => void;
}

const initialStore: IViewerContainerStore = {
    viewerContainer: undefined,
}

interface Mutator {

}

function mutatorFactory(storeProvider: Provider<IViewerContainerStore>,
                        setStore: SetStore<IViewerContainerStore>): Mutator {

    return {};

}

function callbacksFactory(storeProvider: Provider<IViewerContainerStore>,
                          setStore: (store: IViewerContainerStore) => void,
                          mutator: Mutator): IViewerContainerCallbacks {

    function setViewerContainer(viewerContainer: HTMLElement | null | undefined) {

        const store = storeProvider();

        if (viewerContainer && store.viewerContainer !== viewerContainer) {
            setStore({...store, viewerContainer});
        }

    }

    return {setViewerContainer};

}

const observableStore = createObservableStore<IViewerContainerStore, Mutator, IViewerContainerCallbacks>({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory
});

export const [
    ViewerContainerProvider,
    useViewerContainerStore,
    useViewerContainerCallbacks,
    useViewerContainerMutator
] = observableStore;

ViewerContainerProvider.displayName='ViewerContainerProvider';