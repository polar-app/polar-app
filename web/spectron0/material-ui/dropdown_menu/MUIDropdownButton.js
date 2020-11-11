"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIDropdownButton = void 0;
const react_1 = __importDefault(require("react"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const Functions_1 = require("polar-shared/src/util/Functions");
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
exports.MUIDropdownButton = react_1.default.memo((props) => {
    const buttonProps = {
        onClick: props.onClick || Functions_1.NULL_FUNCTION,
        color: props.color,
        size: props.size,
        ref: props.ref,
    };
    if (props.text && props.icon) {
        return (react_1.default.createElement(Button_1.default, Object.assign({}, buttonProps),
            props.icon,
            " ",
            props.text));
    }
    if (props.icon) {
        return (react_1.default.createElement(IconButton_1.default, Object.assign({}, buttonProps), props.icon));
    }
    return (react_1.default.createElement(Button_1.default, Object.assign({}, buttonProps), props.text));
}, react_fast_compare_1.default);
//# sourceMappingURL=MUIDropdownButton.js.map