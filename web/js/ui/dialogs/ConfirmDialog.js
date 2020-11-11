"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmDialog = void 0;
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const DialogActions_1 = __importDefault(require("@material-ui/core/DialogActions"));
const DialogContent_1 = __importDefault(require("@material-ui/core/DialogContent"));
const DialogContentText_1 = __importDefault(require("@material-ui/core/DialogContentText"));
const DialogTitle_1 = __importDefault(require("@material-ui/core/DialogTitle"));
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const styles_1 = require("@material-ui/core/styles");
const Functions_1 = require("polar-shared/src/util/Functions");
const InputCompleteListener_1 = require("../../mui/complete_listeners/InputCompleteListener");
const WithDeactivatedKeyboardShortcuts_1 = require("../../keyboard_shortcuts/WithDeactivatedKeyboardShortcuts");
const MUIDialog_1 = require("./MUIDialog");
const ReactUtils_1 = require("../../react/ReactUtils");
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
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
}));
exports.ConfirmDialog = ReactUtils_1.deepMemo((props) => {
    const [open, setOpen] = react_1.default.useState(true);
    const classes = useStyles();
    const onCancel = props.onCancel || Functions_1.NULL_FUNCTION;
    const handleClose = react_1.default.useCallback((event, reason) => {
        if (reason !== undefined) {
            onCancel();
        }
        setOpen(false);
    }, [onCancel]);
    const handleCancel = react_1.default.useCallback(() => {
        setOpen(false);
        onCancel();
    }, [onCancel]);
    const handleAccept = react_1.default.useCallback(() => {
        setOpen(false);
        props.onAccept();
    }, [props]);
    const type = props.type || 'error';
    const palette = classes[type];
    return (react_1.default.createElement(MUIDialog_1.MUIDialog, { maxWidth: props.maxWidth, open: open, onClose: handleClose, "aria-labelledby": "alert-dialog-title", "aria-describedby": "alert-dialog-description" },
        react_1.default.createElement(WithDeactivatedKeyboardShortcuts_1.WithDeactivatedKeyboardShortcuts, null,
            react_1.default.createElement(InputCompleteListener_1.InputCompleteListener, { type: props.inputCompletionType || 'enter', noHint: true, onComplete: handleAccept, onCancel: handleCancel },
                react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(DialogTitle_1.default, { id: "alert-dialog-title", className: palette }, props.title),
                    react_1.default.createElement(DialogContent_1.default, null,
                        typeof props.subtitle === 'string' && (react_1.default.createElement(Box_1.default, { pt: 1 },
                            react_1.default.createElement(DialogContentText_1.default, { id: "alert-dialog-description", className: classes.subtitle }, props.subtitle))),
                        typeof props.subtitle !== 'string' && (react_1.default.createElement(DialogContent_1.default, { id: "alert-dialog-description", className: classes.subtitle }, props.subtitle))),
                    react_1.default.createElement(DialogActions_1.default, null,
                        !props.noCancel &&
                            react_1.default.createElement(Button_1.default, { className: classes.cancelButton, onClick: handleCancel, size: "large" }, props.cancelText || 'Cancel'),
                        react_1.default.createElement(Button_1.default, { className: palette, onClick: handleAccept, size: "large", variant: "contained", autoFocus: props.autoFocus }, props.acceptText || 'Accept')))))));
});
//# sourceMappingURL=ConfirmDialog.js.map