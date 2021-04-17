import * as React from 'react';
import {Billing} from "polar-accounts/src/Billing";

export type ChangePlanAction = (newSubscription: Billing.V2Subscription) => void;

interface IChangePlanContext {

    readonly type: 'change' | 'buy';

    readonly action: ChangePlanAction;

    /**
     * The subscription is undefined if we are outside of the app.
     */
    readonly subscription: Billing.V2Subscription | undefined;

}

export const ChangePlanActionContext = React.createContext<IChangePlanContext>(null!);

export function useChangePlanActionContext() {
    return React.useContext(ChangePlanActionContext);
}

