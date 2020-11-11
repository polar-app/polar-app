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
exports.FlashcardInputForCloze = void 0;
const React = __importStar(require("react"));
const FlashcardType_1 = require("polar-shared/src/metadata/FlashcardType");
const FlashcardButtons_1 = require("./FlashcardButtons");
const FlashcardTypeSelector_1 = require("./FlashcardTypeSelector");
const RichTextArea_1 = require("../../../RichTextArea");
const FlashcardInputs_1 = require("./FlashcardInputs");
const Ranges_1 = require("../../../../highlights/text/selection/Ranges");
const FlashcardStyles_1 = require("./FlashcardStyles");
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const ClozeDeletions_1 = require("./ClozeDeletions");
const MUITooltip_1 = require("../../../../mui/MUITooltip");
const InputCompleteListener_1 = require("../../../../mui/complete_listeners/InputCompleteListener");
class FlashcardInputForCloze extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.flashcardType = FlashcardType_1.FlashcardType.CLOZE;
        this.fields = { text: "" };
        this.onCreate = this.onCreate.bind(this);
        this.state = {
            iter: 0,
        };
        this.fields = this.toFields();
    }
    render() {
        const fields = this.toFields();
        return (React.createElement("div", { id: "annotation-flashcard-box", className: "m-1" },
            React.createElement(InputCompleteListener_1.InputCompleteListener, { type: 'meta+enter', onCancel: this.props.onCancel, onComplete: () => this.onCreate() },
                React.createElement(RichTextArea_1.RichTextArea, { id: `text-${this.props.id}`, value: fields.text, defaultValue: this.props.defaultValue, autofocus: true, onKeyDown: event => this.onKeyDown(event), onRichTextMutator: richTextMutator => this.richTextMutator = richTextMutator, onChange: (html) => this.fields.text = html })),
            React.createElement("div", { style: FlashcardStyles_1.FlashcardStyles.BottomBar },
                React.createElement("div", { style: FlashcardStyles_1.FlashcardStyles.BottomBarItem },
                    React.createElement(FlashcardTypeSelector_1.FlashcardTypeSelector, { flashcardType: this.flashcardType, onChangeFlashcardType: flashcardType => this.props.onFlashcardChangeType(flashcardType) })),
                React.createElement("div", { style: FlashcardStyles_1.FlashcardStyles.BottomBarItem, className: "ml-1" },
                    React.createElement(MUITooltip_1.MUITooltip, { title: "Create cloze deletion for text" },
                        React.createElement(IconButton_1.default, { id: `button-${this.props.id}`, onClick: () => this.onClozeDelete() }, "[\u2026]"))),
                React.createElement("div", { style: {
                        display: 'flex',
                        flexGrow: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    } },
                    React.createElement(FlashcardButtons_1.FlashcardButtons, { onCancel: this.props.onCancel, existingFlashcard: this.props.existingFlashcard, onCreate: () => this.onCreate() })))));
    }
    toFields() {
        const text = FlashcardInputs_1.FlashcardInputs.fieldToString('text', this.props.existingFlashcard, this.props.defaultValue);
        return { text };
    }
    onClozeDelete() {
        const sel = window.getSelection();
        if (!sel) {
            return;
        }
        const range = sel.getRangeAt(0);
        const textNodes = Ranges_1.Ranges.getTextNodes(range);
        if (textNodes.length === 0) {
            return;
        }
        const c = ClozeDeletions_1.ClozeDeletions.next(this.fields.text);
        const prefix = document.createTextNode(`{{c${c}::`);
        const suffix = document.createTextNode('}}');
        const firstNode = textNodes[0];
        const lastNode = textNodes[textNodes.length - 1];
        firstNode.parentNode.insertBefore(prefix, firstNode);
        lastNode.parentNode.insertBefore(suffix, lastNode.nextSibling);
        sel.removeAllRanges();
        this.fields.text = this.richTextMutator.currentValue();
        this.richTextMutator.focus();
    }
    onKeyDown(event) {
        if (this.isKeyboardControlShiftC(event)) {
            this.onClozeDelete();
            event.stopPropagation();
            event.preventDefault();
        }
        if (event.getModifierState("Control") && event.key === "Enter") {
            this.onCreate();
            event.stopPropagation();
            event.preventDefault();
        }
    }
    isKeyboardControlShiftC(event) {
        return event.getModifierState("Control") &&
            event.getModifierState("Shift") &&
            event.key === "C";
    }
    onCreate() {
        if (this.props.onFlashcard) {
            this.props.onFlashcard(this.flashcardType, this.fields);
        }
        this.setState({
            iter: this.state.iter + 1
        });
    }
}
exports.FlashcardInputForCloze = FlashcardInputForCloze;
//# sourceMappingURL=FlashcardInputForCloze.js.map