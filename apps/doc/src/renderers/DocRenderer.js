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
exports.DocRenderer = exports.useDocViewerContext = exports.DocViewerContext = void 0;
const PDFViewerContainer_1 = require("./pdf/PDFViewerContainer");
const PDFDocument_1 = require("./pdf/PDFDocument");
const React = __importStar(require("react"));
const DocViewerStore_1 = require("../DocViewerStore");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const EPUBDocument_1 = require("./epub/EPUBDocument");
const EPUBViewerContainer_1 = require("./epub/EPUBViewerContainer");
const FileTypes_1 = require("../../../../web/js/apps/main/file_loaders/FileTypes");
const EPUBFinderStore_1 = require("./epub/EPUBFinderStore");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const EPUBDocumentStore_1 = require("./epub/EPUBDocumentStore");
const PDFDocumentRenderer = (props) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(PDFViewerContainer_1.PDFViewerContainer, null),
        React.createElement(PDFDocument_1.PDFDocument, Object.assign({}, props))));
};
const EPUBDocumentRenderer = (props) => {
    return (React.createElement(EPUBDocumentStore_1.EPUBDocumentStoreProvider, null,
        React.createElement(EPUBFinderStore_1.EPUBFinderProvider, null,
            React.createElement(React.Fragment, null,
                React.createElement(EPUBViewerContainer_1.EPUBViewerContainer, null,
                    React.createElement(EPUBDocument_1.EPUBDocument, Object.assign({}, props)))))));
};
exports.DocViewerContext = React.createContext(null);
function useDocViewerContext() {
    const result = React.useContext(exports.DocViewerContext);
    if (!Preconditions_1.isPresent(result)) {
        throw new Error("DocViewerContext not defined.");
    }
    return result;
}
exports.useDocViewerContext = useDocViewerContext;
const DocRendererDelegate = React.memo((props) => {
    switch (props.fileType) {
        case "pdf":
            return (React.createElement(PDFDocumentRenderer, { docURL: props.docURL, docMeta: props.docMeta }, props.children));
        case "epub":
            return (React.createElement(EPUBDocumentRenderer, { docURL: props.docURL, docMeta: props.docMeta }, props.children));
        default:
            return null;
    }
});
exports.DocRenderer = React.memo((props) => {
    const { docURL, docMeta } = DocViewerStore_1.useDocViewerStore(['docURL', 'docMeta']);
    if (!docURL || !docMeta) {
        return null;
    }
    const fileType = FileTypes_1.FileTypes.create(docURL);
    return (React.createElement(DocRendererDelegate, { docURL: docURL, docMeta: docMeta, fileType: fileType }, props.children));
}, react_fast_compare_1.default);
//# sourceMappingURL=DocRenderer.js.map