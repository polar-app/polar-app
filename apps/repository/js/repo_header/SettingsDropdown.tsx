import * as React from 'react';
import {DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {SettingsDropdownItem} from './SettingsDropdownItem';
import {Prefs} from '../../../../web/js/util/prefs/Prefs';
import {SettingsFeatureToggleDropdown} from "./SettingsFeatureToggleDropdown";

/**
 * Deprecated MUI
 */
export class SettingsDropdown extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <UncontrolledDropdown className="ml-1"
                                  hidden={this.props.hidden}
                                  size="md"
                                  id="settings-dropdown">

                <DropdownToggle className="text-muted border"
                                color="clear"
                                caret>

                    <i className="fas fa-cog" style={{fontSize: '17px'}}/>

                </DropdownToggle>

                <DropdownMenu className="shadow" right>

                    <SettingsDropdownItem name="settings-auto-resume"
                                          defaultValue={true}
                                          prefs={this.props.prefs}
                                          title="Automatically Resume Reading Position"
                                          tooltip="Automatically resume the current reading position when opening documents."/>

                    <SettingsFeatureToggleDropdown name="groups"
                                                   title="Enable groups"
                                                   tooltip="Enable groups support for sharing documents with other Polar users"/>

                    <SettingsFeatureToggleDropdown name="dev"
                                                   title="Enable Dev"
                                                   tooltip="Enable Dev Tools"/>

                </DropdownMenu>

            </UncontrolledDropdown>
        );

    }


}

interface IProps {
    readonly prefs: () => Prefs | undefined;
    readonly hidden?: boolean;
}

interface IState {

}
