import * as React from 'react';
import {Modal} from 'reactstrap';
import {NULL_FUNCTION} from '../../util/Functions';

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
                   toggle={this.props.toggle ? this.props.toggle : NULL_FUNCTION}
                   style={{overflowY: 'initial', minWidth: '90%'}}>

                {this.props.children}

            </Modal>
        );
    }

}

interface IProps {

    isOpen: boolean;
    toggle?: () => void;

}

interface IState {

}
