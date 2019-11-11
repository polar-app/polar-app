import * as React from 'react';
import {TrackedDropdownItem} from './TrackedDropdownItem';
import {FeatureToggles} from "../../../../web/js/ui/FeatureToggles";

const ICON_ON = "fas fa-check text-primary";
const ICON_OFF = "fas fa-minus";

export class SettingsFeatureToggleDropdown extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const marked = FeatureToggles.isEnabled(this.props.name);

        const icon: string = marked ? ICON_ON : ICON_OFF

        return (

            <TrackedDropdownItem trackingCategory='settings-dropdown-click'
                                 id={'setting-' + this.props.name}
                                 title={this.props.title}
                                 tooltip={this.props.tooltip}
                                 icon={icon}
                                 hidden={false}
                                 onClick={() => FeatureToggles.toggle(this.props.name)}/>

        );

    }

    private onClick() {
    }

}

interface IProps {

    // the setting name
    readonly name: string;

    readonly title: string;

    readonly tooltip: string;

    readonly hidden?: boolean;

}

interface IState {

}
