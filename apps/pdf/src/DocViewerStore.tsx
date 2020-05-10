import React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {Logger} from "polar-shared/src/logger/Logger";
import {
    createObservableStore,
    SetStore
} from "../../../web/spectron0/material-ui/store/ObservableStore";

const log = Logger.create();

interface IDocViewerStore {

}

interface IDocViewerCallbacks {

}

const initialStore: IDocViewerStore = {
}

interface Mutator {

}

function mutatorFactory(storeProvider: Provider<IDocViewerStore>,
                        setStore: SetStore<IDocViewerStore>): Mutator {

    function reduce(): IDocViewerStore | undefined {
        return undefined;
    }

    return {};

}

function callbacksFactory(storeProvider: Provider<IDocViewerStore>,
                          setStore: (store: IDocViewerStore) => void,
                          mutator: Mutator): IDocViewerCallbacks {


    return {
    };

}

export const [DocViewerStoreProvider, useDocViewerStore, useDocViewerCallbacks, useDocViewerMutator]
    = createObservableStore<IDocViewerStore, Mutator, IDocViewerCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });

