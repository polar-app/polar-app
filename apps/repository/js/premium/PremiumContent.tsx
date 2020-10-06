/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {AccountActions} from '../../../../web/js/accounts/AccountActions';
import Button from '@material-ui/core/Button';
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {useLogger} from "../../../../web/js/mui/MUILogger";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {useUserSubscriptionContext} from "../../../../web/js/apps/repository/auth_handler/UserInfoProvider";
import {PlanPricing} from "./PlanPricing";


function useCancelSubscription() {

    const log = useLogger();
    const dialogManager = useDialogManager();

    return () => {

        const onAccept = () => {

            dialogManager.snackbar({message: "Canceling plan.  One moment..."});

            AccountActions.cancelSubscription()
                .catch(err => log.error("Unable to cancel plan: ", err));

        };

        dialogManager.confirm({
            title: `Are you sure you want to cancel your plan and revert to the free tier?`,
            subtitle: 'Your billing will automatically be updated and account pro-rated.',
            onAccept
        });

    }

}


export const FreePlan = deepMemo(() => {
    return <div>
        <h2>FREE</h2>

        <h3 className="text-xxlarge">$0</h3>
        <p className="text-small text-tint">
            We want as many people to use Polar as
            possible. Most people
            easily stay within these limits.
        </p>

    </div>;
});

export const PlusPlan = deepMemo((props: IState) => {

    return <div>
        <h2>PLUS</h2>

        <PlanPricing plan='plus'/>

        <p className="text-small text-tint">Less
            than the price of a cup of
            coffee. Need more storage and ready to
            move up to the next level? We're ready
            when you are!</p>

    </div>;

});

export const ProPlan = deepMemo(() => {
    return <div>
        <h2>PRO</h2>

        <PlanPricing plan='pro'/>

        <p className="text-small text-tint">
            You can't live without Polar
            and have a massive amount of data that
            you need to keep secure.
        </p>
        <br/>
    </div>;
});

interface IState {
}

export type PlanInterval = 'month' | 'year' | '4year';

