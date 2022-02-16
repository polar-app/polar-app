import React from 'react';
import {useUserInfoContext} from "../../../../../web/js/apps/repository/auth_handler/UserInfoProvider";

interface IProps {
    readonly ver: 'v2';
    readonly children: JSX.Element;
}

export const WhenAccountLevel = (props: IProps) => {

    const userInfoContext = useUserInfoContext();
    const actualVer = React.useMemo(() => (userInfoContext?.userInfo?.ver || 'v0'), [userInfoContext]);

    if (props.ver > actualVer) {
        return null;
    }

    return props.children;

}
