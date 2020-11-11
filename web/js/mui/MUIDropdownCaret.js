"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIDropdownCaret = void 0;
const react_1 = __importDefault(require("react"));
const caret = {
    display: 'inline-block',
    width: 0,
    height: 0,
    marginLeft: '.255em',
    verticalAlign: '.255em',
    borderTop: '.3em solid',
    borderRight: '.3em solid transparent',
    borderBottom: 0,
    borderLeft: '.3em solid transparent',
    color: 'var(--secondary)'
};
exports.MUIDropdownCaret = () => (react_1.default.createElement("span", { style: caret }));
//# sourceMappingURL=MUIDropdownCaret.js.map