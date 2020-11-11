"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCSS = exports.useStylesheetURL = exports.StylesheetMaps = void 0;
const react_1 = __importDefault(require("react"));
const DarkModeScrollbars_1 = require("../../../../../web/js/mui/css/DarkModeScrollbars");
const useTheme_1 = __importDefault(require("@material-ui/core/styles/useTheme"));
const blue_1 = __importDefault(require("@material-ui/core/colors/blue"));
const StringBuffer_1 = require("polar-shared/src/util/StringBuffer");
var StylesheetMaps;
(function (StylesheetMaps) {
    function toStylesheetURL(stylesheetMap) {
        const cssStr = StylesheetMaps.toString(stylesheetMap);
        const blob = new Blob([cssStr], { type: 'text/css' });
        return URL.createObjectURL(blob);
    }
    StylesheetMaps.toStylesheetURL = toStylesheetURL;
    function toString(stylesheetMap) {
        const buff = new StringBuffer_1.StringBuffer();
        for (const rule of Object.keys(stylesheetMap)) {
            const rules = stylesheetMap[rule];
            buff.append(`${rule} {\n`);
            for (const style of Object.entries(rules)) {
                buff.append(`    ${style[0]}: ${style[1]};\n`);
            }
            buff.append(`}\n`);
        }
        return buff.toString();
    }
    StylesheetMaps.toString = toString;
})(StylesheetMaps = exports.StylesheetMaps || (exports.StylesheetMaps = {}));
function useStylesheetURL() {
    const stylesheetMap = useCSS();
    return react_1.default.useMemo(() => StylesheetMaps.toStylesheetURL(stylesheetMap), [stylesheetMap]);
}
exports.useStylesheetURL = useStylesheetURL;
function useCSS() {
    const theme = useTheme_1.default();
    const darkModeScrollbars = theme.palette.type === 'dark' ?
        DarkModeScrollbars_1.DarkModeScrollbars.createCSS() :
        {};
    const color = theme.palette.type === 'dark' ? 'rgb(217, 217, 217)' : theme.palette.text.primary;
    const baseColorStyles = {
        'color': `${color}`,
        'background-color': `${theme.palette.background.default}`,
    };
    const paddingStyles = {
        "padding-top": "10px",
        "padding-bottom": "10px",
        "padding-left": "10px",
        "padding-right": "10px",
        "padding": "10px",
    };
    return Object.assign(Object.assign({}, darkModeScrollbars), { 'body, html': {
            'background-color': `${theme.palette.background.default}`,
            'font-family': `${theme.typography.fontFamily} !important`,
            'padding': '0px',
            'padding-bottom': '5px !important',
        }, 'body :not(.polar-ui)': Object.assign({}, baseColorStyles), 'body': Object.assign({ 'margin': '5px', 'min-height': 'calc(100vh - 20px)' }, paddingStyles), 'html': Object.assign({ 'background-color': `${theme.palette.background.default}`, 'margin-left': 'auto !important', 'margin-right': 'auto !important', 'margin-bottom': '5px !important' }, paddingStyles), 'h1, h2, h3': {
            'color': `${theme.palette.text.primary}`
        }, 'header h2': {}, 'header > figure': {
            margin: '0px',
            display: 'flex'
        }, 'header > figure > img': {
            'margin-left': 'auto',
            'margin-right': 'auto',
            'max-height': '100% !important',
            'max-width': '100% !important',
            'overflow': 'hidden'
        }, "a:link": {
            color: blue_1.default[300],
        }, "a:visited": {
            color: blue_1.default[600],
        }, "a:hover": {
            color: blue_1.default[400],
        }, "a:active": {
            color: blue_1.default[500],
        } });
}
exports.useCSS = useCSS;
//# sourceMappingURL=EPUBDocumentHooks.js.map