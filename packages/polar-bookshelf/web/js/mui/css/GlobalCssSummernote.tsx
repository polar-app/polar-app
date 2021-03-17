import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import useTheme from "@material-ui/core/styles/useTheme";

export const GlobalCssSummernoteStyles = withStyles(() => {
    const theme = useTheme();

    return {
        // @global is handled by jss-plugin-global.
        '@global': {
            ".note-frame *": {
                color: theme.palette.text.primary
            },
            "kbd": {
                color: "rgb(255,0,0)",
                backgroundColor: "#000",
            },
            ".note-btn": {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.default,
                borderColor: theme.palette.background.default,
            },

            ".note-btn:active, .note-btn.active": {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.background.default,
            },

            ".note-btn:focus,.note-btn.focus": {
                color: theme.palette.text.primary,
                // backgroundColor: "#ebebeb",
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.background.default,
            },
            ".note-btn:hover": {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.background.default,
            },
            ".note-btn.disabled:focus,.note-btn[disabled]:focus,fieldset[disabled] .note-btn:focus,.note-btn.disabled.focus,.note-btn[disabled].focus,fieldset[disabled] .note-btn.focus": {
                backgroundColor: theme.palette.background.default,
                borderColor: theme.palette.background.default,
            },
            ".note-btn:hover,.note-btn:focus,.note-btn.focus": {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paper,
            },
            ".note-btn-primary": {
                color: "rgb(255,0,0)",
            },

            ".note-btn-primary:hover,.note-btn-primary:focus,.note-btn-primary.focus": {
                color: "rgb(255,0,0)",
                backgroundColor: "#fa6362",
            },


            ".close": {
                color: "#000",
            },
            ".note-dropdown-item:hover": {
                backgroundColor: theme.palette.background.paper,
            },
            "a.note-dropdown-item,a.note-dropdown-item:hover": {
                color: theme.palette.text.primary,
            },
            ".note-modal-footer a": {
                color: "#337ab7",
            },
            ".note-modal-footer a:hover,.note-modal-footer a:focus": {
                color: "#23527c",
            },

            ".note-modal-footer .note-btn": {
                color: theme.palette.text.primary + ' !important',
                backgroundColor: theme.palette.primary.main + ' !important'
            },

            ".note-modal-title": {
                color: "#42515f",
            },
            ".note-form-label": {
                color: "#42515f",
            },
            ".note-input::-webkit-input-placeholder": {
                color: theme.palette.text.primary,
            },
            ".note-input:-moz-placeholder": {
                color: theme.palette.text.primary,
            },
            ".note-input::-moz-placeholder": {
                color: theme.palette.text.primary,
            },
            ".note-input:-ms-input-placeholder": {
                color: theme.palette.text.primary,
            },
            ".note-tooltip.bottom .note-tooltip-arrow": {
                borderBottomColor: "#000",
            },
            ".note-tooltip.top .note-tooltip-arrow": {
                borderTopColor: "#000",
            },
            ".note-tooltip.right .note-tooltip-arrow": {
                borderRightColor: "#000",
            },
            ".note-tooltip.left .note-tooltip-arrow": {
                borderLeftColor: "#000",
            },
            ".note-tooltip-arrow": {
                borderColor: "transparent",
            },
            ".note-tooltip-content": {
                color: "rgb(255,0,0)",
                backgroundColor: "#000",
            },
            ".note-popover.bottom .note-popover-arrow": {
                borderBottomColor: "#999",
                // borderBottomColor: "rgba(0,0,0,0.25)",
            },
            ".note-popover.bottom .note-popover-arrow::after": {
                borderBottomColor: "rgb(255,0,0)",
            },
            ".note-popover.top .note-popover-arrow": {
                borderTopColor: "#999",
                // borderTopColor: "rgba(0,0,0,0.25)",
            },
            ".note-popover.top .note-popover-arrow::after": {
                borderTopColor: "rgb(255,0,0)",
            },
            ".note-popover.right .note-popover-arrow": {
                borderRightColor: "#999",
                // borderRightColor: "rgba(0,0,0,0.25)",
            },
            ".note-popover.right .note-popover-arrow::after": {
                borderRightColor: "rgb(255,0,0)",
            },
            ".note-popover.left .note-popover-arrow": {
                borderLeftColor: "#999",
                // borderLeftColor: "rgba(0,0,0,0.25)",
            },
            ".note-popover.left .note-popover-arrow::after": {
                borderLeftColor: "rgb(255,0,0)",
            },
            ".note-popover-arrow::after": {
                borderColor: "transparent",
            },
            ".note-popover-content": {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.default,
            },
            ".note-editor .note-dropzone": {
                color: "#87cefa",
                backgroundColor: theme.palette.background.default,
            },
            ".note-editor .note-dropzone.hover": {
                color: "#098ddf",
            },
            ".note-editor .note-editing-area .note-editable a": {
                color: "#337ab7",
                backgroundColor: "inherit",
            },
            ".note-editor .note-editing-area .note-editable a:hover,.note-editor .note-editing-area .note-editable a:focus": {
                color: "#23527c",
            },
            ".note-editor.note-frame .note-editing-area .note-editable": {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.default,
            },
            '.note-editor.note-frame .note-editing-area .note-editable[contenteditable="false"]': {
                // backgroundColor: "#e5e5e5",
                backgroundColor: theme.palette.background.paper,
            },
            ".note-editor.note-frame .note-editing-area .note-codable": {
                // color: "#ccc",
                // backgroundColor: "#222",
                color: theme.palette.text,
                backgroundColor: theme.palette.background.default,

            },
            ".note-editor.note-frame.fullscreen .note-editable": {
                backgroundColor: theme.palette.background.default,
            },
            ".note-editor.note-frame .note-status-output": {
                color: theme.palette.text.primary,
            },
            ".note-editor.note-frame .note-status-output .text-muted": {
                color: "#777",
            },
            ".note-editor.note-frame .note-status-output .text-primary": {
                color: "#286090",
            },
            ".note-editor.note-frame .note-status-output .text-success": {
                color: "#3c763d",
            },
            ".note-editor.note-frame .note-status-output .text-info": {
                color: "#31708f",
            },
            ".note-editor.note-frame .note-status-output .text-warning": {
                color: "#8a6d3b",
            },
            ".note-editor.note-frame .note-status-output .text-danger": {
                color: "#a94442",
            },
            ".note-editor.note-frame .note-status-output .alert": {
                color: theme.palette.text.primary,
                // backgroundColor: "#f5f5f5",
                backgroundColor: theme.palette.background.paper,
            },
            ".note-editor.note-frame .note-status-output .alert-success": {
                color: "#3c763d" + " !important",
                // backgroundColor: "#dff0d8" + " !important",
                backgroundColor: theme.palette.background.paper + " !important",

            },
            ".note-editor.note-frame .note-status-output .alert-info": {
                color: "#31708f" + " !important",
                // backgroundColor: "#d9edf7 " + " !important",
                backgroundColor: theme.palette.background.paper + " !important",
            },
            ".note-editor.note-frame .note-status-output .alert-warning": {
                color: "#8a6d3b " + " !important",
                // backgroundColor: "#fcf8e3" + " !important",
                backgroundColor: theme.palette.background.paper + " !important",
            },
            ".note-editor.note-frame .note-status-output .alert-danger": {
                color: "#a94442" + " !important",
                // backgroundColor: "#f2dede" + " !important",
                backgroundColor: theme.palette.background.paper + " !important",
            },
            ".note-editor.note-frame .note-statusbar": {
                backgroundColor: theme.palette.background.paper,

            },
            ".note-popover .note-popover-content,.note-toolbar": {
                backgroundColor: theme.palette.background.default,
            },

            ".note-modal-title, .note-modal-content *": {
                backgroundColor: theme.palette.background.paper + ' !important',
                color: theme.palette.text.primary + ' !important',
            },

            ".note-modal-footer": {
                paddingBottom: '5px'
            },

            ".note-dropdown-menu": {
                backgroundColor: theme.palette.background.default + ' !important',
                color: "deepskyblue",
            },

            ".note-popover .note-popover-content .note-color .note-dropdown-menu .note-palette .note-color-reset,.note-toolbar .note-color .note-dropdown-menu .note-palette .note-color-reset": {
                backgroundColor: theme.palette.background.default + ' !important',
            },
            ".note-popover .note-popover-content .note-dropdown-menu.note-check .note-dropdown-item i,.note-toolbar .note-dropdown-menu.note-check .note-dropdown-item i": {
                color: "deepskyblue",
            },
            ".note-modal .note-modal-body .help-list-item:hover": {
                backgroundColor: theme.palette.background.paper,
            },
            ".note-placeholder": {
                color: " gray",
            },
            ".note-handle .note-control-selection .note-control-selection-bg": {
                backgroundColor: "#000",
            },
            ".note-handle .note-control-selection .note-control-sizing": {
                backgroundColor: theme.palette.background.default,
            },
            ".note-handle .note-control-selection .note-control-selection-info": {
                color: "rgb(255,0,0)",
                backgroundColor: "#000",
            },
            ".note-hint-popover .note-popover-content .note-hint-group .note-hint-item.active,.note-hint-popover .note-popover-content .note-hint-group .note-hint-item:hover": {
                color: "rgb(255,0,0)",
                backgroundColor: "#428bca",
            },
        }
    };
});

export const GlobalCssSummernoteDark = GlobalCssSummernoteStyles(() => null);

export const GlobalCssSummernote = () => {

    const theme = useTheme();

    if (theme.palette.type === 'dark') {
        return <GlobalCssSummernoteDark/>;
    }

    return null;

};

