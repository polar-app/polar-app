import React from 'react';
import {Billing} from "polar-accounts/src/Billing";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IPricingStore {
    readonly interval: Billing.Interval;
}

interface IPricingCallbacks {

    readonly setInterval: (interval: Billing.Interval) => void;

}

const StoreContext = React.createContext<IPricingStore>({interval: 'month'});
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

export const PricingStoreProvider = React.memo((props: IProps) => {

    const [interval, setInterval] = React.useState<Billing.Interval>('month');

    return (
        <StoreContext.Provider value={{interval}}>
            <CallbacksContext.Provider value={{setInterval}}>
                {props.children}
            </CallbacksContext.Provider>
        </StoreContext.Provider>
    );

})