import * as React from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

/**
 * Modal that is large and fits nearly the full screen. Must use this with a
 * LargeModalBody.
 */
export class LargeModal extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        // noinspection TsLint
        return (
            <Modal isOpen={this.props.isOpen}
                   size="lg"
                   fade={false}
                   style={{overflowY: 'initial', minWidth: '90%'}}>

                {this.props.children}

            </Modal>
        );
    }

}

interface IProps {

    isOpen: boolean;

}

interface IState {

}
