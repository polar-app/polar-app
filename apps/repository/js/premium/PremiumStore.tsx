import React from 'react';
import {
    createObservableStore,
    SetStore
} from "../../../../web/js/react/store/ObservableStore";
import {Provider} from "polar-shared/src/util/Providers";
import {Billing} from "polar-accounts/src/Billing";

interface IPremiumStore {
    readonly interval: Billing.Interval;
}

interface IPremiumCallbacks {

    readonly setInterval: (interval: Billing.Interval) => void;

    readonly toggleInterval: () => void;

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

    function setInterval(interval: Billing.Interval) {
        const store = storeProvider();
        setStore({...store, interval});
    }

    function toggleInterval() {
        const store = storeProvider();
        const interval = store.interval === 'month' ? 'year' : 'month'
        setStore({...store, interval});
    }

    return {
        setInterval, toggleInterval
    };

}
export const [PremiumStoreProvider, usePremiumStore, usePremiumCallbacks, usePremiumMutator]
    = createObservableStore<IPremiumStore, Mutator, IPremiumCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });
