import * as React from 'react';
import {AccountActions} from "../../../../../web/js/accounts/AccountActions";
import {useDialogManager} from "../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {Billing} from 'polar-accounts/src/Billing';
import {useLogger} from "../../../../../web/js/mui/MUILogger";
import {ChangePlanActionContext} from "./ChangePlanAction";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {Nav} from "../../../../../web/js/ui/util/Nav";
import {
    useUserInfoContext,
    useUserSubscriptionContext
} from "../../../../../web/js/apps/repository/auth_handler/UserInfoProvider";

function useAction() {

    return React.useCallback((newSubscription: Billing.V2Subscription) => {
        document.location.href = `https://app.getpolarized.io/plans?plan=${newSubscription.plan.level}&interval=${newSubscription.interval}`;
    }, []);

}

interface IProps {
    readonly children: React.ReactNode;
}

export const NullChangePlanContextProvider = deepMemo((props: IProps) => {

    const type = 'buy';
    const action = useAction();
    const subscription = undefined;
    
    return (
        <ChangePlanActionContext.Provider value={{type, action, subscription}}>
            {props.children}
        </ChangePlanActionContext.Provider>
    )

});

