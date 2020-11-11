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
exports.CreateComment2 = void 0;
const React = __importStar(require("react"));
const AnnotationMutationsContext_1 = require("../../AnnotationMutationsContext");
const AnnotationActiveInputContext_1 = require("../../AnnotationActiveInputContext");
const EditComment2_1 = require("./EditComment2");
const Refs_1 = require("polar-shared/src/metadata/Refs");
const ReactUtils_1 = require("../../../react/ReactUtils");
exports.CreateComment2 = ReactUtils_1.deepMemo((props) => {
    const { parent } = props;
    const annotationInputContext = AnnotationActiveInputContext_1.useAnnotationActiveInputContext();
    const annotationMutations = AnnotationMutationsContext_1.useAnnotationMutationsContext();
    const commentCallback = annotationMutations.createCommentCallback(parent);
    const handleComment = React.useCallback((body) => {
        annotationInputContext.reset();
        const mutation = {
            type: 'create',
            body,
            parent: Refs_1.Refs.createRef(props.parent),
        };
        commentCallback(mutation);
    }, [annotationInputContext, commentCallback, props]);
    if (annotationInputContext.active !== 'comment') {
        return null;
    }
    return (React.createElement(EditComment2_1.EditComment2, { onCancel: () => annotationInputContext.setActive('none'), onComment: handleComment }));
});
//# sourceMappingURL=CreateComment2.js.map