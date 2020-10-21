import React from "react";
import {UserAvatar} from "./UserAvatar";
import {useUserInfoContext} from "../../apps/repository/auth_handler/UserInfoProvider";

interface IProps {
    readonly size?: 'large' | 'medium' | 'small';
    readonly style?: React.CSSProperties;
}

export const AccountAvatar = React.memo((props: IProps) => {

    const userInfoContext = useUserInfoContext();

    if (! userInfoContext) {
        return null;
    }

    if (! userInfoContext.userInfo) {
        return null;
    }

    const {userInfo} = userInfoContext;

    return (
        <UserAvatar size={props.size}
                    displayName={userInfo.displayName}
                    style={props.style}
                    photoURL={userInfo.photoURL}/>
    );

});
