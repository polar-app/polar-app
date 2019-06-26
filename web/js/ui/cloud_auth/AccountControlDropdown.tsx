/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Logger} from '../../logger/Logger';
import {UserInfo} from '../../../../web/js/apps/repository/auth_handler/AuthHandler';
import Button from 'reactstrap/lib/Button';
import Popover from 'reactstrap/lib/Popover';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import {DropdownToggle, UncontrolledPopover} from 'reactstrap';
import {IStyleMap} from '../../react/IStyleMap';
import {NULL_FUNCTION} from '../../util/Functions';
import {AccountControlBar} from './AccountControlBar';
import {AppRuntime} from '../../AppRuntime';
import {DropdownChevron} from '../util/DropdownChevron';

export class AccountControlDropdown extends React.PureComponent<IProps, IState> {



    constructor(props: IProps) {
        super(props);


    }

    public render() {

        return (

            <div>

                <Button color="light"
                        id="account-control-button"
                        size="sm"
                        onClick={() => NULL_FUNCTION}

                        className="header-filter-clickable p-1 pl-2 pr-2 border">

                    <i className="fas fa-cloud-upload-alt" style={{marginRight: '5px'}}></i>

                    {/*<span className="d-none-mobile">*/}
                    {/*    {AppRuntime.isBrowser() ? 'Account' : 'Cloud Sync'}*/}
                    {/*</span>*/}

                    <DropdownChevron/>

                </Button>

                <UncontrolledPopover trigger="legacy"
                                     placement="bottom"
                                     target="account-control-button"
                                     delay={{show: 0, hide: 0}}
                                     style={{maxWidth: '600px'}}>

                    <PopoverBody className="shadow">
                        <AccountControlBar userInfo={this.props.userInfo}
                                           onInvite={this.props.onInvite}
                                           onLogout={this.props.onLogout}/>

                    </PopoverBody>

                </UncontrolledPopover>

            </div>

        );

    }

}

interface IProps {

    readonly userInfo: UserInfo;

    readonly onInvite: () => void;

    readonly onLogout: () => void;

}

interface IState {
}
