import {Theme} from "@material-ui/core";

namespace ScrollbarColors {
    export function createCSSForReact(theme: Theme) {
        const isDark = theme.palette.type === 'dark';
        const isLight = theme.palette.type === 'light';

        // DEFINITIONS
        //
        // - The thumb is the main part of the scrollbar that is clicked and dragged by the user.

        // NOTES:
        //
        // - it SEEMS there must be at lease *some* content in
        //       ::-webkit-scrollbar
        //   when trying to debug in an HTML file.
        //
        // - if react re-renders, when the scrollbar is hidden, then what the
        //   scrollbar magically shows itself again
        //
        // - setting maxWidth or width does adjust the width properly but we
        //   lose the ability to auto-hide the scrollbars.
        //
        // - the thumb has padding or is centered inside the container
        //
        // - on first initialization, it always shows itself, then auto-hides,
        //   but only with our custom CSS

        return {
            '*::-webkit-scrollbar': {
                // width: '5px !important'
                // maxWidth: "2px !important"
            },
            '*::-webkit-scrollbar-track': {
                // '-webkit-box-shadow': 'inset 0 0 5px rgba(255, 255, 255, 0.3'
                ...(isDark &&
                    { backgroundColor: '#494949!important' }),

                ...(isLight &&
                    { backgroundColor: `${theme.palette.background.paper} !important` }),

            },
            '*::-webkit-scrollbar-thumb': {
                borderRadius: '0px !important',
                padding: "0px !important",
                margin: "0px !important",

                backgroundColor: `${theme.palette.grey['600']} !important`,
                border: 'solid 0px #494949!important',
                backgroundClip: 'content-box'

                // ...(isDark &&
                //     {
                //         backgroundColor: `${theme.palette.grey['600']} !important`,
                //         border: 'solid 0px #494949!important',
                //     }),
                //
                // ...(isLight &&
                //     {
                //         backgroundColor: `${theme.palette.grey['400']} !important`,
                //         border: `solid 0px ${theme.palette.background.paper} !important`,
                //     }),
            },
        };
    }

    export function createCSS(theme: Theme) {
        const isDark = theme.palette.type === 'dark';
        const isLight = theme.palette.type === 'light';

        return {
            '*::-webkit-scrollbar': {
                width: '12px !important'
            },
            '*::-webkit-scrollbar-track': {
                // '-webkit-box-shadow': 'inset 0 0 5px rgba(255, 255, 255, 0.3'
                ...(isDark &&
                    { 'background-color': '#494949 !important' }),

                ...(isLight &&
                    { 'background-color': `${theme.palette.background.paper}!important` }),
            },
            '*::-webkit-scrollbar-thumb': {
                'border-radius': '10px!important',
                ...(isDark &&
                    {
                        'background-color': `${theme.palette.grey['600']}!important`,
                        'border': 'solid 2px #494949!important',
                    }),

                ...(isLight &&
                    {
                        'background-color': `${theme.palette.grey['400']}!important`,
                        'border': `solid 2px ${theme.palette.background.paper}!important`,
                    }),
            },
        };
    }
}

export default ScrollbarColors;
