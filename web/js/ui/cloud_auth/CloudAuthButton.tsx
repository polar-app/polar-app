/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Button, Popover, PopoverBody, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import Popper from 'popper.js';
import {CloudLoginModal} from './CloudLoginModal';
import {Firebase} from '../../firebase/Firebase';
import * as firebase from '../../firebase/lib/firebase';
import {FirebaseUIAuth} from '../../firebase/FirebaseUIAuth';
import {Logger} from '../../logger/Logger';
import {PersistenceLayerManager} from '../../datastore/PersistenceLayerManager';
import {CloudSyncOverviewModal} from './CloudSyncOverviewModal';
import {CloudSyncConfiguredModal} from './CloudSyncConfiguredModal';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {Nav} from '../util/Nav';
import {InviteUsersModal} from './InviteUsersModal';
import {Invitations} from '../../datastore/Invitations';
import {SimpleTooltip} from '../tooltip/SimpleTooltip';
import {URLs} from '../../util/URLs';
import {EnableCloudSyncButton} from './EnableCloudSyncButton';
import {AccountDropdown} from './AccountDropdown';

const log = Logger.create();

export class CloudAuthButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.enableCloudSync = this.enableCloudSync.bind(this);

        let stage: AuthStage | undefined;

        if (document.location!.hash === '#login') {
            RendererAnalytics.event({category: 'cloud', action: 'login'});
            stage = 'login';
        }

        if (document.location!.hash === "#configured") {
            RendererAnalytics.event({category: 'cloud', action: 'configured'});
            stage = 'configured';
        }

        this.state = {
            mode: 'none',
            stage
        };

        log.info("auth state: ", this.state);

        Firebase.init();

        firebase.auth()
            .onAuthStateChanged((user) => this.onAuth(user),
                                (err) => this.onAuthError(err));

    }

    public render() {

        if (this.state.mode === 'needs-auth') {
            return (
                <div>

                    <EnableCloudSyncButton onClick={() => this.enableCloudSync()}/>

                    <CloudLoginModal isOpen={this.state.stage === 'login'}
                                     onCancel={() => this.changeAuthStage()}/>


                    {/*<CloudSyncOverviewModal isOpen={this.state.stage === 'overview'}*/}
                                            {/*onCancel={() => this.changeAuthStage()}*/}
                                            {/*onSignup={() => this.changeAuthStage('login')}/>*/}

                </div>

            );

        } else if (this.state.mode === 'authenticated') {

            return (
                <div>

                    <CloudSyncConfiguredModal isOpen={this.state.stage === 'configured'}
                                              onCancel={() => this.changeAuthStage()}/>

                    <InviteUsersModal isOpen={this.state.stage === 'invite'}
                                      onCancel={() => this.changeAuthStage()}
                                      onInvite={(emailAddresses) => this.onInvitedUsers(emailAddresses)}/>

                    <AccountDropdown onInvite={() => this.changeAuthStage('invite')}
                                     onLogout={() => this.logout()}/>

                </div>

            );

        } else {
            return (<div></div>);
        }

    }

    private logout() {

        this.props.persistenceLayerManager.reset();

        firebase.auth().signOut()
            .then(() => {

                window.location.href = Nav.createHashURL('logout');
                window.location.reload();

            })
            .catch(err => log.error("Unable to logout: ", err));

    }

    private onInvitedUsers(emailAddresses: ReadonlyArray<string>) {

        const handleInvitedUsers = async () => {

            await Invitations.sendInvites(...emailAddresses);
            this.changeAuthStage();

        };

        handleInvitedUsers()
            .catch(err => log.error("Unable to invite users: ", err));

    }

    private enableCloudSync() {
        this.changeAuthStage('login');
    }

    private changeAuthStage(stage?: AuthStage) {

        if (stage === 'login') {
            const base = URLs.toBase(document.location!.href);
            const newLocation = new URL('/apps/repository/login.html', base).toString();
            window.location.href = newLocation;
            return;
        }

        if (stage) {

            RendererAnalytics.event({category: 'cloud', action: 'stage-' + stage});

            document.location!.hash = stage;

        } else {
            document.location!.hash = '';
        }

        this.setState({
            mode: this.state.mode,
            stage
        });

    }

    private onAuth(user: firebase.User | null) {

        let mode: AuthMode = 'needs-auth';

        if (user) {
            mode = 'authenticated';
        }

        this.setState({
              mode,
          });

    }

    private onAuthError(err: firebase.auth.Error) {
        log.error("Authentication error: ", err);
    }

}

interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
}

interface IState {
    readonly mode: AuthMode;
    readonly stage?: AuthStage;
}

type AuthMode = 'none' | 'needs-auth' | 'authenticated';

type AuthStage = 'overview' | 'login' | 'configured' | 'invite';
