import * as React from 'react';
import {Button, InputGroupAddon} from 'reactstrap';
import {Optional} from '../../../util/ts/Optional';

export class CaptureButton extends React.Component<Props, any> {

    constructor(props: Props, context: any) {
        super(props, context);
        this.onTriggerCapture = this.onTriggerCapture.bind(this);
    }

    public render() {

        // FIXME: auto-disable it...
        return (

            <InputGroupAddon addonType="append">
                <Button type="button"
                        className="btn btn-outline-secondary"
                        title="Capture the HTML page and save locally"
                        aria-label=""
                        onClick={this.onTriggerCapture}
                        >

                    <span className="fa fa-cloud-download fa-lg" aria-hidden="true"></span>

                </Button>

            </InputGroupAddon>

        );
    }

    private onTriggerCapture() {
        Optional.of(this.props.onTriggerCapture).map(callback => callback());
    }


}

interface Props {

    onTriggerCapture?: () => void;

}
