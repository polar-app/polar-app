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
exports.FlashcardAnnotationControlBar2 = void 0;
const React = __importStar(require("react"));
const DocAnnotationMoment_1 = require("../../DocAnnotationMoment");
const DocAuthor_1 = require("../../DocAuthor");
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
const DocMetaContextProvider_1 = require("../../DocMetaContextProvider");
const AnnotationTagButton2_1 = require("../../AnnotationTagButton2");
const MUIButtonBar_1 = require("../../../mui/MUIButtonBar");
const AnnotationMutationsContext_1 = require("../../AnnotationMutationsContext");
const ReactUtils_1 = require("../../../react/ReactUtils");
const MUIDocDeleteButton_1 = require("../../../../../apps/repository/js/doc_repo/buttons/MUIDocDeleteButton");
exports.FlashcardAnnotationControlBar2 = ReactUtils_1.deepMemo((props) => {
    const { flashcard } = props;
    const { doc } = DocMetaContextProvider_1.useDocMetaContext();
    const annotationMutations = AnnotationMutationsContext_1.useAnnotationMutationsContext();
    const handleDelete = () => {
        const mutation = {
            selected: [props.flashcard]
        };
        annotationMutations.onDeleted(mutation);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: {
                display: 'flex',
                flexGrow: 1
            }, className: "pt-1 pb-1" },
            React.createElement(MUIButtonBar_1.MUIButtonBar, null,
                React.createElement(DocAuthor_1.DocAuthor, { author: flashcard.author }),
                React.createElement(DocAnnotationMoment_1.DocAnnotationMoment, { created: flashcard.created })),
            React.createElement(MUIButtonBar_1.MUIButtonBar, { key: "right-bar", style: {
                    justifyContent: 'flex-end',
                    flexGrow: 1
                } },
                props.editButton,
                React.createElement(AnnotationTagButton2_1.AnnotationTagButton2, { annotation: props.flashcard }),
                React.createElement(MUIDocDeleteButton_1.MUIDocDeleteButton, { size: "small", onClick: handleDelete }))),
        React.createElement(Divider_1.default, null)));
});
//# sourceMappingURL=FlashcardAnnotationControlBar2.js.map