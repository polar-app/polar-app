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
exports.ViewOrEditComment2 = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const EditButton_1 = require("../EditButton");
const DocMetaContextProvider_1 = require("../../DocMetaContextProvider");
const CommentAnnotationView2_1 = require("./CommentAnnotationView2");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const EditComment2_1 = require("./EditComment2");
const AnnotationMutationsContext_1 = require("../../AnnotationMutationsContext");
const AnnotationActiveInputContext_1 = require("../../AnnotationActiveInputContext");
const CommentAnnotationControlBar2_1 = require("./CommentAnnotationControlBar2");
exports.ViewOrEditComment2 = React.memo((props) => {
    const { comment } = props;
    const { doc } = DocMetaContextProvider_1.useDocMetaContext();
    const annotationInputContext = AnnotationActiveInputContext_1.useAnnotationActiveInputContext();
    const annotationMutations = AnnotationMutationsContext_1.useAnnotationMutationsContext();
    const [mode, setMode] = react_1.useState('view');
    const onEdit = react_1.useCallback(() => setMode('edit'), []);
    const onCancel = react_1.useCallback(() => setMode('view'), []);
    const editButton = React.createElement(EditButton_1.EditButton, { id: 'edit-button-for-' + props.comment.id, disabled: !(doc === null || doc === void 0 ? void 0 : doc.mutable), onClick: onEdit, type: "comment" });
    const existingComment = props.comment.original;
    const commentCallback = annotationMutations.createCommentCallback(comment);
    const handleComment = React.useCallback((body) => {
        setMode('view');
        annotationInputContext.reset();
        const mutation = {
            type: 'update',
            parent: comment.parent,
            body,
            existing: comment
        };
        commentCallback(mutation);
    }, [annotationInputContext, commentCallback, comment]);
    return (React.createElement("div", { className: "p-1" },
        mode === 'view' &&
            React.createElement(CommentAnnotationView2_1.CommentAnnotationView2, { comment: props.comment, onEdit: onEdit, editButton: editButton }),
        mode === 'edit' &&
            React.createElement(EditComment2_1.EditComment2, { id: 'edit-comment-for' + props.comment.id, existingComment: existingComment, onCancel: onCancel, onComment: handleComment }),
        React.createElement(CommentAnnotationControlBar2_1.CommentAnnotationControlBar2, { comment: props.comment, onEdit: onEdit, editButton: editButton })));
}, react_fast_compare_1.default);
//# sourceMappingURL=ViewOrEditComment2.js.map