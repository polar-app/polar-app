"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIPrevIconButton = void 0;
const react_1 = __importDefault(require("react"));
const ExpandLess_1 = __importDefault(require("@material-ui/icons/ExpandLess"));
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
exports.MUIPrevIconButton = react_1.default.memo((props) => {
    return (react_1.default.createElement(IconButton_1.default, { color: props.color, onClick: props.onClick },
        react_1.default.createElement(ExpandLess_1.default, null)));
});
//# sourceMappingURL=MUIPrevIconButton.js.map