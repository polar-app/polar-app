import * as React from 'react';
import {Button, InputGroupAddon} from 'reactstrap';
import {Optional} from '../../../util/ts/Optional';

export class CaptureButton extends React.Component<Props, any> {

    constructor(props: Props, context: any) {
        super(props, context);
        this.onTriggerCapture = this.onTriggerCapture.bind(this);
    }

    public render() {

        // FIXME: keep it disabled until we have actually started the capture.
        return (

            <InputGroupAddon addonType="append">
                <Button type="button"
                        className="btn btn-outline-secondary"
                        title="Capture the HTML page and save locally"
                        aria-label=""
                        disabled={this.props.disabled}
                        // disabled
                        onClick={this.onTriggerCapture}>

                    <span className="fas fa-cloud-download-alt fa-lg" aria-hidden="true"></span>

                </Button>

            </InputGroupAddon>

        );
    }

    private onTriggerCapture() {
        Optional.of(this.props.onTriggerCapture).map(callback => callback());
    }


}

interface Props {

    disabled?: boolean;
    onTriggerCapture?: () => void;

}
