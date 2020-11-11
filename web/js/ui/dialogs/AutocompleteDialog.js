"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutocompleteDialog = void 0;
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const DialogActions_1 = __importDefault(require("@material-ui/core/DialogActions"));
const DialogContent_1 = __importDefault(require("@material-ui/core/DialogContent"));
const MUICreatableAutocomplete_1 = __importDefault(require("../../mui/autocomplete/MUICreatableAutocomplete"));
const DialogTitle_1 = __importDefault(require("@material-ui/core/DialogTitle"));
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const DialogContentText_1 = __importDefault(require("@material-ui/core/DialogContentText"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const createStyles_1 = __importDefault(require("@material-ui/core/styles/createStyles"));
const InputCompleteListener_1 = require("../../mui/complete_listeners/InputCompleteListener");
const WithDeactivatedKeyboardShortcuts_1 = require("../../keyboard_shortcuts/WithDeactivatedKeyboardShortcuts");
const MUIDialog_1 = require("./MUIDialog");
const useStyles = makeStyles_1.default((theme) => createStyles_1.default({
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
}));
function AutocompleteDialog(props) {
    const classes = useStyles();
    const [state, setState] = react_1.default.useState({
        open: true
    });
    const activeRef = react_1.default.useRef(false);
    const closeDialog = () => {
        setState({ open: false });
    };
    const handleCancel = () => {
        props.onCancel();
        closeDialog();
    };
    let selectedOptions = props.defaultOptions ? props.defaultOptions.map(current => current.value) : [];
    const handleComplete = () => {
        closeDialog();
        props.onDone(selectedOptions);
    };
    const handleChange = (newOptions) => {
        selectedOptions = newOptions;
    };
    function handleOpen(open) {
        setTimeout(() => activeRef.current = open, 1);
    }
    return (react_1.default.createElement(MUIDialog_1.MUIDialog, { open: state.open, onClose: handleCancel, maxWidth: "md", "aria-labelledby": "form-dialog-title" },
        react_1.default.createElement(WithDeactivatedKeyboardShortcuts_1.WithDeactivatedKeyboardShortcuts, null,
            react_1.default.createElement(InputCompleteListener_1.InputCompleteListener, { type: 'enter', noHint: true, onComplete: handleComplete, onCancel: handleCancel, completable: () => !activeRef.current },
                react_1.default.createElement(react_1.default.Fragment, null,
                    props.title &&
                        react_1.default.createElement(DialogTitle_1.default, null, props.title),
                    react_1.default.createElement(DialogContent_1.default, null,
                        props.description &&
                            react_1.default.createElement(Box_1.default, { pt: 1 },
                                react_1.default.createElement(DialogContentText_1.default, { className: classes.description }, props.description)),
                        react_1.default.createElement(MUICreatableAutocomplete_1.default, Object.assign({}, props, { onOpen: handleOpen, autoFocus: true, onChange: handleChange }))),
                    react_1.default.createElement(DialogActions_1.default, null,
                        react_1.default.createElement(Button_1.default, { onClick: handleCancel }, "Cancel"),
                        react_1.default.createElement(Button_1.default, { onClick: handleComplete, size: "large", variant: "contained", color: "primary" }, "Done")))))));
}
exports.AutocompleteDialog = AutocompleteDialog;
;
//# sourceMappingURL=AutocompleteDialog.js.map