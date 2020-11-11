"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIDocDeleteButton = void 0;
const react_1 = __importDefault(require("react"));
const Delete_1 = __importDefault(require("@material-ui/icons/Delete"));
const StandardIconButton_1 = require("./StandardIconButton");
exports.MUIDocDeleteButton = react_1.default.memo((props) => (react_1.default.createElement(StandardIconButton_1.StandardIconButton, Object.assign({ tooltip: "Delete" }, props),
    react_1.default.createElement(Delete_1.default, null))));
//# sourceMappingURL=MUIDocDeleteButton.js.map