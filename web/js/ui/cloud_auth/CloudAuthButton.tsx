/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Button, Popover, PopoverBody} from 'reactstrap';
import Popper from 'popper.js';
import {CloudLoginModal} from './CloudLoginModal';
import {Firebase} from '../../firestore/Firebase';
import * as firebase from '../../firestore/lib/firebase';
import {FirebaseUIAuth} from '../../firestore/FirebaseUIAuth';
import {Logger} from '../../logger/Logger';
import {PersistenceLayerManager} from '../../datastore/PersistenceLayerManager';
import {CloudSyncOverviewModal} from './CloudSyncOverviewModal';

const log = Logger.create();

export class CloudAuthButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.enableCloudSync = this.enableCloudSync.bind(this);

        let stage: AuthStage | undefined;

        if (document.location!.href.endsWith("#login")) {
            stage = 'login';
        }

        this.state = {
            mode: 'none',
            stage
        };

        Firebase.init();

        firebase.auth()
            .onAuthStateChanged((user) => this.onAuth(user),
                                (err) => this.onAuthError(err));

    }

    public render() {

        if (this.state.mode === 'needs-auth') {
            return (
                <div>

                    <Button color="primary"
                            size="sm"
                            onClick={() => this.enableCloudSync()}>

                        <i className="fas fa-cloud-upload-alt" style={{marginRight: '5px'}}></i>

                        Cloud Sync

                    </Button>

                    <CloudLoginModal isOpen={this.state.stage === 'login'}
                                     onCancel={() => this.changeAuthStage()}/>

                    <CloudSyncOverviewModal isOpen={this.state.stage === 'overview'}
                                            onCancel={() => this.changeAuthStage()}
                                            onSignup={() => this.changeAuthStage('login')}/>

                </div>

            );

        } else if (this.state.mode === 'authenticated') {

            return (
                <div>

                    <Button color="primary"
                            size="sm"
                            onClick={() => this.logout()}>

                        Logout

                    </Button>

                </div>

            );

        } else {
            return (<div></div>);
        }

    }

    private logout() {

        this.props.persistenceLayerManager.reset();

        window.location.reload();

    }

    private enableCloudSync() {
        this.changeAuthStage('overview');
    }

    private changeAuthStage(stage?: AuthStage) {

        if (stage) {
            document.location!.hash = stage;
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

type AuthStage = 'overview' | 'login';
