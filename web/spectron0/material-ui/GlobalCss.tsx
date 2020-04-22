import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import useTheme from "@material-ui/core/styles/useTheme";

// export const GlobalCss = withStyles({
//     // @global is handled by jss-plugin-global.
//     '@global': {
//         // You should target [class*="MuiButton-root"] instead if you nest themes.
//         '.MuiTooltip-root': {
//             // fontSize: '1rem',
//         },
//         '*::-webkit-scrollbar': {
//             width: '1.0rem'
//         },
//         '*::-webkit-scrollbar-track': {
//             '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
//         },
//         '*::-webkit-scrollbar-thumb': {
//             backgroundColor: 'rgba(0,0,0,.1)',
//             outline: '1px solid slategrey'
//         }
//     },
// })(() => null);

export const GlobalCssStyles = withStyles({
    // @global is handled by jss-plugin-global.
    '@global': {
        // You should target [class*="MuiButton-root"] instead if you nest themes.
        '.MuiTooltip-root': {
            // fontSize: '1rem',
        },
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

        }

    },
});

export const GlobalCssDark = GlobalCssStyles(() => null);


export const GlobalCss = () => {

    const theme = useTheme();

    if (theme.palette.type === 'dark') {
        return <GlobalCssDark/>;
    }

    return null;

};

