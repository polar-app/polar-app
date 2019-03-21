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

const log = Logger.create();

const Styles: IStyleMap = {

    dropdownChevron: {

        display: 'inline-block',
        width: 0,
        height: 0,
        marginLeft: '.255em',
        verticalAlign: '.255em',
        borderTop: '.3em solid',
        borderRight: '.3em solid transparent',
        borderBottom: 0,
        borderLeft: '.3em solid transparent',
        color: 'var(--secondary)'

    }

};

export class AccountControlDropdown extends React.PureComponent<IProps, IState> {



    constructor(props: IProps) {
        super(props);


    }

    public render() {

        return (

            <div>

                <Button color="primary"
                        id="account-control-button"
                        size="sm"
                        onClick={() => NULL_FUNCTION}

                        className="header-filter-clickable p-1 pl-2 pr-2 border">

                    <i className="fas fa-cloud-upload-alt" style={{marginRight: '5px'}}></i>

                    <span className="d-none-mobile">
                        {AppRuntime.isBrowser() ? 'Account' : 'Cloud Sync'}
                    </span>

                    <div className="text-white" style={Styles.dropdownChevron}></div>

                </Button>

                <UncontrolledPopover trigger="legacy"
                                     placement="bottom"
                                     target="account-control-button"
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
