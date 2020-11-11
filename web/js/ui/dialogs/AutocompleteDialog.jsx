"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutocompleteDialog = void 0;
var react_1 = require("react");
var Button_1 = require("@material-ui/core/Button");
var DialogActions_1 = require("@material-ui/core/DialogActions");
var DialogContent_1 = require("@material-ui/core/DialogContent");
var MUICreatableAutocomplete_1 = require("../../mui/autocomplete/MUICreatableAutocomplete");
var DialogTitle_1 = require("@material-ui/core/DialogTitle");
var Box_1 = require("@material-ui/core/Box");
var DialogContentText_1 = require("@material-ui/core/DialogContentText");
var makeStyles_1 = require("@material-ui/core/styles/makeStyles");
var createStyles_1 = require("@material-ui/core/styles/createStyles");
var InputCompleteListener_1 = require("../../mui/complete_listeners/InputCompleteListener");
var WithDeactivatedKeyboardShortcuts_1 = require("../../keyboard_shortcuts/WithDeactivatedKeyboardShortcuts");
var MUIDialog_1 = require("./MUIDialog");
var useStyles = makeStyles_1.default(function (theme) {
    return createStyles_1.default({
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
function AutocompleteDialog(props) {
    var classes = useStyles();
    var _a = react_1.default.useState({
        open: true
    }), state = _a[0], setState = _a[1];
    var activeRef = react_1.default.useRef(false);
    var closeDialog = function () {
        setState({ open: false });
    };
    var handleCancel = function () {
        props.onCancel();
        closeDialog();
    };
    var selectedOptions = props.defaultOptions ? props.defaultOptions.map(function (current) { return current.value; }) : [];
    var handleComplete = function () {
        closeDialog();
        props.onDone(selectedOptions);
    };
    var handleChange = function (newOptions) {
        selectedOptions = newOptions;
    };
    // useInputCompleteWindowListener({onComplete: handleComplete, onCancel: handleCancel});
    function handleOpen(open) {
        setTimeout(function () { return activeRef.current = open; }, 1);
    }
    return (<MUIDialog_1.MUIDialog open={state.open} onClose={handleCancel} maxWidth="md" aria-labelledby="form-dialog-title">

            <WithDeactivatedKeyboardShortcuts_1.WithDeactivatedKeyboardShortcuts>
                <InputCompleteListener_1.InputCompleteListener type='enter' noHint={true} onComplete={handleComplete} onCancel={handleCancel} completable={function () { return !activeRef.current; }}>
                    <>

                        {props.title &&
        <DialogTitle_1.default>{props.title}</DialogTitle_1.default>}

                        <DialogContent_1.default>

                            {props.description &&
        <Box_1.default pt={1}>
                                <DialogContentText_1.default className={classes.description}>
                                    {props.description}
                                </DialogContentText_1.default>
                            </Box_1.default>}

                            <MUICreatableAutocomplete_1.default {...props} onOpen={handleOpen} autoFocus={true} onChange={handleChange}/>

                        </DialogContent_1.default>

                        <DialogActions_1.default>
                            <Button_1.default onClick={handleCancel}>
                                Cancel
                            </Button_1.default>
                            <Button_1.default onClick={handleComplete} size="large" variant="contained" color="primary">
                                Done
                            </Button_1.default>
                        </DialogActions_1.default>
                    </>
                </InputCompleteListener_1.InputCompleteListener>
            </WithDeactivatedKeyboardShortcuts_1.WithDeactivatedKeyboardShortcuts>

        </MUIDialog_1.MUIDialog>);
}
exports.AutocompleteDialog = AutocompleteDialog;
;
