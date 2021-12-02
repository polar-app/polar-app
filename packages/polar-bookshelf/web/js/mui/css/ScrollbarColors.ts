import {Theme} from "@material-ui/core";
import {Devices} from "polar-shared/src/util/Devices";

namespace ScrollbarColors {

    function createCSSForReactDesktop(theme: Theme) {
        const isDark = theme.palette.type === 'dark';
        const isLight = theme.palette.type === 'light';

        // https://css-tricks.com/almanac/properties/s/scrollbar-color/
        // https://stackoverflow.com/questions/65940522/how-do-i-switch-to-chromes-dark-scrollbar-like-github-does

        return {
            '*::-webkit-scrollbar': {
                width: '12px !important'
            },
            '*::-webkit-scrollbar-track': {
                // '-webkit-box-shadow': 'inset 0 0 5px rgba(255, 255, 255, 0.3'
                ...(isDark &&
                    { backgroundColor: '#494949 !important' }),

                ...(isLight &&
                    { backgroundColor: `${theme.palette.background.paper} !important` }),
            },
            '*::-webkit-scrollbar-thumb': {
                borderRadius: '10px!important',
                ...(isDark &&
                    {
                        backgroundColor: `${theme.palette.grey['600']} !important`,
                        border: 'solid 2px #494949 !important',
                    }),

                ...(isLight &&
                    {
                        backgroundColor: `${theme.palette.grey['400']} !important`,
                        border: `solid 2px ${theme.palette.background.paper} !important`,
                    }),
            },
            ':root': {
                colorScheme: theme.palette.type,
                scrollbarColor: theme.palette.type
            }
        };
    }

    function createCSSForReactMobile(theme: Theme) {

        // https://css-tricks.com/almanac/properties/s/scrollbar-color/
        // https://stackoverflow.com/questions/65940522/how-do-i-switch-to-chromes-dark-scrollbar-like-github-does

        return {
            ':root': {
                colorScheme: theme.palette.type,
                scrollbarColor: theme.palette.type
            }
        };

    }

    export function createCSSForReact(theme: Theme) {

        if (Devices.isDesktop()) {
            return createCSSForReactDesktop(theme);
        }

        return createCSSForReactMobile(theme);

    }

    function createCSSForDesktop(theme: Theme) {
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
            ':root': {
                "color-scheme": theme.palette.type,
                "scrollbar-color": theme.palette.type
            }
        };
    }

    function createCSSForMobile(theme: Theme) {

        return {
            ':root': {
                "color-scheme": theme.palette.type,
                "scrollbar-color": theme.palette.type
            }
        };
    }

    export function createCSS(theme: Theme) {

        if (Devices.isDesktop()) {
            return createCSSForDesktop(theme);
        }

        return createCSSForMobile(theme);

    }

}

export default ScrollbarColors;
