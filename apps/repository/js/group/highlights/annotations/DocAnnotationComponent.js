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
exports.DocAnnotationComponent = void 0;
const React = __importStar(require("react"));
const TextHighlightDocAnnotationComponent_1 = require("./TextHighlightDocAnnotationComponent");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const AnnotationType_1 = require("polar-shared/src/metadata/AnnotationType");
const AreaHighlightDocAnnotationComponent_1 = require("./AreaHighlightDocAnnotationComponent");
const log = Logger_1.Logger.create();
class DocAnnotationComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }
    render() {
        const { docAnnotationProfileRecord } = this.props;
        const docAnnotation = docAnnotationProfileRecord.value;
        if (!Preconditions_1.isPresent(docAnnotation.id)) {
            log.warn("No annotation id!", docAnnotation);
            return;
        }
        if (docAnnotation.id.trim() === '') {
            log.warn("Empty annotation id");
            return;
        }
        const key = 'doc-annotation-' + docAnnotation.id;
        if (docAnnotation.annotationType === AnnotationType_1.AnnotationType.AREA_HIGHLIGHT) {
            return (React.createElement(AreaHighlightDocAnnotationComponent_1.AreaHighlightDocAnnotationComponent, { key: key, persistenceLayerProvider: this.props.persistenceLayerProvider, docAnnotationProfileRecord: docAnnotationProfileRecord }));
        }
        else if (docAnnotation.annotationType === AnnotationType_1.AnnotationType.TEXT_HIGHLIGHT) {
            return (React.createElement(TextHighlightDocAnnotationComponent_1.TextHighlightDocAnnotationComponent, { key: key, docAnnotationProfileRecord: docAnnotationProfileRecord }));
        }
        else {
            return React.createElement("div", null);
        }
    }
}
exports.DocAnnotationComponent = DocAnnotationComponent;
//# sourceMappingURL=DocAnnotationComponent.js.map