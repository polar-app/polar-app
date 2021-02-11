import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import {DeviceRouter} from "../../ui/DeviceRouter";

export const GlobalCssMobileRootStyles = withStyles({
    // @global is handled by jss-plugin-global.
    '@global': {
        'html, body': {
            fontSize: '16px',
        },
    },
});

export const GlobalCssMobileRoot = GlobalCssMobileRootStyles(() => null);

export const GlobalCssMobile = () => {

    return (
        <DeviceRouter phone={<GlobalCssMobileRoot/>}
                      tablet={<GlobalCssMobileRoot/>}/>
    );

};

