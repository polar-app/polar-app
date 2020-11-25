import * as React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import useTheme from "@material-ui/core/styles/useTheme";

const CKEditor5GlobalCssStyles = withStyles(() => {
    const theme = useTheme();

    return {
        // @global is handled by jss-plugin-global.
        '@global': {

            ":root": {

                "--ck-border-radius": "4px",
            
                "--ck-font-size-base": "14px",
            
                /* Helper variables to avoid duplication in the colors. */
                "--ck-custom-background": theme.palette.background.default,
                "--ck-custom-foreground": "hsl(255, 3%, 18%)",
                "--ck-custom-border": "hsl(300, 1%, 22%)",
                "--ck-custom-white": "hsl(0, 0%, 100%)",
            
                /* -- Overrides generic colors. ------------------------------------------------------------- */
            
                "--ck-color-base-foreground": "var(--ck-custom-background)",
                "--ck-color-focus-border": "var(--ck-custom-background)",
                "--ck-color-text": "hsl(0, 0%, 98%)",
                "--ck-color-shadow-drop": "hsla(0, 0%, 0%, 0.2)",
                "--ck-color-shadow-inner": "hsla(0, 0%, 0%, 0.1)",
            
                /* -- Overrides the default .ck-button class colors. ---------------------------------------- */
            
                "--ck-color-button-default-background": "var(--ck-custom-background)",
                "--ck-color-button-default-hover-background": "hsl(270, 1%, 22%)",
                "--ck-color-button-default-active-background": "hsl(270, 2%, 20%)",
                "--ck-color-button-default-active-shadow": "hsl(270, 2%, 23%)",
                "--ck-color-button-default-disabled-background": "var(--ck-custom-background)",
            
                "--ck-color-button-on-background": "var(--ck-custom-foreground)",
                "--ck-color-button-on-hover-background": "hsl(255, 4%, 16%)",
                "--ck-color-button-on-active-background": "hsl(255, 4%, 14%)",
                "--ck-color-button-on-active-shadow": "hsl(240, 3%, 19%)",
                "--ck-color-button-on-disabled-background": "var(--ck-custom-foreground)",
            
                "--ck-color-button-action-background": "hsl(168, 76%, 42%)",
                "--ck-color-button-action-hover-background": "hsl(168, 76%, 38%)",
                "--ck-color-button-action-active-background": "hsl(168, 76%, 36%)",
                "--ck-color-button-action-active-shadow": "hsl(168, 75%, 34%)",
                "--ck-color-button-action-disabled-background": "hsl(168, 76%, 42%)",
                "--ck-color-button-action-text": "var(--ck-custom-white)",
            
                "--ck-color-button-save": "hsl(120, 100%, 46%)",
                "--ck-color-button-cancel": "hsl(15, 100%, 56%)",
            
                /* -- Overrides the default .ck-dropdown class colors. -------------------------------------- */
            
                "--ck-color-dropdown-panel-background": "var(--ck-custom-background)",
                "--ck-color-dropdown-panel-border": "var(--ck-custom-foreground)",
            
                /* -- Overrides the default .ck-splitbutton class colors. ----------------------------------- */
            
                "--ck-color-split-button-hover-background": "var(--ck-color-button-default-hover-background)",
                "--ck-color-split-button-hover-border": "var(--ck-custom-foreground)",
            
                /* -- Overrides the default .ck-input class colors. ----------------------------------------- */
            
                "--ck-color-input-background": "var(--ck-custom-foreground)",
                "--ck-color-input-border": "hsl(257, 3%, 43%)",
                "--ck-color-input-text": "hsl(0, 0%, 98%)",
                "--ck-color-input-disabled-background": "hsl(255, 4%, 21%)",
                "--ck-color-input-disabled-border": "hsl(250, 3%, 38%)",
                "--ck-color-input-disabled-text": "hsl(0, 0%, 46%)",
            
                /* -- Overrides the default .ck-list class colors. ------------------------------------------ */
            
                "--ck-color-list-background": "var(--ck-custom-background)",
                "--ck-color-list-button-hover-background": "var(--ck-color-base-foreground)",
                "--ck-color-list-button-on-background": "var(--ck-color-base-active)",
                "--ck-color-list-button-on-background-focus": "var(--ck-color-base-active-focus)",
                "--ck-color-list-button-on-text": "var(--ck-color-base-background)",
            
                /* -- Overrides the default .ck-balloon-panel class colors. --------------------------------- */
            
                "--ck-color-panel-background": "var(--ck-custom-background)",
                "--ck-color-panel-border": "var(--ck-custom-border)",
            
                /* -- Overrides the default .ck-toolbar class colors. --------------------------------------- */
            
                "--ck-color-toolbar-background": "var(--ck-custom-background)",
                "--ck-color-toolbar-border": "var(--ck-custom-border)",
            
                /* -- Overrides the default .ck-tooltip class colors. --------------------------------------- */
            
                "--ck-color-tooltip-background": "hsl(252, 7%, 14%)",
                "--ck-color-tooltip-text": "hsl(0, 0%, 93%)",
            
                /* -- Overrides the default colors used by the ckeditor5-image package. --------------------- */
            
                "--ck-color-image-caption-background": "hsl(0, 0%, 97%)",
                "--ck-color-image-caption-text": "hsl(0, 0%, 20%)",
            
                /* -- Overrides the default colors used by the ckeditor5-widget package. -------------------- */
            
                "--ck-color-widget-blurred-border": "hsl(0, 0%, 87%)",
                "--ck-color-widget-hover-border": "hsl(43, 100%, 68%)",
                "--ck-color-widget-editable-focus-background": "var(--ck-custom-white)",
            
                /* -- Overrides the default colors used by the ckeditor5-link package. ---------------------- */
            
                "--ck-color-link-default": "hsl(190, 100%, 75%)",

            },

            ".ck-content": {
                // TODO needed in light mode too.
                boxShadow: "none !important",
                borderColor: `${theme.palette.background.default} !important`,
                backgroundColor: `${theme.palette.background.default} !important`,
                color: `${theme.palette.text.primary} !important`,
                "> *": {
                    backgroundColor: `${theme.palette.background.default} !important`,
                    color: `${theme.palette.text.primary} !important`,
                }
            },

            // force tables to not be centered
            ".ck-content .table": {
                margin: '1em 1em'
            },
            // force images to not be centered
            ".ck-content .image": {
                margin: '1em 1em'
            },

        }

    };
});

const CKEditor5GlobalCssDark = CKEditor5GlobalCssStyles(() => null);

export const CKEditor5GlobalCss = () => {

    const theme = useTheme();

    if (theme.palette.type === 'dark') {
        return <CKEditor5GlobalCssDark/>;
    }

    return null;

};

