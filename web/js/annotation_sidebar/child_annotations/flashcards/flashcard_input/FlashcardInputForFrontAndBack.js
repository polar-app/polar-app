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
exports.FlashcardInputForFrontAndBack = void 0;
const React = __importStar(require("react"));
const FlashcardType_1 = require("polar-shared/src/metadata/FlashcardType");
const FlashcardButtons_1 = require("./FlashcardButtons");
const FlashcardTypeSelector_1 = require("./FlashcardTypeSelector");
const RichTextArea_1 = require("../../../RichTextArea");
const FlashcardInputs_1 = require("./FlashcardInputs");
const InputCompleteListener_1 = require("../../../../mui/complete_listeners/InputCompleteListener");
class FlashcardInputForFrontAndBack extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.flashcardType = FlashcardType_1.FlashcardType.BASIC_FRONT_BACK;
        this.fields = { front: "", back: "" };
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
                React.createElement(React.Fragment, null,
                    React.createElement(RichTextArea_1.RichTextArea, { label: "front", id: `front-${this.props.id}`, value: fields.front, autofocus: true, onKeyDown: event => this.onKeyDown(event), onChange: (html) => this.fields.front = html }),
                    React.createElement(RichTextArea_1.RichTextArea, { label: "back", id: `back-${this.props.id}`, value: fields.back, onKeyDown: event => this.onKeyDown(event), onChange: (html) => this.fields.back = html }))),
            React.createElement("div", { style: {
                    display: 'flex',
                    alignItems: 'center'
                } },
                React.createElement("div", { style: { flexGrow: 1 } },
                    React.createElement(FlashcardTypeSelector_1.FlashcardTypeSelector, { flashcardType: this.flashcardType, onChangeFlashcardType: flashcardType => this.props.onFlashcardChangeType(flashcardType) })),
                React.createElement("div", null,
                    React.createElement(FlashcardButtons_1.FlashcardButtons, { onCancel: this.props.onCancel, existingFlashcard: this.props.existingFlashcard, onCreate: () => this.onCreate() })))));
    }
    toFields() {
        const front = FlashcardInputs_1.FlashcardInputs.fieldToString('front', this.props.existingFlashcard);
        const back = FlashcardInputs_1.FlashcardInputs.fieldToString('back', this.props.existingFlashcard, this.props.defaultValue);
        return { front, back };
    }
    onKeyDown(event) {
        if (event.getModifierState("Control") && event.key === "Enter") {
            this.onCreate();
        }
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
exports.FlashcardInputForFrontAndBack = FlashcardInputForFrontAndBack;
//# sourceMappingURL=FlashcardInputForFrontAndBack.js.map