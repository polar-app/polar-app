import * as React from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import {Version} from '../../../web/js/util/Version';
import {app} from 'electron';
import {FilePaths} from '../../../web/js/util/FilePaths';
import {Files} from '../../../web/js/util/Files';
import {Logger} from '../../../web/js/logger/Logger';
import {WhatsNewContent} from './WhatsNewContent';

export class WhatsNewModal extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            open: true
        };

    }

    public render() {

        return (

            <div>

                <Modal isOpen={this.state.open}
                       size="lg"
                       style={{overflowY: 'initial', minWidth: '80%'}}>
                    <ModalHeader>What's New in Polar</ModalHeader>
                    <ModalBody style={{overflowY: 'auto', maxHeight: 'calc(100vh - 200px)'}}>

                        <WhatsNewContent/>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.setState({open: false})}>Close</Button>
                    </ModalFooter>

                </Modal>
            </div>

        );
    }

}

interface IProps {

    /**
     * Called when we click the ok button.
     */
    accept?: () => void;

}

interface IState {
    open: boolean;
}
