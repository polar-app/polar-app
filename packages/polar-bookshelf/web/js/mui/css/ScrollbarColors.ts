import { Theme } from "@material-ui/core";

namespace ScrollbarColors {
    export function createCSSForReact(theme: Theme) {
        const isDark = theme.palette.type === 'dark';
        const isLight = theme.palette.type === 'light';

        return {
            '*::-webkit-scrollbar': {
                width: '12px'
            },
            '*::-webkit-scrollbar-track': {
                // '-webkit-box-shadow': 'inset 0 0 5px rgba(255, 255, 255, 0.3'
                ...(isDark && 
                    { backgroundColor: '#494949' }),

                ...(isLight && 
                    { backgroundColor: theme.palette.background.paper }),
            },
            '*::-webkit-scrollbar-thumb': {
                borderRadius: '10px',
                ...(isDark && 
                    {
                        backgroundColor: theme.palette.grey['600'],
                        border: 'solid 2px #494949',
                    }),

                ...(isLight && 
                    {
                        backgroundColor: theme.palette.grey['400'],
                        border: `solid 2px ${theme.palette.background.paper}`,
                    }),
            },
        };
    }

    export function createCSS(theme: Theme) {
        const isDark = theme.palette.type === 'dark';
        const isLight = theme.palette.type === 'light';

        return {
            '*::-webkit-scrollbar': {
                width: '12px'
            },
            '*::-webkit-scrollbar-track': {
                // '-webkit-box-shadow': 'inset 0 0 5px rgba(255, 255, 255, 0.3'
                ...(isDark && 
                    { 'background-color': '#494949' }),

                ...(isLight && 
                    { 'background-color': theme.palette.background.paper }),
            },
            '*::-webkit-scrollbar-thumb': {
                'border-radius': '10px',
                ...(isDark && 
                    {
                        'background-color': theme.palette.grey['600'],
                        'border': 'solid 2px #494949',
                    }),

                ...(isLight && 
                    {
                        'background-color': theme.palette.grey['400'],
                        'border': `solid 2px ${theme.palette.background.paper}`,
                    }),
            },
        };
    }
}

export default ScrollbarColors;