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
exports.AnnotationHighlightButton = void 0;
const React = __importStar(require("react"));
const HighlighterSVGIcon_1 = require("../svg_icons/HighlighterSVGIcon");
const ReactUtils_1 = require("../../react/ReactUtils");
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const useStyles = makeStyles_1.default({
    root: (props) => ({
        color: `${props.styleColor}`
    }),
});
exports.AnnotationHighlightButton = ReactUtils_1.memoForwardRef((props) => {
    return (React.createElement("button", { color: "clear", className: "", title: "", "aria-label": "", onClick: () => props.onHighlightedColor(props.dispatchColor), style: {
            backgroundColor: 'transparent',
            border: 'none',
            margin: '0',
            padding: '5px',
        } },
        React.createElement("span", { "aria-hidden": "true", style: {
                color: props.styleColor
            } },
            React.createElement(HighlighterSVGIcon_1.HighlighterSVGIcon, { style: {
                    color: props.styleColor,
                    width: '20px',
                    height: '20px'
                } }))));
});
//# sourceMappingURL=AnnotationHighlightButton.js.map