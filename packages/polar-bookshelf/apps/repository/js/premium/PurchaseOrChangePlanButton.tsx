import * as React from 'react';
import {Billing} from "polar-accounts/src/Billing";
import Button from '@material-ui/core/Button';
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {useChangePlanActionContext} from "./actions/ChangePlanAction";

const useStyles = makeStyles((theme) =>
    createStyles({
        current_plan: {
            color: theme.palette.secondary.light,
            fontSize: '18px',
            fontWeight: 'bold'
        },
    }),
);


export interface IProps {
    readonly newSubscription: Billing.V2Subscription;
}

export const PurchaseOrChangePlanButton = deepMemo(function PurchaseOrChangePlanButton(props: IProps) {

    const classes = useStyles();
    const changePlanActionContext = useChangePlanActionContext();

    const {newSubscription} = props;

    const {subscription} = changePlanActionContext;

    // true when this is the current plan and we do not need to show the
    // button
    const currentPlan = (newSubscription.plan.level === 'free' && newSubscription.plan.level === subscription?.plan.level) ||
                        Subscriptions.isEqual(newSubscription, subscription);

    // true if we're BUYING a new plan...
    const buyingNewPlan = (subscription?.plan.level || 'free') === 'free';

    const text = buyingNewPlan ? "Purchase" : "Change Plan";

    const clickHandler = React.useCallback(() => {
        changePlanActionContext.action(newSubscription);
    }, [changePlanActionContext, newSubscription]);

    return (
        <div style={{margin: '1rem'}}>

            {currentPlan && (
                <span className={classes.current_plan}>CURRENT PLAN</span>
            )}

            {! currentPlan && (
                <Button color="primary"
                        variant="contained"
                        onClick={clickHandler}>

                    {text}

                </Button>)}

        </div>
    );
})

namespace Subscriptions {
    export function isEqual(a: Billing.V2Subscription | undefined, b: Billing.V2Subscription | undefined) {
        return a?.plan.level === b?.plan.level && a?.interval === b?.interval;
    }
}
