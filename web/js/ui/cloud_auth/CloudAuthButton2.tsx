/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, {useCallback, useEffect, useState} from 'react';
import {Firebase} from '../../firebase/Firebase';
import * as firebase from '../../firebase/lib/firebase';
import {User} from '../../firebase/lib/firebase';
import {Logger} from 'polar-shared/src/logger/Logger';
import {EnableCloudSyncButton} from './EnableCloudSyncButton';
import {AccountDropdown} from './AccountDropdown';
import {
    AuthHandlers,
    UserInfo
} from '../../apps/repository/auth_handler/AuthHandler';
import {AccountControlDropdown} from './AccountControlDropdown';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {AccountActions} from "../../accounts/AccountActions";
import {useHistory} from 'react-router-dom';

const log = Logger.create();

interface IState {
    readonly mode: AuthMode;
    readonly userInfo?: UserInfo;
}

type AuthMode = 'none' | 'needs-auth' | 'authenticated';


function enableCloudSync() {
    AccountActions.login();
}

// TODO: perhaps we should use a dialog for this?
function onAuthError(err: firebase.auth.Error) {
    log.error("Authentication error: ", err);
}

function useLogoutCallback() {

    const history = useHistory();

    return () => {
        history.push({pathname: '/logout'})
    };

}

export const CloudAuthButton2 = React.memo(() => {

    const [state, setState] = useState<IState>({
        mode: 'none',
    });

    Firebase.init();

    const doLogout = useLogoutCallback();

    const doAuth = useCallback((user: User | null) => {

        const doAsync = async () => {

            const userInfo = await AuthHandlers.get().userInfo();

            let mode: AuthMode = 'needs-auth';

            if (user) {
                mode = 'authenticated';
            }

            setState({
                mode,
                userInfo: userInfo.getOrUndefined()
            });

        };

        doAsync()
        .catch(err => log.error("Unable to get user info: ", err));

    }, []);

    useEffect(() => {
        firebase.auth()
        .onAuthStateChanged((user) => doAuth(user),
                            (err) => onAuthError(err));
    }, []);

    function logout() {
        doLogout();
    }

    const AccountButton = () => {

        if (state.userInfo) {

            return <AccountControlDropdown userInfo={state.userInfo}
                                           onLogout={() => logout()}/>;

        } else {

            return <AccountDropdown onInvite={NULL_FUNCTION}
                                    onLogout={() => logout()}/>;

        }

    };

    if (state.mode === 'needs-auth') {
        return (
            <div>

                <EnableCloudSyncButton onClick={() => enableCloudSync()}/>

            </div>

        );

    } else if (state.mode === 'authenticated') {

        return (
            <div>
                <AccountButton/>
            </div>

        );

    } else {
        return null;
    }

});
