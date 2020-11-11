"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmDialog = void 0;
var react_1 = require("react");
var Button_1 = require("@material-ui/core/Button");
var DialogActions_1 = require("@material-ui/core/DialogActions");
var DialogContent_1 = require("@material-ui/core/DialogContent");
var DialogContentText_1 = require("@material-ui/core/DialogContentText");
var DialogTitle_1 = require("@material-ui/core/DialogTitle");
var Box_1 = require("@material-ui/core/Box");
var styles_1 = require("@material-ui/core/styles");
var Functions_1 = require("polar-shared/src/util/Functions");
var InputCompleteListener_1 = require("../../mui/complete_listeners/InputCompleteListener");
var WithDeactivatedKeyboardShortcuts_1 = require("../../keyboard_shortcuts/WithDeactivatedKeyboardShortcuts");
var MUIDialog_1 = require("./MUIDialog");
var ReactUtils_1 = require("../../react/ReactUtils");
var useStyles = styles_1.makeStyles(function (theme) {
    return styles_1.createStyles({
        danger: {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
        },
        error: {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
        },
        warning: {
            backgroundColor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText,
        },
        success: {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
        },
        info: {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
        },
        none: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
        cancelButton: {
            color: theme.palette.text.secondary,
        },
        root: {},
        subtitle: {
            fontSize: '1.25rem'
        }
    });
});
exports.ConfirmDialog = ReactUtils_1.deepMemo(function (props) {
    var _a = react_1.default.useState(true), open = _a[0], setOpen = _a[1];
    var classes = useStyles();
    var onCancel = props.onCancel || Functions_1.NULL_FUNCTION;
    var handleClose = react_1.default.useCallback(function (event, reason) {
        if (reason !== undefined) {
            onCancel();
        }
        setOpen(false);
    }, [onCancel]);
    var handleCancel = react_1.default.useCallback(function () {
        setOpen(false);
        onCancel();
    }, [onCancel]);
    var handleAccept = react_1.default.useCallback(function () {
        setOpen(false);
        props.onAccept();
    }, [props]);
    var type = props.type || 'error';
    // tslint:disable-next-line:no-string-literal
    var palette = classes[type];
    return (<MUIDialog_1.MUIDialog maxWidth={props.maxWidth} open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">

            <WithDeactivatedKeyboardShortcuts_1.WithDeactivatedKeyboardShortcuts>
                <InputCompleteListener_1.InputCompleteListener type={props.inputCompletionType || 'enter'} noHint={true} onComplete={handleAccept} onCancel={handleCancel}>
                    <>
                        <DialogTitle_1.default id="alert-dialog-title" className={palette}>
                            {props.title}
                        </DialogTitle_1.default>

                        <DialogContent_1.default>

                            {typeof props.subtitle === 'string' && (<Box_1.default pt={1}>
                                    <DialogContentText_1.default id="alert-dialog-description" className={classes.subtitle}>
                                        {props.subtitle}
                                    </DialogContentText_1.default>
                                </Box_1.default>)}

                            {typeof props.subtitle !== 'string' && (<DialogContent_1.default id="alert-dialog-description" className={classes.subtitle}>
                                    {props.subtitle}
                                </DialogContent_1.default>)}

                        </DialogContent_1.default>
                        <DialogActions_1.default>

                            {!props.noCancel &&
        <Button_1.default className={classes.cancelButton} onClick={handleCancel} size="large">
                                    {props.cancelText || 'Cancel'}
                                </Button_1.default>}

                            <Button_1.default className={palette} onClick={handleAccept} size="large" variant="contained" autoFocus={props.autoFocus}>
                                {props.acceptText || 'Accept'}
                            </Button_1.default>

                        </DialogActions_1.default>
                    </>
                </InputCompleteListener_1.InputCompleteListener>
            </WithDeactivatedKeyboardShortcuts_1.WithDeactivatedKeyboardShortcuts>

        </MUIDialog_1.MUIDialog>);
});
