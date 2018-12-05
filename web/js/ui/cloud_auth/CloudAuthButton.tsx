/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Button, Popover, PopoverBody} from 'reactstrap';
import Popper from 'popper.js';
import {CloudAuthModal} from './CloudAuthModal';
import {Firebase} from '../../firestore/Firebase';
import * as firebase from '../../firestore/lib/firebase';
import {FirebaseUIAuth} from '../../firestore/FirebaseUIAuth';
import {Logger} from '../../logger/Logger';

const log = Logger.create();

export class CloudAuthButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.enableCloudSync = this.enableCloudSync.bind(this);

        this.state = {
            mode: 'none',
            doAuth: false
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

                        Enable Cloud Sync

                    </Button>

                    <CloudAuthModal isOpen={this.state.doAuth}/>

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

                    <CloudAuthModal isOpen={this.state.doAuth}/>

                </div>

            );

        } else {
            return (<div></div>);
        }

    }

    private logout() {

        // noop for now
        firebase.auth().signOut()
            .catch(err => log.error("Unable to logout: ", err));

    }

    private enableCloudSync() {
        this.setState({
            mode: this.state.mode,
            doAuth: true
        });
    }

    private onAuth(user: firebase.User | null) {

        console.log("FIXME: auth: ", user);

        let mode: AuthMode = 'needs-auth';

        if (user) {
            mode = 'authenticated';
        }

        this.setState({
              mode,
              doAuth: this.state.doAuth
          });


    }

    private onAuthError(err: firebase.auth.Error) {
        log.error("Authentication error: ", err);
    }

}

interface IProps {
}

interface IState {
    mode: AuthMode,
    doAuth: boolean;
}

type AuthMode = 'none' | 'needs-auth' | 'authenticated';

