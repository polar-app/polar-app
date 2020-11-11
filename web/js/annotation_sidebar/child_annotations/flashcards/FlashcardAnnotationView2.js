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
exports.FlashcardAnnotationView2 = void 0;
const React = __importStar(require("react"));
const Card_1 = __importDefault(require("@material-ui/core/Card"));
const CardContent_1 = __importDefault(require("@material-ui/core/CardContent"));
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
const FlashcardAnnotationControlBar2_1 = require("./FlashcardAnnotationControlBar2");
const ReactUtils_1 = require("../../../react/ReactUtils");
const RenderFrontAndBackFields = ReactUtils_1.deepMemo((props) => {
    const { flashcard } = props;
    return (React.createElement(Card_1.default, { variant: "outlined" },
        React.createElement(CardContent_1.default, null,
            React.createElement("div", { className: "pb-2" },
                React.createElement("span", { dangerouslySetInnerHTML: { __html: flashcard.fields.front } })),
            React.createElement(Divider_1.default, null),
            React.createElement("div", { className: "pt-2" },
                React.createElement("span", { dangerouslySetInnerHTML: { __html: flashcard.fields.back } })))));
});
const RenderClozeFields = ReactUtils_1.deepMemo((props) => {
    const { flashcard } = props;
    return (React.createElement(Card_1.default, { variant: "outlined" },
        React.createElement(CardContent_1.default, null,
            React.createElement("span", { dangerouslySetInnerHTML: { __html: flashcard.fields.text } }))));
});
const RenderFields = ReactUtils_1.deepMemo((props) => {
    const { flashcard } = props;
    if (flashcard.fields.text) {
        return (React.createElement(RenderClozeFields, Object.assign({}, props)));
    }
    else {
        return (React.createElement(RenderFrontAndBackFields, Object.assign({}, props)));
    }
});
exports.FlashcardAnnotationView2 = ReactUtils_1.deepMemo(React.forwardRef((props, ref) => {
    const { flashcard } = props;
    const key = 'comment-' + flashcard.id;
    return (React.createElement("div", { key: key, className: 'p-1' },
        React.createElement("div", { className: "" },
            React.createElement("div", null,
                React.createElement(RenderFields, Object.assign({}, props)))),
        React.createElement(FlashcardAnnotationControlBar2_1.FlashcardAnnotationControlBar2, { flashcard: flashcard, editButton: props.editButton, onEdit: props.onEdit })));
}));
//# sourceMappingURL=FlashcardAnnotationView2.js.map