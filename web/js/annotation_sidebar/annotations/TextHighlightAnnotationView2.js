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
exports.TextHighlightAnnotationView2 = void 0;
const React = __importStar(require("react"));
const AnnotationTypes_1 = require("../../metadata/AnnotationTypes");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const HighlightColor_1 = require("polar-shared/src/metadata/HighlightColor");
const AnnotationViewControlBar2_1 = require("../AnnotationViewControlBar2");
const AnnotationTagsBar_1 = require("../AnnotationTagsBar");
const ReactUtils_1 = require("../../react/ReactUtils");
const AnnotationDivider_1 = require("./AnnotationDivider");
exports.TextHighlightAnnotationView2 = ReactUtils_1.deepMemo((props) => {
    const { annotation } = props;
    const attrType = AnnotationTypes_1.AnnotationTypes.toDataAttribute(annotation.annotationType);
    const html = Optional_1.Optional.first(annotation.html).getOrElse('');
    const key = 'text-highlight-' + annotation.id;
    const borderColor = HighlightColor_1.HighlightColors.toBackgroundColor(annotation.color, 0.7);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { key: key, "data-annotation-id": annotation.id, "data-annotation-type": attrType, "data-annotation-color": annotation.color, className: attrType, style: {
                borderLeft: `4px solid ${borderColor}`,
                paddingLeft: '8px',
                paddingRight: '5px'
            } },
            React.createElement("div", { style: {
                    display: 'flex',
                    flexDirection: 'column'
                } },
                React.createElement("div", { style: { marginTop: '5px' } },
                    React.createElement(AnnotationTagsBar_1.AnnotationTagsBar, { tags: annotation.original.tags })),
                React.createElement("div", { style: { display: 'flex' } },
                    React.createElement("div", { className: "text-sm", dangerouslySetInnerHTML: { __html: html } }),
                    React.createElement("div", null)),
                React.createElement("div", null,
                    React.createElement(AnnotationViewControlBar2_1.AnnotationViewControlBar2, { annotation: annotation })))),
        React.createElement(AnnotationDivider_1.AnnotationDivider, null)));
});
//# sourceMappingURL=TextHighlightAnnotationView2.js.map