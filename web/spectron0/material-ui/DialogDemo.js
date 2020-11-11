"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Dialog_1 = __importDefault(require("@material-ui/core/Dialog"));
const DialogContent_1 = __importDefault(require("@material-ui/core/DialogContent"));
function DialogDemo() {
    const [open, setOpen] = react_1.default.useState(true);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (react_1.default.createElement(Dialog_1.default, { onClose: handleClose, "aria-labelledby": "customized-dialog-title", open: open },
        react_1.default.createElement(DialogContent_1.default, null)));
}
exports.default = DialogDemo;
//# sourceMappingURL=DialogDemo.js.map