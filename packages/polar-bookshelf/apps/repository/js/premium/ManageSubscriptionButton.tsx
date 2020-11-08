import * as React from 'react';
import Button from "@material-ui/core/Button";
import {AccountActions} from "../../../../web/js/accounts/AccountActions";
import {useAsyncActionTaskbar} from "../../../../web/js/mui/dialogs/MUIDialogControllers";

export const ManageSubscriptionButton = () => {

    const asyncActionTaskbar = useAsyncActionTaskbar()

    const handleClick = React.useCallback(() => {

        asyncActionTaskbar({
            message: "Sending you to the customer portal.  One moment",
            action: async () => await AccountActions.redirectToStripeCustomerPortal()
        });

    }, [asyncActionTaskbar]);

    return (
        <Button variant="contained"
                onClick={handleClick}>
            Manage Subscription
        </Button>
    );
}