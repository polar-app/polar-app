"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIDeleteMenuItem = void 0;
const MUIMenuItem_1 = require("../menu/MUIMenuItem");
const Delete_1 = __importDefault(require("@material-ui/icons/Delete"));
const react_1 = __importDefault(require("react"));
exports.MUIDeleteMenuItem = (props) => {
    return (react_1.default.createElement(MUIMenuItem_1.MUIMenuItem, { text: "Delete", icon: react_1.default.createElement(Delete_1.default, null), onClick: props.onClick }));
};
//# sourceMappingURL=MUIDeleteMenuItem.js.map