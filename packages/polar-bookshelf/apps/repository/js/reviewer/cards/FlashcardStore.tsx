import * as React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {FlashcardSide} from "./FlashcardCard";
import {createObservableStore, SetStore} from "../../../../../web/js/react/store/ObservableStore";

interface IFlashcardStore {
    readonly side: FlashcardSide;
}

interface IFlashcardCallbacks {
    readonly setSide: (side: FlashcardSide) => void;
}

const initialStore: IFlashcardStore = {
    side: 'front'
}

interface Mutator {

}

function mutatorFactory<A>(storeProvider: Provider<IFlashcardStore>,
                           setStore: SetStore<IFlashcardStore>): Mutator {

    return {};

}

function useCallbacksFactory(storeProvider: Provider<IFlashcardStore>,
                             setStore: (store: IFlashcardStore) => void,
                             mutator: Mutator): IFlashcardCallbacks {

    return React.useMemo(() => {

        function setSide(side: FlashcardSide) {
            const store = storeProvider();
            setStore({...store, side});
        }

        return {setSide}

    }, [setStore, storeProvider]);

}

export const [FlashcardStoreProvider, useFlashcardStore, useFlashcardCallbacks] =
    createObservableStore<IFlashcardStore, Mutator, IFlashcardCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory
    });
