import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import useTheme from "@material-ui/core/styles/useTheme";
import {GlobalCssGapBox} from "./GlobalCSSGapBox";
import {DarkModeScrollbars} from "./DarkModeScrollbars";

export const GlobalCssDarkStyles = withStyles(() => {

    const theme = useTheme();

    const darkModeScrollbars = DarkModeScrollbars.createCSSForReact();

    return {
        // @global is handled by jss-plugin-global.
        '@global': {

            // ******* scrollbars
            ...darkModeScrollbars,

            // You should target [class*="MuiButton-root"] instead if you nest themes.
            '.MuiTooltip-root': {
                // fontSize: '1rem',
            },

            // **** CSS link colors

            // oddly, CSS link colors in MUI were not highlighted ...
            // "a:link": {
            //     color: blue[300],
            // },
            // "a:visited": {
            //     color: blue[600],
            // },
            // "a:hover": {
            //     color: blue[400],
            // },
            // "a:active": {
            //     color: blue[500],
            // },

        },
    }
});

export const GlobalCssDark = GlobalCssDarkStyles(() => null);

export const GlobalCss = () => {

    const theme = useTheme();

    return (
        <>
            {theme.palette.type === 'dark' &&
                <GlobalCssDark/>}

            <GlobalCssGapBox/>

        </>
    );

};

