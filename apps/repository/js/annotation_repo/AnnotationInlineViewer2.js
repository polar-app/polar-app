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
exports.AnnotationInlineViewer2 = void 0;
const React = __importStar(require("react"));
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const Typography_1 = __importDefault(require("@material-ui/core/Typography"));
const AnnotationRepoStore_1 = require("./AnnotationRepoStore");
const AnnotationActiveInputContext_1 = require("../../../../web/js/annotation_sidebar/AnnotationActiveInputContext");
const DocMetaContextProvider_1 = require("../../../../web/js/annotation_sidebar/DocMetaContextProvider");
const AnnotationView2_1 = require("../../../../web/js/annotation_sidebar/annotations/AnnotationView2");
const AnnotationInlineControlBar_1 = require("./AnnotationInlineControlBar");
const FeedbackPadding_1 = require("../ui/FeedbackPadding");
const MUIElevation_1 = require("../../../../web/js/mui/MUIElevation");
const NoAnnotationSelected = () => (React.createElement(MUIElevation_1.MUIElevation, { elevation: 2, style: {
        display: 'flex',
        flexGrow: 1,
    } },
    React.createElement(Box_1.default, { p: 1 },
        React.createElement("div", { className: "text-center" },
            React.createElement(Typography_1.default, { align: "center", variant: "h5", color: "textPrimary" }, "No annotation selected.")))));
const AnnotationSelected = React.memo((props) => {
    const { annotation } = props;
    const doc = {
        docMeta: annotation.docMeta,
        mutable: true
    };
    return (React.createElement(MUIElevation_1.MUIElevation, { elevation: 2, style: {
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column'
        } },
        React.createElement(AnnotationActiveInputContext_1.AnnotationActiveInputContextProvider, null,
            React.createElement(React.Fragment, null,
                React.createElement(DocMetaContextProvider_1.DocMetaContextProvider, { doc: doc },
                    React.createElement(React.Fragment, null,
                        React.createElement(AnnotationInlineControlBar_1.AnnotationInlineControlBar, { annotation: annotation }),
                        React.createElement(MUIElevation_1.MUIElevation, { elevation: 2 },
                            React.createElement(FeedbackPadding_1.FeedbackPadding, null,
                                React.createElement("div", { className: "mt-1" },
                                    React.createElement(AnnotationView2_1.AnnotationView2, { annotation: annotation }))))))))));
});
exports.AnnotationInlineViewer2 = React.memo(() => {
    const { selected, viewPage } = AnnotationRepoStore_1.useAnnotationRepoStore(['selected', 'viewPage']);
    const annotation = selected.length > 0 ? viewPage.filter(current => current.id === selected[0])[0] : undefined;
    return (React.createElement(React.Fragment, null, annotation ? React.createElement(AnnotationSelected, { annotation: annotation }) : React.createElement(NoAnnotationSelected, null)));
});
//# sourceMappingURL=AnnotationInlineViewer2.js.map