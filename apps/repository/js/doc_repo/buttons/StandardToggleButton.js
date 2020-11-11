"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardToggleButton = void 0;
const react_1 = __importDefault(require("react"));
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const useTheme_1 = __importDefault(require("@material-ui/core/styles/useTheme"));
const MUITooltip_1 = require("../../../../../web/js/mui/MUITooltip");
function useActiveColor(active) {
    const theme = useTheme_1.default();
    return active ? theme.palette.primary.main : theme.palette.text.secondary;
}
exports.StandardToggleButton = react_1.default.memo((props) => {
    const activeColor = useActiveColor(props.active || false);
    return (react_1.default.createElement(MUITooltip_1.MUITooltip, { title: props.tooltip },
        react_1.default.createElement(IconButton_1.default, { size: props.size || 'small', onClick: props.onClick, "aria-label": props.tooltip.toLowerCase(), style: { color: activeColor } }, props.children)));
});
//# sourceMappingURL=StandardToggleButton.js.map