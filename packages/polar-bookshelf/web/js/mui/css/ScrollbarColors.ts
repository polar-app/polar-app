import {Theme} from "@material-ui/core";

namespace ScrollbarColors {
    export function createCSSForReact(theme: Theme) {
        const isDark = theme.palette.type === 'dark';
        const isLight = theme.palette.type === 'light';

        return {
            '*::-webkit-scrollbar': {
                width: '12px!important'
            },
            '*::-webkit-scrollbar-track': {
                // '-webkit-box-shadow': 'inset 0 0 5px rgba(255, 255, 255, 0.3'
                ...(isDark &&
                    { backgroundColor: '#494949!important' }),

                ...(isLight &&
                    { backgroundColor: `${theme.palette.background.paper}!important` }),
            },
            '*::-webkit-scrollbar-thumb': {
                borderRadius: '10px!important',
                ...(isDark &&
                    {
                        backgroundColor: `${theme.palette.grey['600']}!important`,
                        border: 'solid 2px #494949!important',
                    }),

                ...(isLight &&
                    {
                        backgroundColor: `${theme.palette.grey['400']}!important`,
                        border: `solid 2px ${theme.palette.background.paper}!important`,
                    }),
            },
        };
    }

    export function createCSS(theme: Theme) {
        const isDark = theme.palette.type === 'dark';
        const isLight = theme.palette.type === 'light';

        return {
            '*::-webkit-scrollbar': {
                width: '12px!important'
            },
            '*::-webkit-scrollbar-track': {
                // '-webkit-box-shadow': 'inset 0 0 5px rgba(255, 255, 255, 0.3'
                ...(isDark &&
                    { 'background-color': '#494949!important' }),

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
