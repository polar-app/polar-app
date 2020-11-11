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
exports.JumpToAnnotationButton = void 0;
const React = __importStar(require("react"));
const ReactUtils_1 = require("../../react/ReactUtils");
const AnnotationType_1 = require("polar-shared/src/metadata/AnnotationType");
const CenterFocusStrong_1 = __importDefault(require("@material-ui/icons/CenterFocusStrong"));
const JumpToAnnotationHook_1 = require("../JumpToAnnotationHook");
const StandardIconButton_1 = require("../../../../apps/repository/js/doc_repo/buttons/StandardIconButton");
exports.JumpToAnnotationButton = ReactUtils_1.memoForwardRef((props) => {
    const jumpToAnnotationHandler = JumpToAnnotationHook_1.useJumpToAnnotationHandler();
    const { annotation } = props;
    if (![AnnotationType_1.AnnotationType.TEXT_HIGHLIGHT, AnnotationType_1.AnnotationType.AREA_HIGHLIGHT].includes(annotation.annotationType)) {
        return null;
    }
    const handleJumpToCurrentAnnotation = () => {
        const ptr = {
            target: annotation.id,
            pageNum: annotation.pageNum,
            docID: annotation.docMetaRef.id,
        };
        jumpToAnnotationHandler(ptr);
    };
    return (React.createElement(StandardIconButton_1.StandardIconButton, { tooltip: "Jump to the current annotation in the page.", size: "small", onClick: handleJumpToCurrentAnnotation },
        React.createElement(CenterFocusStrong_1.default, null)));
});
//# sourceMappingURL=JumpToAnnotationButton.js.map