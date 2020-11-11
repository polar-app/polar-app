"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoBlur = void 0;
const react_1 = __importDefault(require("react"));
exports.AutoBlur = (props) => {
    let ref;
    const handleClick = () => {
        if (document.activeElement !== null) {
            document.activeElement.blur();
        }
    };
    return (react_1.default.createElement("div", { ref: _ref => ref = _ref, onClick: () => handleClick() }, props.children));
};
//# sourceMappingURL=AutoBlur.js.map