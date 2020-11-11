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
exports.CommentAnnotationControlBar2 = void 0;
const React = __importStar(require("react"));
const DocAuthor_1 = require("../../DocAuthor");
const DocAnnotationMoment_1 = require("../../DocAnnotationMoment");
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const AnnotationTagButton2_1 = require("../../AnnotationTagButton2");
const MUIButtonBar_1 = require("../../../mui/MUIButtonBar");
const AnnotationMutationsContext_1 = require("../../AnnotationMutationsContext");
const MUIDocDeleteButton_1 = require("../../../../../apps/repository/js/doc_repo/buttons/MUIDocDeleteButton");
exports.CommentAnnotationControlBar2 = React.memo((props) => {
    const { comment } = props;
    const annotationMutations = AnnotationMutationsContext_1.useAnnotationMutationsContext();
    const handleDelete = annotationMutations.createDeletedCallback({ selected: [comment] });
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: {
                display: 'flex',
                alignItems: 'center',
            }, className: "pt-1 pb-1" },
            React.createElement(MUIButtonBar_1.MUIButtonBar, null,
                React.createElement(DocAuthor_1.DocAuthor, { author: comment.author }),
                React.createElement("div", { className: "text-muted" },
                    React.createElement(DocAnnotationMoment_1.DocAnnotationMoment, { created: comment.created }))),
            React.createElement(MUIButtonBar_1.MUIButtonBar, { style: {
                    flexGrow: 1,
                    justifyContent: 'flex-end'
                } },
                !comment.immutable && props.editButton,
                React.createElement(AnnotationTagButton2_1.AnnotationTagButton2, { annotation: props.comment }),
                React.createElement(MUIDocDeleteButton_1.MUIDocDeleteButton, { size: "small", onClick: handleDelete }))),
        React.createElement(Divider_1.default, null)));
}, react_fast_compare_1.default);
//# sourceMappingURL=CommentAnnotationControlBar2.js.map