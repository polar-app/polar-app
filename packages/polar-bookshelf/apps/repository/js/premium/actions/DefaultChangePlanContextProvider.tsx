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

const initiateNativeAppleIap = async (email: string, plan: Billing.V2Plan): Promise<void> => {
    if ((window as any).ReactNativeWebView) {
        (window as any).ReactNativeWebView.postMessage(JSON.stringify({
            action: 'buy_play',
            data: {
                plan: plan.level,
                email,
            }
        }))
    }
};

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

                    // This boolean flag is injected through the native app's WebView
                    // and is used to tell the React code (like the one here) that Polar Bookshelf
                    // is being viewed through the native app's WebView
                    if ((window as any).isNativeApp) {
                        await initiateNativeAppleIap(email, newSubscription.plan);
                        return;
                    }
                    await stripeCheckout(newSubscription, email);
                }

                doAsync().catch(err => log.error(err));

            }

        };

        const changeHandler = () => {

            const onAccept = () => {

                dialogManager.snackbar({message: `Changing plan to ${plan.level} billed at interval ${interval}.  One moment...`});

                // This boolean flag is injected through the native app's WebView
                // and is used to tell the React code (like the one here) that Polar Bookshelf
                // is being viewed through the native app's WebView
                if ((window as any).isNativeApp) {
                    const email = userInfoContext?.userInfo?.email;
                    if (!email) {
                        alert(`Can not change to plan ${plan.level} without a valid email`);
                        return;
                    }
                    initiateNativeAppleIap(email, plan).then(() => {
                        console.log('Plan changed to ' + plan);
                    }, (err) => {
                        console.error('Attempted to launch an In App Payment within the mobile app but the Promise was rejected')
                        console.error(err);
                        alert('Failed to purchase plan: ' + plan);
                    });
                    return;
                }

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

