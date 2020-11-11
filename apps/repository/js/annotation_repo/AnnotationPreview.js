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
exports.AnnotationPreview = void 0;
const React = __importStar(require("react"));
const ResponsiveImg_1 = require("../../../../web/js/annotation_sidebar/ResponsiveImg");
const DateTimeTableCell_1 = require("../DateTimeTableCell");
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const Strings_1 = require("polar-shared/src/util/Strings");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const useTheme_1 = __importDefault(require("@material-ui/core/styles/useTheme"));
const MAX_TEXT_LENGTH = 300;
function createStyle(color) {
    if (color) {
        return {
            borderLeftColor: color,
            borderLeftWidth: '4px',
            borderLeftStyle: 'solid',
            paddingLeft: '5px',
        };
    }
    return {
        paddingLeft: '9px',
        paddingRight: '5px',
    };
}
const ImagePreview = ReactUtils_1.deepMemo((props) => {
    const { img } = props;
    return (React.createElement(ResponsiveImg_1.ResponsiveImg, { id: props.id, img: img, defaultText: "No image" }));
});
const TextPreview = ReactUtils_1.deepMemo((props) => {
    const { text } = props;
    const truncated = text ? Strings_1.Strings.truncateOnWordBoundary(text, MAX_TEXT_LENGTH, true) : undefined;
    return (React.createElement("div", { style: { userSelect: "none" }, className: "text-sm", dangerouslySetInnerHTML: { __html: truncated || 'no text' } }));
});
const PreviewParent = ReactUtils_1.deepMemo((props) => {
    const style = createStyle(props.color);
    return (React.createElement("div", { style: style }, props.children));
});
const Preview = ReactUtils_1.deepMemo((props) => {
    if (props.img) {
        return React.createElement(ImagePreview, Object.assign({}, props));
    }
    else {
        return React.createElement(TextPreview, Object.assign({}, props));
    }
});
exports.AnnotationPreview = ReactUtils_1.deepMemo((props) => {
    const theme = useTheme_1.default();
    return (React.createElement("div", { id: props.id, className: "mt-1" },
        React.createElement(PreviewParent, { color: props.color },
            React.createElement(React.Fragment, null,
                React.createElement(Preview, Object.assign({}, props)),
                React.createElement(Box_1.default, { mt: 1, mb: 1 },
                    React.createElement(DateTimeTableCell_1.DateTimeTableCell, { datetime: props.lastUpdated || props.created, style: { color: theme.palette.text.secondary } }))))));
});
//# sourceMappingURL=AnnotationPreview.js.map