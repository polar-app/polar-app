import React from 'react';
import {Authenticator} from "./Authenticator";
import {MUIAppRoot} from "../../../../web/js/mui/MUIAppRoot";

export const SignInScreen = React.memo(function SignInScreen() {

    return (
        <MUIAppRoot useRedesign={false} darkMode={true}>
            <Authenticator mode='sign-in'/>
        </MUIAppRoot>
    );
});
