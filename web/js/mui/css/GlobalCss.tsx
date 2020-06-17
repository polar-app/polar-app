import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import useTheme from "@material-ui/core/styles/useTheme";
import {GlobalCssGapBox} from "./GlobalCSSGapBox";
import blue from '@material-ui/core/colors/blue';

export const GlobalCssDarkStyles = withStyles(() => {

    const theme = useTheme();

    return {
        // @global is handled by jss-plugin-global.
        '@global': {

            // You should target [class*="MuiButton-root"] instead if you nest themes.
            '.MuiTooltip-root': {
                // fontSize: '1rem',
            },

            // ******* scrollbars

            '*::-webkit-scrollbar': {
                width: '12px'
            },
            '*::-webkit-scrollbar-track': {
                // '-webkit-box-shadow': 'inset 0 0 5px rgba(255, 255, 255, 0.3'
                // color: 'rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgb(73, 73, 73)'

            },
            '*::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgb(111, 111, 111)',
                // outline: '1px solid slategrey'
                borderRadius: '10px',
                border: 'solid 2px rgb(73, 73, 73)'

            },

            // **** CSS link colors

            // oddly, CSS link colors in MUI were not highlighted ...
            "a:link": {
                color: blue[300],
            },
            "a:visited": {
                color: blue[600],
            },
            "a:hover": {
                color: blue[400],
            },
            "a:active": {
                color: blue[500],
            },

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

