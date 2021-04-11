import React from 'react';
import {useHistory} from "react-router-dom";
import {ConfirmDialog} from "../../../web/js/ui/dialogs/ConfirmDialog";
import {useLogoutCallback} from "../../../web/js/accounts/AccountHooks";

export const LogoutDialog = () => {

    const history = useHistory();
    const doLogout = useLogoutCallback();

    function goBack() {
        history.replace({hash: ""});
    }

    function handleClose() {
        goBack();
    }

    function handleLogout() {
        goBack();
        doLogout();
    }

    console.log("Asking user if they want to logout");

    return (
        <ConfirmDialog type='danger'
                       title="Are you sure you want to logout?"
                       subtitle="Just wanted to double check. Are you sure you want to logout?"
                       onCancel={handleClose}
                       onAccept={handleLogout}/>
    )

}
