"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnackbarDialog = void 0;
var react_1 = require("react");
var Snackbar_1 = require("@material-ui/core/Snackbar");
var IconButton_1 = require("@material-ui/core/IconButton");
var FixedWidthIcons_1 = require("../icons/FixedWidthIcons");
var ReactUtils_1 = require("../../react/ReactUtils");
exports.SnackbarDialog = ReactUtils_1.deepMemo(function (props) {
    var _a = react_1.default.useState(true), open = _a[0], setOpen = _a[1];
    var handleClose = function (event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    var Action = function () { return (<IconButton_1.default size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <FixedWidthIcons_1.CloseIcon />
        </IconButton_1.default>); };
    var action = props.action || <Action />;
    return (<Snackbar_1.default anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
    }} open={open} autoHideDuration={props.autoHideDuration || 5000} onClose={handleClose} message={props.message} action={action}/>);
});
