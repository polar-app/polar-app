import * as React from 'react';
import {Billing} from "polar-accounts/src/Billing";

export type ChangePlanAction = (newSubscription: Billing.V2Subscription) => void;

interface IChangePlanContext {
    readonly type: 'change' | 'buy';
    readonly action: ChangePlanAction;
    readonly subscription: Billing.V2Subscription;
}

export const ChangePlanActionContext = React.createContext<IChangePlanContext>(null!);

export function useChangePlanActionContext() {
    return React.useContext(ChangePlanActionContext);
}

