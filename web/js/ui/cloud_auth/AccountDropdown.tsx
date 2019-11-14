/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {SimpleTooltip} from '../tooltip/SimpleTooltip';
import {SimpleTooltipEx} from '../tooltip/SimpleTooltipEx';

const log = Logger.create();

export class AccountDropdown extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {

        return (
            <div>

                <UncontrolledDropdown id="cloud-sync-dropdown"
                                      direction="down"
                                      size="md">

                    <DropdownToggle color="primary" caret>
                        <i className="fas fa-user" style={{marginRight: '5px'}}/>

                        Cloud Sync
                    </DropdownToggle>
                    <DropdownMenu className="shadow" right>

                        <SimpleTooltipEx placement="left"
                                         show={0}
                                         text={`Invite users to Polar. If they
                                                sign up and use cloud sync we
                                                will give you a free month of
                                                cloud sync.`}>

                            <DropdownItem id="cloud-sync-invite-users"
                                          size="md"
                                          onClick={() => this.props.onInvite()}>

                                <i className="fas fa-user-plus mr-1"/>

                                Invite Users

                            </DropdownItem>

                        </SimpleTooltipEx>

                        <DropdownItem divider />

                        <SimpleTooltipEx placement="left"
                                         show={0}
                                         text={`Logout of cloud sync. Your data
                                                will no longer be synchronized
                                                between your devices.`}>

                            <DropdownItem id="cloud-sync-logout"
                                          size="md"
                                          onClick={() => this.props.onLogout()}
                                          className="text-danger">

                                <i className="fas fa-sign-out-alt mr-1"/>

                                Logout

                            </DropdownItem>

                        </SimpleTooltipEx>

                    </DropdownMenu>
                </UncontrolledDropdown>

            </div>
        );

    }

}

interface IProps {
    readonly onInvite: () => void;
    readonly onLogout: () => void;
}

interface IState {
}
