import React from 'react';
import {Authenticator} from "./Authenticator";

export const SignInScreen = React.memo(function SignInScreen() {

    return (
        <Authenticator mode='sign-in'/>
    );
});
