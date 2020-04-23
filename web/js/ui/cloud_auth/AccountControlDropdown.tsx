/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {UserInfo} from '../../../../web/js/apps/repository/auth_handler/AuthHandler';
import {AccountControl} from './AccountControl';
import {MUIPopper} from "../../../spectron0/material-ui/dropdown_menu/MUIPopper";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {UserAvatar} from "./UserAvatar";

export class AccountControlDropdown extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {

        return (

            <div>

                <MUIPopper id="account-control-button"
                           // icon={<UserAvatar photoURL={this.props.userInfo.photoURL}
                           //                   displayName={this.props.userInfo.displayName}/>}
                           icon={<AccountCircleIcon/>}
                           placement="bottom-end"
                           caret>

                    <AccountControl userInfo={this.props.userInfo}
                                    onLogout={this.props.onLogout}/>

                </MUIPopper>

                {/*<Button color="clear"*/}
                {/*        id="account-control-button"*/}
                {/*        size="md"*/}
                {/*        onClick={() => NULL_FUNCTION}*/}
                {/*        style={{whiteSpace: 'nowrap'}}*/}
                {/*        className="header-filter-clickable pl-2 pr-2 border">*/}
                {/*    <i className="fas fa-user" style={{marginRight: '5px'}}/>*/}

                {/*    /!*<span className="d-none-mobile">*!/*/}
                {/*    /!*    {AppRuntime.isBrowser() ? 'Account' : 'Cloud Sync'}*!/*/}
                {/*    /!*</span>*!/*/}

                {/*    <DropdownChevron/>*/}

                {/*</Button>*/}

                {/*<UncontrolledPopover trigger="legacy"*/}
                {/*                     placement="bottom-end"*/}
                {/*                     target="account-control-button"*/}
                {/*                     delay={0}*/}
                {/*                     fade={false}*/}
                {/*                     style={{maxWidth: '600px'}}>*/}

                {/*    <PopoverBody className="shadow">*/}
                {/*        <AccountControl userInfo={this.props.userInfo}*/}
                {/*                        onLogout={this.props.onLogout}/>*/}

                {/*    </PopoverBody>*/}

                {/*</UncontrolledPopover>*/}

            </div>

        );

    }

}

interface IProps {

    readonly userInfo: UserInfo;

    readonly onLogout: () => void;

}

interface IState {
}
