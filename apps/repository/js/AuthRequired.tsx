import * as React from 'react';
import {AuthHandlers} from "../../../web/js/apps/repository/auth_handler/AuthHandler";
import {useUserInfoContext} from "../../../web/js/apps/repository/auth_handler/UserInfoProvider";

interface IProps {
    readonly children: React.ReactElement;
}

export const AuthRequired = React.memo((props: IProps) => {

    const userInfoContext = useUserInfoContext();

    if (! userInfoContext) {
        // we do not yet have userInfo so we can't do anything including
        // returning children.
        console.warn("No userInfoContext");
        return null;
    }

    if (! userInfoContext.userInfo) {

        // we have user info but the user isn't logged in.
        console.warn("No userInfo: forcing authentication");

        const authHandler = AuthHandlers.get();
        authHandler.authenticate();
        return null;

    }

    // we're logged in so ready go to.
    return props.children;

});
