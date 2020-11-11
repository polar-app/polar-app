"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIAppRoot = void 0;
const use_persisted_state_1 = __importDefault(require("use-persisted-state"));
const MUIThemeTypeContext_1 = require("./context/MUIThemeTypeContext");
const GlobalCss_1 = require("./css/GlobalCss");
const React = __importStar(require("react"));
const GlobalCssSummernote_1 = require("./css/GlobalCssSummernote");
const GlobalCSSBootstrap_1 = require("./css/GlobalCSSBootstrap");
const GlobalCssMobile_1 = require("./css/GlobalCssMobile");
const CssBaseline_1 = __importDefault(require("@material-ui/core/CssBaseline"));
const styles_1 = require("@material-ui/core/styles");
const KeyboardShortcuts_1 = require("../keyboard_shortcuts/KeyboardShortcuts");
exports.MUIAppRoot = (props) => {
    const usePersistedTheme = use_persisted_state_1.default('theme');
    const [theme, setTheme] = usePersistedTheme("dark");
    const muiTheme = React.useMemo(() => styles_1.createMuiTheme({
        typography: {
            htmlFontSize: 12,
            fontSize: 12
        },
        palette: {
            type: theme,
            primary: {
                'main': 'rgb(103, 84, 214)'
            },
        }
    }), [theme]);
    return (React.createElement(React.Fragment, null,
        React.createElement(KeyboardShortcuts_1.KeyboardShortcuts, null),
        React.createElement(styles_1.ThemeProvider, { theme: muiTheme },
            React.createElement(MUIThemeTypeContext_1.MUIThemeTypeContext.Provider, { value: { theme, setTheme } },
                React.createElement(React.Fragment, null,
                    React.createElement(CssBaseline_1.default, null),
                    React.createElement(GlobalCss_1.GlobalCss, null),
                    React.createElement(GlobalCSSBootstrap_1.GlobalCSSBootstrap, null),
                    React.createElement(GlobalCssSummernote_1.GlobalCssSummernote, null),
                    React.createElement(GlobalCssMobile_1.GlobalCssMobile, null),
                    props.children)))));
};
//# sourceMappingURL=MUIAppRoot.js.map