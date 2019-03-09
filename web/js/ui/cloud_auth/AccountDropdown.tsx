/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Logger} from '../../logger/Logger';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {SimpleTooltip} from '../tooltip/SimpleTooltip';

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
                                      size="sm">

                    <DropdownToggle color="primary" caret>
                        <i className="fas fa-cloud-upload-alt" style={{marginRight: '5px'}}></i>

                        Cloud Sync
                    </DropdownToggle>
                    <DropdownMenu className="shadow" right>

                        <DropdownItem id="cloud-sync-invite-users"
                                      size="sm"
                                      onClick={() => this.props.onInvite()}>

                            <i className="fas fa-user-plus mr-1"></i>

                            Invite Users

                            <SimpleTooltip target="cloud-sync-invite-users"
                                           show={0}
                                           placement="bottom">
                                Invite users to Polar. If they sign up and
                                use cloud sync we will give you a free month
                                of cloud sync.
                            </SimpleTooltip>

                        </DropdownItem>
                        <DropdownItem divider />

                        <DropdownItem id="cloud-sync-logout"
                                      size="sm"
                                      onClick={() => this.props.onLogout()}
                                      className="text-danger">

                            <i className="fas fa-sign-out-alt mr-1"></i>

                            Logout

                            <SimpleTooltip target="cloud-sync-logout"
                                           show={0}
                                           placement="bottom">

                                Logout of cloud sync. Your data will no
                                longer be synchronized between your devices.

                            </SimpleTooltip>

                        </DropdownItem>

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
