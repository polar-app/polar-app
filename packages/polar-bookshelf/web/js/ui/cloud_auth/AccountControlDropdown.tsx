/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {UserInfo} from '../../apps/repository/auth_handler/AuthHandler';
import {AccountControl} from './AccountControl';
import {MUIPopper} from "../../mui/menu/MUIPopper";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';


interface IProps {

    readonly userInfo: UserInfo;

    readonly onLogout: () => void;

}

export function AccountControlDropdown(props: IProps) {

    return (

        <div>

            <MUIPopper id="account-control-button"
                       icon={<AccountCircleIcon/>}
                       placement="bottom-end"
                       caret>

                <AccountControl userInfo={props.userInfo}
                                onLogout={props.onLogout}/>

            </MUIPopper>

        </div>

    );

}
