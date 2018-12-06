/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader, Popover, PopoverBody} from 'reactstrap';
import Popper from 'popper.js';
import {LargeModal} from '../large_modal/LargeModal';
import {WhatsNewContent} from '../../../../apps/repository/js/splash/splashes/whats_new/WhatsNewContent';
import {LargeModalBody} from '../large_modal/LargeModalBody';
import {Firebase} from '../../firestore/Firebase';
import {FirebaseUIAuth} from '../../firestore/FirebaseUIAuth';

export class CloudAuthModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
        };

    }

    public componentDidMount(): void {
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {

        if (this.props.isOpen) {
            Firebase.init();
            FirebaseUIAuth.login({signInSuccessUrl: document.location!.href});
        }

    }

    public render() {
        return (

            <LargeModal isOpen={this.props.isOpen}>

                <ModalHeader>Login to Polar</ModalHeader>
                <LargeModalBody>

                    <div id="firebaseui-auth-container"></div>

                </LargeModalBody>
                <ModalFooter>

                </ModalFooter>


            </LargeModal>

        );
    }

}

interface IProps {
    isOpen: boolean;
}

interface IState {
}
