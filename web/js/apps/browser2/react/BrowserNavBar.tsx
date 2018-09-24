import * as React from 'react';
import {Button, InputGroup, InputGroupAddon} from 'reactstrap';
import Navbar from 'reactstrap/lib/Navbar';
import {BrowserConfigurationInputGroup} from './BrowserConfigurationInputGroup';
import {CaptureButton} from './CaptureButton';
import {URLBar} from './URLBar';

export class BrowserNavBar extends React.Component<Props, State> {

    constructor(props: Props, context: State) {
        super(props, context);
    }

    public render() {
        return (

            <div>

                <Navbar light expand="md" className="p-2 border-bottom link-navbar">

                    <InputGroup size="sm" className="">

                        <InputGroupAddon addonType="prepend"
                                         title="Refresh the current page">

                            <Button type="button"
                                    className="btn btn-outline-secondary"
                                    aria-label="">

                                <span className="fa fa-refresh fa-lg" aria-hidden="true"></span>

                            </Button>

                        </InputGroupAddon>

                        <URLBar onLoadURL={this.props.onLoadURL}/>

                        <CaptureButton onTriggerCapture={this.props.onTriggerCapture}/>

                        <BrowserConfigurationInputGroup onBrowserChanged={this.props.onBrowserChanged} />

                    </InputGroup>

                </Navbar>

            </div>
        );
    }

}

interface State {

}

interface Props {

    /**
     * Called when need to load a URL that the navbar selected.
     */
    onLoadURL?: (url: string) => void;
    onTriggerCapture?: () => void;
    onBrowserChanged?: (browserName: string) => void;

}
