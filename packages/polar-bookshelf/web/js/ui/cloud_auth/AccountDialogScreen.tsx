import React from 'react';
import {MUIDialog} from "../dialogs/MUIDialog";
import {AccountControl} from "./AccountControl";
import {useUserInfoContext} from "../../apps/repository/auth_handler/UserInfoProvider";
import { useHistory } from 'react-router-dom';

export const AccountDialogScreen = () => {

    const history = useHistory();
    const userInfoContext = useUserInfoContext();

    if (! userInfoContext?.userInfo) {
        return null;
    }

    const handleClose = React.useCallback(() => {
        history.goBack();
    }, [history]);

    return (
        <MUIDialog maxWidth="md"
                   open={true}
                   onClose={handleClose}>

            <AccountControl userInfo={userInfoContext?.userInfo}/>

        </MUIDialog>
    );
}