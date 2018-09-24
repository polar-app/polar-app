import * as React from 'react';
import {Button, InputGroup, InputGroupAddon} from 'reactstrap';
import Navbar from 'reactstrap/lib/Navbar';
import {BrowserConfigurationInputGroup} from './BrowserConfigurationInputGroup';
import {CaptureButton} from './CaptureButton';
import {URLBar} from './URLBar';
import {ISimpleReactor} from '../../../reactor/SimpleReactor';
import {NavigationEventType} from '../BrowserApp';
import {RefreshButton} from './RefreshButton';

export class BrowserNavBar extends React.Component<Props, State> {

    constructor(props: Props, context: State) {
        super(props, context);
    }

    public render() {
        return (

            <div>

                <Navbar light expand="md" className="p-2 border-bottom link-navbar">

                    <InputGroup size="sm" className="">

                        <RefreshButton navigationReactor={this.props.navigationReactor} onReload={this.props.onReload}/>

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
    navigationReactor: ISimpleReactor<NavigationEventType>;

    /**
     * Called when the reload button was clicked.
     */
    onReload: () => void;

}
