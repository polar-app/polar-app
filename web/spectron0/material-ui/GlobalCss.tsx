import withStyles from "@material-ui/core/styles/withStyles";

export const GlobalCss = withStyles({
    // @global is handled by jss-plugin-global.
    '@global': {
        // You should target [class*="MuiButton-root"] instead if you nest themes.
        '.MuiTooltip-root': {
            // fontSize: '1rem',
        },
    },
})(() => null);
