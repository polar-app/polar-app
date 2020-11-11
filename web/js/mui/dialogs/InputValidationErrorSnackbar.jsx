"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputValidationErrorSnackbar = void 0;
var react_1 = require("react");
var Alert_1 = require("@material-ui/lab/Alert");
var Snackbar_1 = require("@material-ui/core/Snackbar");
var react_2 = require("react");
exports.InputValidationErrorSnackbar = function (props) {
    var _a = react_1.useState(true), open = _a[0], setOpen = _a[1];
    var handleClose = function () {
        setOpen(false);
    };
    return (<Snackbar_1.default open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert_1.default severity="error" onClose={handleClose}>
                {props.message}
            </Alert_1.default>
        </Snackbar_1.default>);
};
