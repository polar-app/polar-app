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
exports.AnnotationViewControlBar2 = void 0;
const React = __importStar(require("react"));
const AnnotationType_1 = require("polar-shared/src/metadata/AnnotationType");
const Comment_1 = __importDefault(require("@material-ui/icons/Comment"));
const DocAnnotationMoment_1 = require("./DocAnnotationMoment");
const DocAuthor_1 = require("./DocAuthor");
const Edit_1 = __importDefault(require("@material-ui/icons/Edit"));
const FlashOn_1 = __importDefault(require("@material-ui/icons/FlashOn"));
const MUIAnchor_1 = require("../mui/MUIAnchor");
const Functions_1 = require("polar-shared/src/util/Functions");
const AnnotationActiveInputContext_1 = require("./AnnotationActiveInputContext");
const DocMetaContextProvider_1 = require("./DocMetaContextProvider");
const ColorSelector_1 = require("../ui/colors/ColorSelector");
const AnnotationMutationsContext_1 = require("./AnnotationMutationsContext");
const AnnotationTagButton2_1 = require("./AnnotationTagButton2");
const MUIButtonBar_1 = require("../mui/MUIButtonBar");
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const core_1 = require("@material-ui/core");
const ReactUtils_1 = require("../react/ReactUtils");
const JumpToAnnotationButton_1 = require("./buttons/JumpToAnnotationButton");
const MUIDocDeleteButton_1 = require("../../../apps/repository/js/doc_repo/buttons/MUIDocDeleteButton");
const StandardIconButton_1 = require("../../../apps/repository/js/doc_repo/buttons/StandardIconButton");
const useStyles = makeStyles_1.default((theme) => core_1.createStyles({
    buttons: {
        color: theme.palette.text.secondary,
    },
}));
const ChangeTextHighlightButton = ReactUtils_1.deepMemo((props) => {
    const { annotation } = props;
    const annotationInputContext = AnnotationActiveInputContext_1.useAnnotationActiveInputContext();
    if (annotation.annotationType !== AnnotationType_1.AnnotationType.TEXT_HIGHLIGHT) {
        return null;
    }
    return (React.createElement(StandardIconButton_1.StandardIconButton, { tooltip: "Change the content of a text highlight.", disabled: !props.mutable, size: "small", onClick: () => annotationInputContext.setActive('text-highlight') },
        React.createElement(Edit_1.default, null)));
});
const CreateCommentButton = ReactUtils_1.deepMemo((props) => {
    const annotationInputContext = AnnotationActiveInputContext_1.useAnnotationActiveInputContext();
    return (React.createElement(StandardIconButton_1.StandardIconButton, { tooltip: "Create a new comment", disabled: !props.mutable, size: "small", onClick: () => annotationInputContext.setActive('comment') },
        React.createElement(Comment_1.default, null)));
});
const CreateFlashcardButton = ReactUtils_1.deepMemo((props) => {
    const annotationInputContext = AnnotationActiveInputContext_1.useAnnotationActiveInputContext();
    return (React.createElement(StandardIconButton_1.StandardIconButton, { tooltip: "Create a new flashcard", disabled: !props.mutable, size: "small", onClick: () => annotationInputContext.setActive('flashcard') },
        React.createElement(FlashOn_1.default, null)));
});
exports.AnnotationViewControlBar2 = React.memo((props) => {
    const { annotation } = props;
    const { doc } = DocMetaContextProvider_1.useDocMetaContext();
    const annotationMutations = AnnotationMutationsContext_1.useAnnotationMutationsContext();
    const classes = useStyles();
    const handleColor = annotationMutations.createColorCallback({
        selected: [annotation],
    });
    const handleDelete = annotationMutations.createDeletedCallback({
        selected: [annotation]
    });
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: { userSelect: 'none' }, className: "pt-1" },
            React.createElement("div", { style: { display: 'flex' } },
                React.createElement(MUIButtonBar_1.MUIButtonBar, null,
                    React.createElement(DocAuthor_1.DocAuthor, { author: annotation.author }),
                    React.createElement(MUIAnchor_1.MUIAnchor, { href: "#", onClick: Functions_1.NULL_FUNCTION },
                        React.createElement(DocAnnotationMoment_1.DocAnnotationMoment, { created: annotation.lastUpdated }))),
                React.createElement(MUIButtonBar_1.MUIButtonBar, { key: "right-bar", className: classes.buttons, style: {
                        justifyContent: 'flex-end',
                        flexGrow: 1
                    } },
                    React.createElement(JumpToAnnotationButton_1.JumpToAnnotationButton, { annotation: annotation }),
                    React.createElement(ChangeTextHighlightButton, { annotation: annotation, mutable: doc === null || doc === void 0 ? void 0 : doc.mutable }),
                    React.createElement(CreateCommentButton, { mutable: doc === null || doc === void 0 ? void 0 : doc.mutable }),
                    React.createElement(CreateFlashcardButton, { mutable: doc === null || doc === void 0 ? void 0 : doc.mutable }),
                    !annotation.immutable &&
                        React.createElement(ColorSelector_1.ColorSelector, { role: 'change', color: props.annotation.color || 'yellow', onSelected: (color) => handleColor({ color }) }),
                    React.createElement(AnnotationTagButton2_1.AnnotationTagButton2, { annotation: annotation }),
                    !annotation.immutable &&
                        React.createElement(MUIDocDeleteButton_1.MUIDocDeleteButton, { size: "small", onClick: handleDelete }))))));
});
//# sourceMappingURL=AnnotationViewControlBar2.js.map