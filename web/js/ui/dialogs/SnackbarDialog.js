"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnackbarDialog = void 0;
const react_1 = __importDefault(require("react"));
const Snackbar_1 = __importDefault(require("@material-ui/core/Snackbar"));
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const FixedWidthIcons_1 = require("../icons/FixedWidthIcons");
const ReactUtils_1 = require("../../react/ReactUtils");
exports.SnackbarDialog = ReactUtils_1.deepMemo((props) => {
    const [open, setOpen] = react_1.default.useState(true);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    const Action = () => (react_1.default.createElement(IconButton_1.default, { size: "small", "aria-label": "close", color: "inherit", onClick: handleClose },
        react_1.default.createElement(FixedWidthIcons_1.CloseIcon, null)));
    const action = props.action || react_1.default.createElement(Action, null);
    return (react_1.default.createElement(Snackbar_1.default, { anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
        }, open: open, autoHideDuration: props.autoHideDuration || 5000, onClose: handleClose, message: props.message, action: action }));
});
//# sourceMappingURL=SnackbarDialog.js.map