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

    const dialogManager = useDialogManager();
    const log = useLogger();
    const userInfoContext = useUserInfoContext();
    const currentSubscription = useUserSubscriptionContext();

    return React.useCallback((newSubscription: Billing.V2Subscription) => {

        const {interval, plan} = newSubscription;

        const email = userInfoContext?.userInfo?.email;

        const computeNewPlanID = () => {

            // FIXME: this is wrong and we have to read from the correct plans.

            if (interval === 'year') {
                return `${plan.level}_${interval}`;
            }

            return plan.level;

        };

        const newPlanID = computeNewPlanID();

        const buyHandler = () => {
            // if we're buying a NEW product go ahead and redirect us to
            // stripe and use their BUY package.  This is better than embedding
            // the stripe SDK and also stripe ALSO needs to run over HTTPS

            if (email) {

                const params = {
                    email: encodeURIComponent(email)
                };

                Nav.openLinkWithNewTab(`https://getpolarized.io/pay.html?email=${params.email}&plan=${newPlanID}`);
            } else {
                Nav.openLinkWithNewTab(`https://getpolarized.io/pay.html?plan=${newPlanID}`);
            }

        };

        const changeHandler = () => {

            const onAccept = () => {

                console.log("Changing plan to: " + newPlanID);

                dialogManager.snackbar({message: `Changing plan to ${plan.level} for interval ${interval}.  One moment...`});

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

        const buyingNewPlan = currentSubscription.plan.level === 'free';

        if (buyingNewPlan) {
            buyHandler();
        } else {
            changeHandler();
        }

    }, [dialogManager, log, userInfoContext, currentSubscription]);

}

interface IProps {
    readonly children: React.ReactNode;
}

export const DefaultChangePlanContextProvider = deepMemo((props: IProps) => {

    const type = 'change';
    const action = useAction();
    const subscription = useUserSubscriptionContext();

    return (
        <ChangePlanActionContext.Provider value={{type, action, subscription}}>
            {props.children}
        </ChangePlanActionContext.Provider>
    )

});

