"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectDialog = void 0;
const react_1 = __importDefault(require("react"));
const DialogTitle_1 = __importDefault(require("@material-ui/core/DialogTitle"));
const DialogActions_1 = __importDefault(require("@material-ui/core/DialogActions/DialogActions"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const DialogContent_1 = __importDefault(require("@material-ui/core/DialogContent"));
const ListItemText_1 = __importDefault(require("@material-ui/core/ListItemText"));
const ListItem_1 = __importDefault(require("@material-ui/core/ListItem"));
const List_1 = __importDefault(require("@material-ui/core/List"));
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const DialogContentText_1 = __importDefault(require("@material-ui/core/DialogContentText"));
const WithDeactivatedKeyboardShortcuts_1 = require("../../keyboard_shortcuts/WithDeactivatedKeyboardShortcuts");
const MUIDialog_1 = require("./MUIDialog");
exports.SelectDialog = function (props) {
    const [open, setOpen] = react_1.default.useState(true);
    const handleCancel = () => {
        props.onCancel();
        setOpen(false);
    };
    const handleDone = (option) => {
        setOpen(false);
        props.onDone(option);
    };
    const handleClose = (event, reason) => {
        props.onCancel();
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    function convertOptionToListItem(option) {
        return (react_1.default.createElement(ListItem_1.default, { key: option.id, autoFocus: option.id === props.defaultValue, button: true, onClick: () => handleDone(option) },
            react_1.default.createElement(ListItemText_1.default, { primary: option.label })));
    }
    return (react_1.default.createElement(MUIDialog_1.MUIDialog, { open: open, onClose: handleClose, "aria-labelledby": "form-dialog-title" },
        react_1.default.createElement(WithDeactivatedKeyboardShortcuts_1.WithDeactivatedKeyboardShortcuts, null,
            react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(DialogTitle_1.default, { id: "form-dialog-title" }, props.title),
                react_1.default.createElement(DialogContent_1.default, null,
                    props.description !== undefined && (react_1.default.createElement(Box_1.default, { pt: 1 },
                        react_1.default.createElement(DialogContentText_1.default, { id: "dialog-description" }, props.description))),
                    react_1.default.createElement(List_1.default, null, props.options.map(convertOptionToListItem))),
                react_1.default.createElement(DialogActions_1.default, null,
                    react_1.default.createElement(Button_1.default, { onClick: handleCancel }, "Cancel"))))));
};
//# sourceMappingURL=SelectDialog.js.map