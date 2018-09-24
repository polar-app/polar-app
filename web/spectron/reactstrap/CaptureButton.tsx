import * as React from 'react';
import {Button, InputGroupAddon} from 'reactstrap';

export class CaptureButton extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {
        return (

            <InputGroupAddon addonType="append">

                <Button type="button"
                        className="btn btn-outline-secondary"
                        title="Capture the HTML page and save locally"
                        aria-label=""
                        disabled>

                    <span className="fa fa-cloud-download fa-lg" aria-hidden="true"></span>

                </Button>

            </InputGroupAddon>

        );
    }

}
