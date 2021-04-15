import * as React from 'react';
import {Billing} from 'polar-accounts/src/Billing';
import {ChangePlanActionContext} from "./ChangePlanAction";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";

function useAction() {

    return React.useCallback((newSubscription: Billing.V2Subscription) => {
        // document.location.href = `https://app.getpolarized.io/plans?plan=${newSubscription.plan.level}&interval=${newSubscription.interval}`;
        document.location.href = `https://app.getpolarized.io/plans#${newSubscription.interval}`;
    }, []);

}

interface IProps {
    readonly children: React.ReactNode;
}

export const NullChangePlanContextProvider = deepMemo(function NullChangePlanContextProvider(props: IProps) {

    const type = 'buy';
    const action = useAction();
    const subscription = undefined;
    
    return (
        <ChangePlanActionContext.Provider value={{type, action, subscription}}>
            {props.children}
        </ChangePlanActionContext.Provider>
    )

});

