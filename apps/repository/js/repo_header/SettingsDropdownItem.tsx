import * as React from 'react';
import {TrackedDropdownItem} from './TrackedDropdownItem';
import {LocalPrefs} from '../../../../web/js/ui/util/LocalPrefs';

const ICON_ON = "fas fa-check text-primary";
const ICON_OFF = "fas fa-minus";

/**
 */
export class SettingsDropdownItem extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const marked = LocalPrefs.isMarked(this.props.name, this.props.defaultValue);

        const icon = marked ? ICON_ON : ICON_OFF;

        return (

            <TrackedDropdownItem trackingCategory='settings-dropdown-click'
                                 id={'setting-' + this.props.name}
                                 title={this.props.title}
                                 tooltip={this.props.tooltip}
                                 icon={icon}
                                 onClick={() => this.onClick()}/>

        );

    }

    private onClick() {
        LocalPrefs.toggle(this.props.name);
    }

}

interface IProps {

    // the setting name
    readonly name: string;

    readonly defaultValue: boolean;

    readonly title: string;
    readonly tooltip: string;
    readonly hidden?: boolean;


}

interface IState {

}
