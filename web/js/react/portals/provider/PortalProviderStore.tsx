import {
    createObservableStore,
    SetStore
} from "../../../../spectron0/material-ui/store/ObservableStore";
import {Provider} from "polar-shared/src/util/Providers";

export interface IPortalProviderStore {
    readonly portal: HTMLElement | undefined;
}

export interface IFolderSidebarCallbacks {
    readonly setPortal: (portal: HTMLElement | undefined) => void;
}

interface Mutator {

    readonly setPortal: (portal: HTMLElement | undefined) => void;

}

function mutatorFactory(storeProvider: Provider<IPortalProviderStore>,
                        setStore: SetStore<IPortalProviderStore>): Mutator {

    function setPortal(portal: HTMLElement | undefined) {
        console.log("FIXME: portal is now set: ", portal);
        setStore({portal});
    }

    return {setPortal};

}

function callbacksFactory(storeProvider: Provider<IPortalProviderStore>,
                          setStore: (store: IPortalProviderStore) => void,
                          mutator: Mutator): IFolderSidebarCallbacks {

    return mutator;

}

const initialStore = {
    portal: undefined
}

export function createPortalProviderStore() {
    return createObservableStore<IPortalProviderStore, Mutator, IFolderSidebarCallbacks>({
          initialValue: initialStore,
          mutatorFactory,
          callbacksFactory
    });
}
