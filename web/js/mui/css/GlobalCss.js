"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalCss = exports.GlobalCssDark = exports.GlobalCssDarkStyles = void 0;
const react_1 = __importDefault(require("react"));
const withStyles_1 = __importDefault(require("@material-ui/core/styles/withStyles"));
const useTheme_1 = __importDefault(require("@material-ui/core/styles/useTheme"));
const GlobalCSSGapBox_1 = require("./GlobalCSSGapBox");
const DarkModeScrollbars_1 = require("./DarkModeScrollbars");
exports.GlobalCssDarkStyles = withStyles_1.default(() => {
    const theme = useTheme_1.default();
    const darkModeScrollbars = DarkModeScrollbars_1.DarkModeScrollbars.createCSSForReact();
    return {
        '@global': Object.assign(Object.assign({}, darkModeScrollbars), { '.MuiTooltip-tooltip': {
                fontSize: '1.1rem',
                backgroundColor: theme.palette.background.default
            } }),
    };
});
exports.GlobalCssDark = exports.GlobalCssDarkStyles(() => null);
exports.GlobalCss = () => {
    const theme = useTheme_1.default();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        theme.palette.type === 'dark' &&
            react_1.default.createElement(exports.GlobalCssDark, null),
        react_1.default.createElement(GlobalCSSGapBox_1.GlobalCssGapBox, null)));
};
//# sourceMappingURL=GlobalCss.js.map