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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaHighlightAnnotationView2 = void 0;
const React = __importStar(require("react"));
const ResponsiveImg_1 = require("../ResponsiveImg");
const HighlightColor_1 = require("polar-shared/src/metadata/HighlightColor");
const AnnotationViewControlBar2_1 = require("../AnnotationViewControlBar2");
const AnnotationTagsBar_1 = require("../AnnotationTagsBar");
const ReactUtils_1 = require("../../react/ReactUtils");
const AnnotationDivider_1 = require("./AnnotationDivider");
const Image = (props) => {
    const { annotation } = props;
    const { img } = annotation;
    if (img) {
        return (React.createElement(ResponsiveImg_1.ResponsiveImg, { id: annotation.id, img: annotation.img, color: annotation.color }));
    }
    else {
        return (React.createElement("div", null, "No image"));
    }
};
exports.AreaHighlightAnnotationView2 = ReactUtils_1.deepMemo((props) => {
    const { annotation } = props;
    const key = 'area-highlight' + annotation.id;
    const borderColor = HighlightColor_1.HighlightColors.toBackgroundColor(annotation.color, 0.7);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { key: key, className: "", style: {
                paddingLeft: '8px',
                paddingRight: '5px',
                borderLeft: `4px solid ${borderColor}`
            } },
            React.createElement("div", null,
                React.createElement("div", { style: { marginTop: '5px' } },
                    React.createElement(AnnotationTagsBar_1.AnnotationTagsBar, { tags: annotation.original.tags })),
                React.createElement("div", null,
                    React.createElement(Image, Object.assign({}, props)),
                    React.createElement(AnnotationViewControlBar2_1.AnnotationViewControlBar2, { annotation: annotation })))),
        React.createElement(AnnotationDivider_1.AnnotationDivider, null)));
});
//# sourceMappingURL=AreaHighlightAnnotationView2.js.map