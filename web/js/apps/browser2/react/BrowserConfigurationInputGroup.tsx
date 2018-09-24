import React from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, InputGroupButtonDropdown} from 'reactstrap';

export class BrowserConfigurationInputGroup extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            open: false
        };
    }

    public render() {

        // TODO: go through all browser and show them in the UI...

        return (
            <InputGroupButtonDropdown
                title="Configure browser settings for capture"
                addonType="append"
                isOpen={this.state.open}
                toggle={this.toggle}>
                <DropdownToggle caret>
                     <span className="fa fa-chrome fa-lg" aria-hidden="true"></span>
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem header>Browser:</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem data-browser-name="MOBILE_GALAXY_S8">Mobile Galaxy S8 (412x846)</DropdownItem>
                </DropdownMenu>
            </InputGroupButtonDropdown>
        );
    }

    private toggle(): void {
        this.setState({
            open: !this.state.open
        });
    }

}

interface Props {
    onBrowserChanged?: (browserName: string) => void;
}

interface State {
    open: boolean;
}

