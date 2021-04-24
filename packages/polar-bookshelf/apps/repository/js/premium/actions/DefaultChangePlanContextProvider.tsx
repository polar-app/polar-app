import * as React from 'react';
import {AccountActions} from "../../../../../web/js/accounts/AccountActions";
import {useDialogManager} from "../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {Billing} from 'polar-accounts/src/Billing';
import {useLogger} from "../../../../../web/js/mui/MUILogger";
import {ChangePlanActionContext} from "./ChangePlanAction";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {
    useUserInfoContext,
    useUserSubscriptionContext
} from "../../../../../web/js/apps/repository/auth_handler/UserInfoProvider";
import {useStripeCheckout} from "./UseStripeCheckout";

function usePurchaseOrChangePlanAction() {

    const dialogManager = useDialogManager();
    const log = useLogger();
    const userInfoContext = useUserInfoContext();
    const currentSubscription = useUserSubscriptionContext();
    const stripeCheckout = useStripeCheckout();

    return React.useCallback((newSubscription: Billing.V2Subscription) => {

        console.log("Attempting to change to ", newSubscription);

        const {interval, plan} = newSubscription;

        const buyHandler = () => {
            // if we're buying a NEW product go ahead and redirect us to
            // stripe and use their BUY package.  This is better than embedding
            // the stripe SDK and also stripe ALSO needs to run over HTTPS

            const email = userInfoContext?.userInfo?.email;

            if (email) {

                const doAsync = async () => {
                    dialogManager.snackbar({message: 'One moment.  About to setup your purchase... '});
                    await stripeCheckout(newSubscription, email);
                }

                doAsync().catch(err => log.error(err));

            }

        };

        const changeHandler = () => {

            const onAccept = () => {

                dialogManager.snackbar({message: `Changing plan to ${plan.level} billed at interval ${interval}.  One moment...`});

                AccountActions.changePlan(plan.level, interval)
                    .catch(err => log.error("Unable to upgrade plan: ", err));

            };

            dialogManager.confirm({
                title: `Are you sure you want to change to ${plan.level} (${interval})?`,
                subtitle: 'Your billing will automatically be updated and account pro-rated.',
                type: 'warning',
                onAccept
            });

        }

        const buyingNewPlan = currentSubscription.plan.level === 'free' || newSubscription.interval === '4year';

        if (buyingNewPlan) {
            buyHandler();
        } else {
            changeHandler();
        }

    }, [dialogManager, log, userInfoContext, currentSubscription, stripeCheckout]);

}

interface IProps {
    readonly children: React.ReactNode;
}

export const DefaultChangePlanContextProvider = deepMemo(function DefaultChangePlanContextProvider(props: IProps) {

    const type = 'change';
    const action = usePurchaseOrChangePlanAction();
    const subscription = useUserSubscriptionContext();

    return (
        <ChangePlanActionContext.Provider value={{type, action, subscription}}>
            {props.children}
        </ChangePlanActionContext.Provider>
    )

});

