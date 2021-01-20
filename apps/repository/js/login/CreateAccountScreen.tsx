import React from 'react';
import {Authenticator} from "./Authenticator";

export const CreateAccountScreen = React.memo(() => {

    return (
        <Authenticator mode='create-account'/>
    );
});
