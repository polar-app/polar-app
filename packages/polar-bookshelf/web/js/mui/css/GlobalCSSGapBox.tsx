import withStyles from "@material-ui/core/styles/withStyles";

/**
 * Basic "gap box" for having easy / uniform margins between sub-components
 * just via a CSS property.
 */
const GlobalCssGapBoxStyles = withStyles({
    // @global is handled by jss-plugin-global.
    '@global': {

        ".gap-box > *": {
            marginLeft: '5px'
        },

        ".gap-box > *:first-child": {
            marginLeft: 0
        }

    },
});

export const GlobalCssGapBox = GlobalCssGapBoxStyles(() => null);
