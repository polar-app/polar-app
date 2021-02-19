import React from 'react';
import {Authenticator} from "./Authenticator";

export const SignInScreen = React.memo(() => {

    return (
        <Authenticator mode='sign-in'/>
    );
});
