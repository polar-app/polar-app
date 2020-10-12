import React from 'react';
import {
    createObservableStore,
    SetStore
} from "../../../../web/js/react/store/ObservableStore";
import {Provider} from "polar-shared/src/util/Providers";
import {Billing} from "polar-accounts/src/Billing";

interface IPricingStore {
    readonly interval: Billing.Interval;
}

interface IPricingCallbacks {

    readonly setInterval: (interval: Billing.Interval) => void;

    readonly toggleInterval: () => void;

}

const initialStore: IPricingStore = {
    interval: 'month'
}

interface Mutator {

}

function mutatorFactory(storeProvider: Provider<IPricingStore>,
                        setStore: SetStore<IPricingStore>): Mutator {

    return {};

}

function callbacksFactory(storeProvider: Provider<IPricingStore>,
                          setStore: (store: IPricingStore) => void,
                          mutator: Mutator): IPricingCallbacks {

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
export const [PricingStoreProvider, usePricingStore, usePricingCallbacks, usePricingMutator]
    = createObservableStore<IPricingStore, Mutator, IPricingCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });
