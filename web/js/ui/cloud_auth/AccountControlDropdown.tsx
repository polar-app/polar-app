/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {UserInfo} from '../../apps/repository/auth_handler/AuthHandler';
import {AccountControl} from './AccountControl';
import {MUIPopper} from "../../mui/menu/MUIPopper";
import {AccountAvatar} from './AccountAvatar';


interface IProps {

    readonly userInfo: UserInfo;

    readonly onLogout: () => void;

}

export const AccountControlDropdown = React.memo((props: IProps) => (

    <MUIPopper id="account-control-button"
               icon={<AccountAvatar size="small"/>}
               placement="bottom-end"
               caret>

        <AccountControl userInfo={props.userInfo}
                        onLogout={props.onLogout}/>

    </MUIPopper>

));
