"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertDialogDemo = exports.ConfirmDialog = void 0;
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const Dialog_1 = __importDefault(require("@material-ui/core/Dialog"));
const DialogActions_1 = __importDefault(require("@material-ui/core/DialogActions"));
const DialogContent_1 = __importDefault(require("@material-ui/core/DialogContent"));
const DialogContentText_1 = __importDefault(require("@material-ui/core/DialogContentText"));
const DialogTitle_1 = __importDefault(require("@material-ui/core/DialogTitle"));
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const styles_1 = require("@material-ui/core/styles");
const GlobalHotKeyCompleteListener_1 = require("../complete_listeners/GlobalHotKeyCompleteListener");
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
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
    cancelButton: {
        color: theme.palette.text.secondary,
    },
    root: {},
    subtitle: {
        fontSize: '1.25rem'
    }
}));
exports.ConfirmDialog = (props) => {
    const [open, setOpen] = react_1.default.useState(true);
    const classes = useStyles();
    const handleClose = (event, reason) => {
        if (reason !== undefined) {
            props.onCancel();
        }
        setOpen(false);
    };
    const handleCancel = () => {
        props.onCancel();
        setOpen(false);
    };
    const handleAccept = () => {
        props.onAccept();
        setOpen(false);
    };
    const type = props.type || 'error';
    const palette = classes[type];
    return (react_1.default.createElement(Dialog_1.default, { open: open, onClose: handleClose, "aria-labelledby": "alert-dialog-title", "aria-describedby": "alert-dialog-description" },
        react_1.default.createElement(GlobalHotKeyCompleteListener_1.GlobalHotKeyCompleteListener, { onComplete: handleAccept }),
        react_1.default.createElement(DialogTitle_1.default, { id: "alert-dialog-title", className: palette }, props.title),
        react_1.default.createElement(DialogContent_1.default, null,
            react_1.default.createElement(Box_1.default, { pt: 1 },
                react_1.default.createElement(DialogContentText_1.default, { id: "alert-dialog-description", className: classes.subtitle }, props.subtitle))),
        react_1.default.createElement(DialogActions_1.default, null,
            react_1.default.createElement(Button_1.default, { className: classes.cancelButton, onClick: handleCancel, size: "large" }, "Cancel"),
            react_1.default.createElement(Button_1.default, { className: palette, onClick: handleAccept, size: "large", variant: "contained", autoFocus: props.autoFocus }, "Accept"))));
};
exports.AlertDialogDemo = () => (react_1.default.createElement(exports.ConfirmDialog, { onAccept: () => console.log('accept'), onCancel: () => console.log('cancel'), title: "You sure you want to do something dangerous?", subtitle: "This is a dangerous action and can't be undone bro.", type: 'success' }));
//# sourceMappingURL=AlertDialogDemo.js.map