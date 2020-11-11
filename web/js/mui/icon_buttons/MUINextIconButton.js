"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUINextIconButton = void 0;
const react_1 = __importDefault(require("react"));
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const ExpandMore_1 = __importDefault(require("@material-ui/icons/ExpandMore"));
exports.MUINextIconButton = react_1.default.memo((props) => {
    return (react_1.default.createElement(IconButton_1.default, { color: props.color, onClick: props.onClick },
        react_1.default.createElement(ExpandMore_1.default, null)));
});
//# sourceMappingURL=MUINextIconButton.js.map