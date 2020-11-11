"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteConfirmationDemo = void 0;
const react_1 = __importDefault(require("react"));
const MUIDialogControllers_1 = require("../../js/mui/dialogs/MUIDialogControllers");
const ChildComponent = () => {
    const onClick = MUIDialogControllers_1.useDeleteConfirmation(() => console.log("Deleted"));
    return react_1.default.createElement("div", null);
};
exports.DeleteConfirmationDemo = () => {
    return (react_1.default.createElement(ChildComponent, null));
};
//# sourceMappingURL=DeleteConfirmationDemo.js.map