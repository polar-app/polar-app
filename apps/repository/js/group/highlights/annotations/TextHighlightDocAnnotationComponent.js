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
exports.TextHighlightDocAnnotationComponent = void 0;
const React = __importStar(require("react"));
const AnnotationTypes_1 = require("../../../../../../web/js/metadata/AnnotationTypes");
const HighlightColor_1 = require("polar-shared/src/metadata/HighlightColor");
const TextHighlights_1 = require("../../../../../../web/js/metadata/TextHighlights");
class TextHighlightDocAnnotationComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }
    render() {
        const { props } = this;
        const { docAnnotationProfileRecord } = props;
        const docAnnotation = docAnnotationProfileRecord.value;
        const original = docAnnotation.original;
        const attrType = AnnotationTypes_1.AnnotationTypes.toDataAttribute(docAnnotation.annotationType);
        const html = TextHighlights_1.TextHighlights.toHTML(original) || "";
        const key = 'text-highlight-' + docAnnotation.id;
        const borderColor = HighlightColor_1.HighlightColors.toBackgroundColor(original.color, 0.7);
        return (React.createElement("div", { className: "m-0 mb-2" },
            React.createElement("div", { key: key, "data-annotation-id": docAnnotation.id, "data-annotation-type": attrType, "data-annotation-color": original.color, className: attrType },
                React.createElement("div", { style: { display: 'flex', flexDirection: 'column' } },
                    React.createElement("div", { style: { display: 'flex' } },
                        React.createElement("div", { className: "p-1", style: {
                                borderLeft: `5px solid ${borderColor}`
                            } }),
                        React.createElement("div", { className: "text-sm", dangerouslySetInnerHTML: { __html: html } }),
                        React.createElement("div", null)),
                    React.createElement("div", null)))));
    }
}
exports.TextHighlightDocAnnotationComponent = TextHighlightDocAnnotationComponent;
//# sourceMappingURL=TextHighlightDocAnnotationComponent.js.map