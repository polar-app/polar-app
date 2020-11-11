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
exports.AnnotationSidebar2 = void 0;
const React = __importStar(require("react"));
const Paper_1 = __importDefault(require("@material-ui/core/Paper"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const AnnotationView2_1 = require("./annotations/AnnotationView2");
const AnnotationSidebarStore_1 = require("../../../apps/doc/src/AnnotationSidebarStore");
const AnnotationActiveInputContext_1 = require("./AnnotationActiveInputContext");
const AnnotationSidebarHeader_1 = require("./AnnotationSidebarHeader");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const ReactUtils_1 = require("../react/ReactUtils");
const FeedbackPadding_1 = require("../../../apps/repository/js/ui/FeedbackPadding");
const LoadRepositoryExplainer = () => (React.createElement("div", { className: "p-2 text-center" },
    React.createElement("h2", { className: "text-muted mb-3" }, "Click below for your personal repository"),
    React.createElement("a", { href: "https://app.getpolarized.io" },
        React.createElement("img", { alt: "Annotation Sidebar", className: "img-shadow img-fluid shadow", src: "https://getpolarized.io/assets/screenshots/2019-11-document-view.png" })),
    React.createElement("div", { className: "mt-3 mb-3" },
        React.createElement("a", { href: "https://app.getpolarized.io" },
            React.createElement(Button_1.default, { size: "large", variant: "contained", color: "primary" }, "Load My Doc Repository")))));
const NoAnnotations = ReactUtils_1.memoForwardRef(() => {
    return (React.createElement("div", { className: "p-2", style: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1
        } },
        React.createElement("div", { style: { flexGrow: 1 } },
            React.createElement("h2", { className: "text-center text-muted text-xxl" }, "No Annotations"),
            React.createElement("p", { className: "text-muted", style: { fontSize: '16px' } }, "No annotations have yet been created. To create new annotations create a new highlight by selecting text in the document."),
            React.createElement("p", { className: "text-muted", style: { fontSize: '16px' } }, "The highlight will then be shown here and you can then easily attach comments and flashcards to it directly."))));
});
const AnnotationSidebarItem = ReactUtils_1.memoForwardRef((props) => {
    const { annotation } = props;
    return (React.createElement(AnnotationActiveInputContext_1.AnnotationActiveInputContextProvider, null,
        React.createElement(React.Fragment, null,
            React.createElement(React.Fragment, null,
                React.createElement(AnnotationView2_1.AnnotationView2, { annotation: annotation })))));
});
const AnnotationsBlock = React.memo(() => {
    const store = AnnotationSidebarStore_1.useAnnotationSidebarStore(['view']);
    if (store.view.length > 0) {
        return (React.createElement(React.Fragment, null, store.view.map(annotation => (React.createElement(AnnotationSidebarItem, { key: annotation.id, annotation: annotation })))));
    }
    else {
        return React.createElement(NoAnnotations, null);
    }
});
const Annotations = React.memo(() => {
    return (React.createElement(Paper_1.default, { square: true, elevation: 0, className: "pb-1 pt-1", style: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto'
        } },
        React.createElement(FeedbackPadding_1.FeedbackPadding, null,
            React.createElement(AnnotationsBlock, null))));
});
exports.AnnotationSidebar2 = React.memo(() => {
    return (React.createElement("div", { id: "annotation-manager", className: "annotation-sidebar", style: {
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            flexGrow: 1
        } },
        React.createElement(AnnotationSidebarHeader_1.AnnotationHeader, null),
        React.createElement(Annotations, null)));
}, react_fast_compare_1.default);
//# sourceMappingURL=AnnotationSidebar2.js.map