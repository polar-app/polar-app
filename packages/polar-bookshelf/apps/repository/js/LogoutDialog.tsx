import React from 'react';
import {useLogoutCallback} from "../../../web/js/accounts/AccountHooks";
import {useDialogManager} from "../../../web/js/mui/dialogs/MUIDialogControllers";

export const LogoutDialog = () => {

    const doLogout = useLogoutCallback();

    const dialogManager = useDialogManager();

    const handleLogout = React.useCallback(() => {
        doLogout();
    }, [doLogout]);

    console.log("Asking user if they want to logout");

    React.useEffect(() => {
        dialogManager.confirm({
            type: 'danger',
            title: "Are you sure you want to logout?",
            subtitle: "Just wanted to double check. Are you sure you want to logout?",
            onAccept: handleLogout
        });
    }, [dialogManager, handleLogout]);

}
