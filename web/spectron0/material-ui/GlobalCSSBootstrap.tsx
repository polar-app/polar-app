import withStyles from "@material-ui/core/styles/withStyles";
import {GlobalCssSummernoteStyles} from "./GlobalCssSummernote";

/**
 * Basic "gap box" for having easy / uniform margins between sub-components
 * just via a CSS property.
 */
const GlobalCSSBootstrapStyles = withStyles({
    // @global is handled by jss-plugin-global.
    '@global': {


        ".text-right": {
            textAlign: "right"
        },

        ".text-center": {
            textAlign: "center"
        }

    },
});

export const GlobalCSSBootstrap = GlobalCSSBootstrapStyles(() => null);
