/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Logger} from '../../logger/Logger';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {SimpleTooltip} from '../tooltip/SimpleTooltip';
import {UserInfo} from '../../../../web/js/apps/repository/auth_handler/AuthHandler';
import Button from 'reactstrap/lib/Button';

const log = Logger.create();

export class AccountControlBar extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {

        const UserImage = () => {

            if (this.props.userInfo.photoURL) {
                return <img className="rounded border"
                            style={{
                                maxHeight: '100px'
                            }}
                            src={this.props.userInfo.photoURL}/>;
            } else {
                return <div/>;
            }

        };

        return (

            <div>

                <div style={{
                    display: 'flex',
                    verticalAlign: 'top'
                }}>

                    <div className="pl-0 p-0 pr-2">

                        <UserImage/>

                    </div>

                    <div className="p-1">

                        <div style={{fontWeight: 'bold'}}>
                            {this.props.userInfo.displayName || 'Anonymous'}
                        </div>

                        <div className="text-muted" style={{fontSize: "14px"}}>
                            {this.props.userInfo.email || ''}
                        </div>

                        <div style={{display: 'block', whiteSpace: 'nowrap'}} className="mt-2">

                            <Button id="cloud-sync-invite-users"
                                    color="primary"
                                    size="sm"
                                    onClick={() => this.props.onInvite()}>

                                <i className="fas fa-user-plus mr-1"></i>

                                Invite Users

                                {/*<SimpleTooltip target="cloud-sync-invite-users"*/}
                                               {/*show={0}*/}
                                               {/*placement="bottom">*/}
                                    {/*Invite users to Polar. If they sign up and*/}
                                    {/*use cloud sync we will give you a free month*/}
                                    {/*of cloud sync.*/}
                                {/*</SimpleTooltip>*/}

                            </Button>

                            <Button id="cloud-sync-logout"
                                    color="secondary"
                                    outline
                                    size="sm"
                                    onClick={() => this.props.onLogout()}
                                    className="ml-1">

                                <i className="fas fa-sign-out-alt mr-1"></i>

                                Logout

                                {/*<SimpleTooltip target="cloud-sync-logout"*/}
                                               {/*show={0}*/}
                                               {/*placement="left">*/}

                                    {/*Logout of Polar.*/}

                                {/*</SimpleTooltip>*/}

                            </Button>

                        </div>

                    </div>

                </div>

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
