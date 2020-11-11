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
exports.AreaHighlightDocAnnotationComponent = void 0;
const React = __importStar(require("react"));
const HighlightColor_1 = require("polar-shared/src/metadata/HighlightColor");
const ResponsiveImg_1 = require("../../../../../../web/js/annotation_sidebar/ResponsiveImg");
const DocFileResolvers_1 = require("../../../../../../web/js/datastore/DocFileResolvers");
const Images_1 = require("../../../../../../web/js/metadata/Images");
const Image = (props) => {
    const { docAnnotationProfileRecord, persistenceLayerProvider } = props;
    const docAnnotation = docAnnotationProfileRecord.value;
    const areaHighlight = docAnnotation.original;
    const docFileResolver = DocFileResolvers_1.DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider);
    const img = Images_1.Images.toImg(docFileResolver, areaHighlight.image);
    if (img) {
        return (React.createElement(ResponsiveImg_1.ResponsiveImg, { id: areaHighlight.id, img: img, color: areaHighlight.color }));
    }
    else {
        return (React.createElement("div", null, "No image"));
    }
};
class AreaHighlightDocAnnotationComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }
    render() {
        const { props } = this;
        const { docAnnotationProfileRecord } = props;
        const docAnnotation = docAnnotationProfileRecord.value;
        const areaHighlight = docAnnotation.original;
        const key = 'area-highlight' + docAnnotation.id;
        const borderColor = HighlightColor_1.HighlightColors.toBackgroundColor(areaHighlight.color, 0.7);
        return (React.createElement("div", { key: key, className: 'p-1' },
            React.createElement("div", { style: {
                    borderLeft: `5px solid ${borderColor}`
                } },
                React.createElement(Image, { persistenceLayerProvider: this.props.persistenceLayerProvider, docAnnotationProfileRecord: docAnnotationProfileRecord }))));
    }
}
exports.AreaHighlightDocAnnotationComponent = AreaHighlightDocAnnotationComponent;
//# sourceMappingURL=AreaHighlightDocAnnotationComponent.js.map