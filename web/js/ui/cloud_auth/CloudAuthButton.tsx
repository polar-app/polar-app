/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Firebase} from '../../firebase/Firebase';
import {Logger} from 'polar-shared/src/logger/Logger';
import {PersistenceLayerController} from '../../datastore/PersistenceLayerManager';
import {EnableCloudSyncButton} from './EnableCloudSyncButton';
import {AccountDropdown} from './AccountDropdown';
import {AccountControlDropdown} from './AccountControlDropdown';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {AccountActions} from "../../accounts/AccountActions";
import {useUserInfoContext} from "../../apps/repository/auth_handler/UserInfoProvider";
import {useHistory} from "react-router-dom";

const log = Logger.create();

type AuthMode = 'none' | 'needs-auth' | 'authenticated';

export function useLogoutCallback() {

    const history = useHistory();

    return () => {
        history.push("/logout")
    };

}

export const CloudAuthButton = React.memo(() => {

    const userInfoContext = useUserInfoContext();
    const doLogout = useLogoutCallback();

    function computeMode(): AuthMode {

        if (! userInfoContext) {
            return 'none'
        }

        if (! userInfoContext.userInfo) {
            return 'needs-auth';
        }

        return 'authenticated';

    }

    const mode = computeMode();

    log.info("auth state: ", mode);

    Firebase.init();

    function enableCloudSync() {
        AccountActions.login();
    }

    const AccountButton = () => {

        if (userInfoContext?.userInfo) {

            return <AccountControlDropdown userInfo={userInfoContext?.userInfo}
                                           onLogout={doLogout}/>;

        } else {

            return <AccountDropdown onInvite={NULL_FUNCTION}
                                    onLogout={doLogout}/>;

        }

    };

    if (mode === 'needs-auth') {
        return (
            <div>

                <EnableCloudSyncButton onClick={() => enableCloudSync()}/>

            </div>

        );

    } else if (mode === 'authenticated') {

        return (
            <div>
                <AccountButton/>
            </div>

        );

    } else {
        return null;
    }

});
