import React from 'react';
import {
    createObservableStore,
    SetStore
} from "../../../../web/js/react/store/ObservableStore";
import {Provider} from "polar-shared/src/util/Providers";
import {PlanInterval} from "./PremiumContent2";

interface IPremiumStore {
    readonly interval: PlanInterval;
}

interface IPremiumCallbacks {

    readonly setInterval: (interval: PlanInterval) => void;

}

const initialStore: IPremiumStore = {
    interval: 'month'
}

interface Mutator {

}

function mutatorFactory(storeProvider: Provider<IPremiumStore>,
                        setStore: SetStore<IPremiumStore>): Mutator {

    return {};

}

function callbacksFactory(storeProvider: Provider<IPremiumStore>,
                          setStore: (store: IPremiumStore) => void,
                          mutator: Mutator): IPremiumCallbacks {

    function setInterval(interval: PlanInterval) {
        const store = storeProvider();
        setStore({...store, interval});
    }

    return {
        setInterval
    };

}
export const [PremiumStoreProviderDelegate, usePremiumStore, usePremiumCallbacks, usePremiumMutator]
    = createObservableStore<IPremiumStore, Mutator, IPremiumCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });
