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
exports.EditTextHighlight2 = void 0;
const React = __importStar(require("react"));
const CancelButton_1 = require("../CancelButton");
const RichTextArea_1 = require("../../RichTextArea");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const AnnotationMutationsContext_1 = require("../../AnnotationMutationsContext");
const AnnotationActiveInputContext_1 = require("../../AnnotationActiveInputContext");
const InputCompleteListener_1 = require("../../../mui/complete_listeners/InputCompleteListener");
exports.EditTextHighlight2 = (props) => {
    const { annotation } = props;
    const htmlRef = React.useRef(props.html);
    const annotationInputContext = AnnotationActiveInputContext_1.useAnnotationActiveInputContext();
    const annotationMutations = AnnotationMutationsContext_1.useAnnotationMutationsContext();
    if (annotationInputContext.active !== 'text-highlight') {
        return null;
    }
    function handleKeyDown(event) {
        if (event.getModifierState("Control") && event.key === "Enter") {
            this.props.onChanged(this.html);
        }
    }
    function handleRevert() {
        annotationInputContext.reset();
        const mutation = {
            selected: [annotation],
            type: 'revert',
        };
        annotationMutations.onTextHighlight(mutation);
    }
    function handleChange(body) {
        annotationInputContext.reset();
        const mutation = {
            selected: [annotation],
            type: 'update',
            body
        };
        annotationMutations.onTextHighlight(mutation);
    }
    function onComplete() {
        handleChange(htmlRef.current);
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "m-1" },
            React.createElement(InputCompleteListener_1.InputCompleteListener, { type: 'meta+enter', onComplete: onComplete },
                React.createElement(RichTextArea_1.RichTextArea, { id: props.id, defaultValue: props.html, autofocus: true, onKeyDown: handleKeyDown, onChange: (html) => htmlRef.current = html })),
            React.createElement("div", { style: {
                    display: 'flex',
                    justifyContent: 'flex-end'
                } },
                React.createElement(CancelButton_1.CancelButton, { onClick: annotationInputContext.reset }),
                React.createElement(Button_1.default, { onClick: handleRevert }, "Revert"),
                React.createElement(Button_1.default, { color: "primary", variant: "contained", onClick: onComplete }, "Change")))));
};
//# sourceMappingURL=EditTextHighlight2.js.map