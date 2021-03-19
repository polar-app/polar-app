import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import useTheme from "@material-ui/core/styles/useTheme";
import {GlobalCssGapBox} from "./GlobalCSSGapBox";
import ScrollbarColors from "./ScrollbarColors";

export const GlobalCssDarkStyles = withStyles(() => {
    const theme = useTheme();

    return {
        // @global is handled by jss-plugin-global.
        '@global': {
            // You should target [class*="MuiButton-root"] instead if you nest themes.

            '.MuiTooltip-tooltip': {
                fontSize: '1.1rem',
                backgroundColor: theme.palette.background.default
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


export const GlobalCssOverflowStyles = withStyles(() => {

    return {
        // @global is handled by jss-plugin-global.
        '@global': {

            'html, body': {
                overflow: 'hidden'
            },

        },
    }
});


export const GlobalCssScrollbarStyles = withStyles(() => {
    const theme = useTheme();

    const scrollbars = ScrollbarColors.createCSSForReact(theme);

    return {
        '@global': {
            ...scrollbars
        },
    };
});

export const GlobalCssDark = GlobalCssDarkStyles(() => null);
export const GlobalCssOverflow = GlobalCssOverflowStyles(() => null);
export const GlobalCssScrollbar = GlobalCssScrollbarStyles(() => null);

export const GlobalCss = () => {

    const theme = useTheme();

    return (
        <>
            {theme.palette.type === 'dark' &&
                <GlobalCssDark/>}

            <GlobalCssScrollbar/>
            <GlobalCssOverflow/>
            <GlobalCssGapBox/>

        </>
    );

};

