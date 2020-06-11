/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Firebase} from '../../firebase/Firebase';
import * as firebase from 'firebase/app';
import {Logger} from 'polar-shared/src/logger/Logger';
import {PersistenceLayerController} from '../../datastore/PersistenceLayerManager';
import {EnableCloudSyncButton} from './EnableCloudSyncButton';
import {AccountDropdown} from './AccountDropdown';
import {AuthHandlers, UserInfo} from '../../apps/repository/auth_handler/AuthHandler';
import {AccountControlDropdown} from './AccountControlDropdown';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {AccountActions} from "../../accounts/AccountActions";

const log = Logger.create();

export class CloudAuthButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.enableCloudSync = this.enableCloudSync.bind(this);

        this.state = {
            mode: 'none',
        };

        log.info("auth state: ", this.state);

        Firebase.init();

        // FIXME: migrate this to using context ...
        // FIXME: migrate this to a hook?
        firebase.auth()
            .onAuthStateChanged((user) => this.onAuth(user),
                                (err) => this.onAuthError(err));

    }

    public render() {

        const AccountButton = () => {

            if (this.state.userInfo) {

                return <AccountControlDropdown userInfo={this.state.userInfo}
                                               onLogout={() => this.logout()}/>;

            } else {

                return <AccountDropdown onInvite={NULL_FUNCTION}
                                        onLogout={() => this.logout()}/>;

            }

        };

        if (this.state.mode === 'needs-auth') {
            return (
                <div>

                    <EnableCloudSyncButton onClick={() => this.enableCloudSync()}/>

                </div>

            );

        } else if (this.state.mode === 'authenticated') {

            return (
                <div>
                    <AccountButton/>
                </div>

            );

        } else {
            return null;
        }

    }

    private logout() {
        AccountActions.logout(this.props.persistenceLayerController);
    }

    private enableCloudSync() {
        AccountActions.login();
    }

    private onAuth(user: firebase.User | null) {

        AuthHandlers.get().userInfo()
            .then((userInfo) => {

                let mode: AuthMode = 'needs-auth';

                if (user) {
                    mode = 'authenticated';
                }

                this.setState({
                    mode,
                    userInfo: userInfo.getOrUndefined()
                });


            })
            .catch(err => log.error("Unable to get user info: ", err));

    }

    private onAuthError(err: firebase.auth.Error) {
        log.error("Authentication error: ", err);
    }

}

interface IProps {
    readonly persistenceLayerController: PersistenceLayerController;
}

interface IState {
    readonly mode: AuthMode;
    readonly userInfo?: UserInfo;
}

type AuthMode = 'none' | 'needs-auth' | 'authenticated';
