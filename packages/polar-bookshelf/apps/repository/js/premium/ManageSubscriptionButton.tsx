import * as React from 'react';
import {AccountActions} from "../../../../web/js/accounts/AccountActions";
import {useAsyncActionTaskbar} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {useUserSubscriptionContext} from "../../../../web/js/apps/repository/auth_handler/UserInfoProvider";
import PaymentIcon from '@material-ui/icons/Payment';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

export const ManageSubscriptionButton = React.memo(function ManageSubscriptionButton() {

    const asyncActionTaskbar = useAsyncActionTaskbar()
    const currentSubscription = useUserSubscriptionContext();
    const redirectToStripeCustomerPortal = AccountActions.useRedirectToStripeCustomerPortal();

    const handleClick = React.useCallback(() => {

        asyncActionTaskbar({
            message: "Sending you to the customer portal.  One moment",
            action: async () => await redirectToStripeCustomerPortal()
        });

    }, [asyncActionTaskbar, redirectToStripeCustomerPortal]);

    if (currentSubscription.plan.level === 'free') {
        return null;
    }

    return (
        <ListItem button onClick={handleClick}>
            <ListItemIcon>
            <PaymentIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Subscription" />
        </ListItem> 
    );
});
