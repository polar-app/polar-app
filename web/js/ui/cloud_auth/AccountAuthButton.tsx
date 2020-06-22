/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {LoginButton} from './LoginButton';
import {AccountControlDropdown} from './AccountControlDropdown';
import {AccountActions} from "../../accounts/AccountActions";
import {useUserInfoContext} from "../../apps/repository/auth_handler/UserInfoProvider";
import {useHistory} from "react-router-dom";

export function useLogoutCallback() {

    const history = useHistory();

    return () => {
        history.push("/logout")
    };

}

export const AccountAuthButton = React.memo(() => {

    const userInfoContext = useUserInfoContext();
    const doLogout = useLogoutCallback();

    if (! userInfoContext) {
        // we don't currently know our login state
        return null;
    }

    function enableCloudSync() {
        AccountActions.login();
    }

    if (! userInfoContext.userInfo) {
        return <LoginButton onClick={() => enableCloudSync()}/>;
    }

    return <AccountControlDropdown userInfo={userInfoContext?.userInfo}
                                   onLogout={doLogout}/>;


    //
    // const userInfoContext = useUserInfoContext();
    // const doLogout = useLogoutCallback();
    //
    // function computeMode(): AuthMode {
    //
    //     if (! userInfoContext) {
    //         return 'none'
    //     }
    //
    //     if (! userInfoContext.userInfo) {
    //         return 'needs-auth';
    //     }
    //
    //     return 'authenticated';
    //
    // }
    //
    // const mode = computeMode();
    //
    // log.info("auth state: ", mode);
    //
    // Firebase.init();
    //
    // function enableCloudSync() {
    //     AccountActions.login();
    // }
    //
    // const AccountButton = () => {
    //
    //     if (userInfoContext?.userInfo) {
    //
    //         return <AccountControlDropdown userInfo={userInfoContext?.userInfo}
    //                                        onLogout={doLogout}/>;
    //
    //     } else {
    //         return null;
    //     }
    //
    // };
    //
    // if (mode === 'needs-auth') {
    //
    //     return <LoginButton onClick={() => enableCloudSync()}/>;
    //
    // } else if (mode === 'authenticated') {
    //
    //     return <AccountButton/>;
    //
    // } else {
    //     return null;
    // }

});
