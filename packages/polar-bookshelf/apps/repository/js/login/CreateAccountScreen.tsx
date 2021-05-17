import React from 'react';
import {Authenticator} from "./Authenticator";

export const CreateAccountScreen = React.memo(function CreateAccountScreen() {

    return (
        <Authenticator mode='create-account'/>
    );
});
