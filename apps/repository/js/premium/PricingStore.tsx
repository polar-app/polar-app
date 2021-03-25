import React from 'react';
import {Billing} from "polar-accounts/src/Billing";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IPricingStore {
    readonly interval: Billing.Interval;
}

interface IPricingCallbacks {

    readonly setInterval: (interval: Billing.Interval) => void;

}

function computeIntervalFromLocation(): Billing.Interval {

    if (typeof window === 'undefined') {
        return 'month';
    }

    if (typeof document === 'undefined') {
        return 'month';
    }

    if (! document?.location?.href) {
        return 'month'
    }

    if (document.location.href.endsWith('#month')) {
        return 'month';
    }

    if (document.location.href.endsWith('#year')) {
        return 'year';
    }

    if (document.location.href.endsWith('#4year')) {
        return '4year';
    }

    return 'month';

}

const initialStore: IPricingStore = {
    interval: computeIntervalFromLocation()
};

const StoreContext = React.createContext<IPricingStore>(initialStore);
const CallbacksContext = React.createContext<IPricingCallbacks>({setInterval: NULL_FUNCTION});

interface IProps {
    readonly children: JSX.Element;
}

export function usePricingStore(keys: ReadonlyArray<keyof IPricingStore>) {
    return React.useContext(StoreContext);
}

export function usePricingCallbacks() {
    return React.useContext(CallbacksContext);
}

export const PricingStoreProvider = React.memo(function PricingStoreProvider(props: IProps) {

    const [interval, setInterval] = React.useState<Billing.Interval>(initialStore.interval);

    return (
        <StoreContext.Provider value={{interval}}>
            <CallbacksContext.Provider value={{setInterval}}>
                {props.children}
            </CallbacksContext.Provider>
        </StoreContext.Provider>
    );

})
