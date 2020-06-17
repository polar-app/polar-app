import React from 'react';
import {useHistory} from "react-router-dom";
import {usePersistenceContext} from "./persistence_layer/PersistenceLayerApp";
import {AccountActions} from "../../../web/js/accounts/AccountActions";
import {ConfirmDialog} from "../../../web/js/ui/dialogs/ConfirmDialog";

function useLogoutCallback() {

    // FIXME: this won't work becaue the nav header is in the wrong place

    const persistenceContext = usePersistenceContext();

    return () => {
        AccountActions.logout(persistenceContext.persistenceLayerManager);
    };

}
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
