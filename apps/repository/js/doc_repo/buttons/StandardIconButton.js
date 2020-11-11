"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardIconButton = void 0;
const react_1 = __importDefault(require("react"));
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const useTheme_1 = __importDefault(require("@material-ui/core/styles/useTheme"));
const MUITooltip_1 = require("../../../../../web/js/mui/MUITooltip");
exports.StandardIconButton = react_1.default.memo((props) => {
    const theme = useTheme_1.default();
    return (react_1.default.createElement(MUITooltip_1.MUITooltip, { title: props.tooltip },
        react_1.default.createElement(IconButton_1.default, { size: props.size || 'small', onClick: props.onClick, disabled: props.disabled, "aria-label": props.tooltip.toLowerCase(), style: { color: theme.palette.text.secondary } }, props.children)));
});
//# sourceMappingURL=StandardIconButton.js.map