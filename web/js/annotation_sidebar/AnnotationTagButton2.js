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
exports.AnnotationTagButton2 = void 0;
const React = __importStar(require("react"));
const LocalOffer_1 = __importDefault(require("@material-ui/icons/LocalOffer"));
const AnnotationMutationsContext_1 = require("./AnnotationMutationsContext");
const DocMetaContextProvider_1 = require("./DocMetaContextProvider");
const ReactUtils_1 = require("../react/ReactUtils");
const StandardIconButton_1 = require("../../../apps/repository/js/doc_repo/buttons/StandardIconButton");
exports.AnnotationTagButton2 = ReactUtils_1.deepMemo((props) => {
    const { doc } = DocMetaContextProvider_1.useDocMetaContext();
    const annotationMutations = AnnotationMutationsContext_1.useAnnotationMutationsContext();
    const taggedCallback = annotationMutations.createTaggedCallback({ selected: [props.annotation] });
    return (React.createElement(StandardIconButton_1.StandardIconButton, { tooltip: "Change/set the tags on an item.", disabled: !(doc === null || doc === void 0 ? void 0 : doc.mutable), size: "small", onClick: taggedCallback },
        React.createElement(LocalOffer_1.default, null)));
});
//# sourceMappingURL=AnnotationTagButton2.js.map