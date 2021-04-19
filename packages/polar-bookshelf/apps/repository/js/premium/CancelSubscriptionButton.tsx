import * as React from 'react';
import {useUserSubscriptionContext} from "../../../../web/js/apps/repository/auth_handler/UserInfoProvider";
import Button from "@material-ui/core/Button";
import {AccountActions} from "../../../../web/js/accounts/AccountActions";
import {useAsyncActionTaskbar, useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export const CancelSubscriptionButton = () => {

    const currentSubscription = useUserSubscriptionContext();
    const dialogs = useDialogManager();
    const asyncActionTaskbar = useAsyncActionTaskbar();

    const handleCancelSubscription = React.useCallback(() => {

        asyncActionTaskbar({
            message: "Cancelling your subscription. Just a moment",
            action: AccountActions.cancelSubscription
        })

    }, [asyncActionTaskbar]);

    const handleClick = React.useCallback(() => {
        dialogs.confirm({
            title: "Are you sure you want to cancel your subscription?",
            subtitle: "We'd hate to see you go but appreciate all your support!",
            type: 'danger',
            onCancel: NULL_FUNCTION,
            onAccept: handleCancelSubscription
        });
    }, [dialogs, handleCancelSubscription])

    if (currentSubscription.plan.level === 'free') {
        return null;
    }

    return (
        <Button variant="contained"
                onClick={handleClick}>
            Cancel Subscription
        </Button>
    );
}