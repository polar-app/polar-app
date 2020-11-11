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
exports.FlashcardInput = void 0;
const React = __importStar(require("react"));
const FlashcardType_1 = require("polar-shared/src/metadata/FlashcardType");
const FlashcardInputForCloze_1 = require("./FlashcardInputForCloze");
const FlashcardInputForFrontAndBack_1 = require("./FlashcardInputForFrontAndBack");
class FlashcardInput extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onFlashcard = this.onFlashcard.bind(this);
        this.state = {
            iter: 0,
            flashcardType: this.props.flashcardType || this.defaultFlashcardType()
        };
    }
    render() {
        if (this.state.flashcardType === FlashcardType_1.FlashcardType.BASIC_FRONT_BACK) {
            return (React.createElement(FlashcardInputForFrontAndBack_1.FlashcardInputForFrontAndBack, { id: this.props.id, onCancel: this.props.onCancel, existingFlashcard: this.props.existingFlashcard, defaultValue: this.props.defaultValue, onFlashcard: (flashcardType, fields) => this.onFlashcard(flashcardType, fields), onFlashcardChangeType: flashcardType => this.onFlashcardChangeType(flashcardType) }));
        }
        else {
            return (React.createElement(FlashcardInputForCloze_1.FlashcardInputForCloze, { id: this.props.id, onCancel: this.props.onCancel, existingFlashcard: this.props.existingFlashcard, defaultValue: this.props.defaultValue, onFlashcard: (flashcardType, fields) => this.onFlashcard(flashcardType, fields), onFlashcardChangeType: flashcardType => this.onFlashcardChangeType(flashcardType) }));
        }
    }
    onFlashcardChangeType(flashcardType) {
        this.setState(Object.assign(Object.assign({}, this.state), { flashcardType }));
        this.setDefaultFlashcardType(flashcardType);
    }
    defaultFlashcardType() {
        const defaultFlashcardType = window.localStorage.getItem('default-flashcard-type');
        switch (defaultFlashcardType) {
            case FlashcardType_1.FlashcardType.BASIC_FRONT_BACK:
                return FlashcardType_1.FlashcardType.BASIC_FRONT_BACK;
            case FlashcardType_1.FlashcardType.CLOZE:
                return FlashcardType_1.FlashcardType.CLOZE;
            default:
                return FlashcardType_1.FlashcardType.BASIC_FRONT_BACK;
        }
    }
    setDefaultFlashcardType(flashcardType) {
        localStorage.setItem('default-flashcard-type', flashcardType);
    }
    onFlashcard(flashcardType, fields) {
        this.props.onFlashcard(flashcardType, fields, this.props.existingFlashcard);
        this.setState({
            iter: this.state.iter + 1
        });
    }
}
exports.FlashcardInput = FlashcardInput;
//# sourceMappingURL=FlashcardInput.js.map