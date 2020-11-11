"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputValidationErrorSnackbar = void 0;
const react_1 = require("react");
const Alert_1 = __importDefault(require("@material-ui/lab/Alert"));
const Snackbar_1 = __importDefault(require("@material-ui/core/Snackbar"));
const react_2 = __importDefault(require("react"));
exports.InputValidationErrorSnackbar = (props) => {
    const [open, setOpen] = react_1.useState(true);
    const handleClose = () => {
        setOpen(false);
    };
    return (react_2.default.createElement(Snackbar_1.default, { open: open, autoHideDuration: 5000, onClose: handleClose },
        react_2.default.createElement(Alert_1.default, { severity: "error", onClose: handleClose }, props.message)));
};
//# sourceMappingURL=InputValidationErrorSnackbar.js.map