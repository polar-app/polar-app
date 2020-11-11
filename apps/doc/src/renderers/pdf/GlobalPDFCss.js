"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalPDFCss = exports.GlobalCssDarkForInvertGreyscale = exports.GlobalCssDarkForInvert = exports.GlobalCssDark = exports.GlobalCssDarkForInvertGreyscaleStyles = exports.GlobalCssDarkForInvertStyles = exports.GlobalCssDarkStyles = void 0;
const react_1 = __importDefault(require("react"));
const withStyles_1 = __importDefault(require("@material-ui/core/styles/withStyles"));
const useTheme_1 = __importDefault(require("@material-ui/core/styles/useTheme"));
const SettingsScreen_1 = require("../../../../repository/js/configure/settings/SettingsScreen");
const PrefsHook_1 = require("../../../../repository/js/persistence_layer/PrefsHook");
exports.GlobalCssDarkStyles = withStyles_1.default((theme) => {
    return {
        '@global': {
            ".pdfViewer .page": {
                backgroundColor: `${theme.palette.background.default} !important`
            },
            ".pdfViewer .highlight": {
                backgroundColor: 'rgba(255, 255, 0, 1) !important'
            }
        },
    };
});
exports.GlobalCssDarkForInvertStyles = withStyles_1.default((theme) => {
    return {
        '@global': {
            ".page canvas": {
                filter: "invert(0.85)"
            },
        },
    };
});
exports.GlobalCssDarkForInvertGreyscaleStyles = withStyles_1.default((theme) => {
    return {
        '@global': {
            ".page canvas": {
                filter: "invert(0.85) grayscale(1)"
            },
        },
    };
});
exports.GlobalCssDark = exports.GlobalCssDarkStyles(() => null);
exports.GlobalCssDarkForInvert = exports.GlobalCssDarkForInvertStyles(() => null);
exports.GlobalCssDarkForInvertGreyscale = exports.GlobalCssDarkForInvertGreyscaleStyles(() => null);
exports.GlobalPDFCss = react_1.default.memo(() => {
    const theme = useTheme_1.default();
    const prefs = PrefsHook_1.usePrefs();
    if (!prefs.value) {
        return null;
    }
    const mode = prefs.value.get('dark-mode-pdf').getOrElse(SettingsScreen_1.PREF_PDF_DARK_MODE_OPTIONS[0].id);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        theme.palette.type === 'dark' &&
            react_1.default.createElement(exports.GlobalCssDark, null),
        theme.palette.type === 'dark' && mode === 'invert' &&
            react_1.default.createElement(exports.GlobalCssDarkForInvert, null),
        theme.palette.type === 'dark' && mode === 'invert-greyscale' &&
            react_1.default.createElement(exports.GlobalCssDarkForInvertGreyscale, null)));
});
//# sourceMappingURL=GlobalPDFCss.js.map