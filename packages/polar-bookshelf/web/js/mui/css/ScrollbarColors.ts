import {Theme} from "@material-ui/core";

namespace ScrollbarColors {

    export function createCSSForReact(theme: Theme) {

        // https://css-tricks.com/almanac/properties/s/scrollbar-color/
        // https://stackoverflow.com/questions/65940522/how-do-i-switch-to-chromes-dark-scrollbar-like-github-does

        return {
            ':root': {
                colorScheme: theme.palette.type,
                scrollbarColor: theme.palette.type
            }
        };
    }

    export function createCSS(theme: Theme) {

        return {
            ':root': {
                "color-scheme": theme.palette.type,
                "scrollbar-color": theme.palette.type
            }
        };
    }
}

export default ScrollbarColors;
