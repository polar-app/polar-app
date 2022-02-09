import React from 'react';
import {Authenticator} from "./Authenticator";
import {MUIAppRoot} from "../../../../web/js/mui/MUIAppRoot";

export const CreateAccountScreen = React.memo(function CreateAccountScreen() {

    return (
        <MUIAppRoot useRedesign={false} darkMode={true}>
            <Authenticator mode='create-account'/>
        </MUIAppRoot>
    );
});
