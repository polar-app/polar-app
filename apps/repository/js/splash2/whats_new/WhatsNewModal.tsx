import * as React from 'react';
import {WhatsNewContent} from './WhatsNewContent';
import Button from 'reactstrap/lib/Button';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import {LargeModal} from '../../../../../web/js/ui/large_modal/LargeModal';
import {LargeModalBody} from '../../../../../web/js/ui/large_modal/LargeModalBody';
import {WhatsNew} from './WhatsNew';
import {Logger} from '../../../../../web/js/logger/Logger';

const log = Logger.create();

export class WhatsNewModal extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onDone = this.onDone.bind(this);

        this.state = {
            open: WhatsNew.doShow()
        };

        if (this.state.open) {
            log.debug("Showing what's new modal.");
            WhatsNew.markShown();
        }

    }

    public render() {

        return (

            <div>

                <LargeModal isOpen={this.state.open}>

                    <LargeModalBody>

                        <WhatsNewContent/>

                    </LargeModalBody>

                    <ModalFooter>
                        <Button color="primary" onClick={() => this.onDone()}>Close</Button>
                    </ModalFooter>

                </LargeModal>


            </div>

        );
    }

    private onDone() {

        this.setState({open: false});

        if (this.props.onDone) {
            this.props.onDone();
        }

    }

}

interface IProps {

    /**
     * Called when we click the ok button.
     */
    onDone?: () => void;

}

interface IState {
    open: boolean;
}
