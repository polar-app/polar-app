"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptDialog = void 0;
var react_1 = require("react");
var Button_1 = require("@material-ui/core/Button");
var TextField_1 = require("@material-ui/core/TextField");
var DialogActions_1 = require("@material-ui/core/DialogActions");
var DialogContent_1 = require("@material-ui/core/DialogContent");
var DialogContentText_1 = require("@material-ui/core/DialogContentText");
var DialogTitle_1 = require("@material-ui/core/DialogTitle");
var styles_1 = require("@material-ui/core/styles");
var InputCompleteListener_1 = require("../../mui/complete_listeners/InputCompleteListener");
var InputValidationErrorSnackbar_1 = require("../../mui/dialogs/InputValidationErrorSnackbar");
var WithDeactivatedKeyboardShortcuts_1 = require("../../keyboard_shortcuts/WithDeactivatedKeyboardShortcuts");
var MUIDialog_1 = require("./MUIDialog");
var ReactUtils_1 = require("../../react/ReactUtils");
var useStyles = styles_1.makeStyles(function (theme) {
    return styles_1.createStyles({
        cancelButton: {
            color: theme.palette.text.secondary,
        },
        textField: {
            minWidth: '350px',
            width: '450px',
            maxWidth: '100vh',
        },
        description: {
            fontSize: '1.25rem'
        }
    });
});
exports.PromptDialog = ReactUtils_1.deepMemo(function (props) {
    var classes = useStyles();
    var value = props.defaultValue || "";
    var autoFocus = props.autoFocus || true;
    var _a = react_1.default.useState({
        open: true
    }), state = _a[0], setState = _a[1];
    var closeDialog = function () {
        setState({ open: false });
    };
    var handleClose = function () {
        props.onCancel();
        closeDialog();
    };
    var handleCancel = function () {
        props.onCancel();
        closeDialog();
    };
    var handleDone = function () {
        if (props.inputValidator) {
            var validationError = props.inputValidator(value);
            if (validationError) {
                setState(__assign(__assign({}, state), { validationError: validationError.message }));
                return;
            }
        }
        props.onDone(value);
        closeDialog();
    };
    var handleInput = function (text) {
        if (state.validationError) {
            setState(__assign(__assign({}, state), { validationError: undefined }));
        }
        value = text;
    };
    return (<MUIDialog_1.MUIDialog open={state.open} onClose={handleClose} maxWidth="lg" aria-labelledby="form-dialog-title">

            <WithDeactivatedKeyboardShortcuts_1.WithDeactivatedKeyboardShortcuts>
                <InputCompleteListener_1.InputCompleteListener type='enter' noHint={true} onComplete={handleDone}>
                    <>
                        <DialogTitle_1.default id="form-dialog-title">{props.title}</DialogTitle_1.default>
                        <DialogContent_1.default>

                            {state.validationError &&
        <InputValidationErrorSnackbar_1.InputValidationErrorSnackbar message={state.validationError}/>}

                            {props.description &&
        <DialogContentText_1.default className={classes.description}>
                                {props.description}
                            </DialogContentText_1.default>}

                            <TextField_1.default className={classes.textField} autoFocus={autoFocus} onChange={function (event) { return handleInput(event.currentTarget.value); }} margin="dense" id="name" autoComplete={props.autoComplete} defaultValue={props.defaultValue} placeholder={props.placeholder} label={props.label} type={props.type} fullWidth/>

                        </DialogContent_1.default>

                        <DialogActions_1.default>
                            <Button_1.default onClick={handleCancel}>
                                Cancel
                            </Button_1.default>
                            <Button_1.default onClick={handleDone} size="large" variant="contained" color="primary">
                                Done
                            </Button_1.default>
                        </DialogActions_1.default>
                    </>
                </InputCompleteListener_1.InputCompleteListener>
            </WithDeactivatedKeyboardShortcuts_1.WithDeactivatedKeyboardShortcuts>

        </MUIDialog_1.MUIDialog>);
});
