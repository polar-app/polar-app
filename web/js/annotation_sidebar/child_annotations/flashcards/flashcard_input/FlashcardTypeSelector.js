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
exports.FlashcardTypeSelector = void 0;
const React = __importStar(require("react"));
const FlashcardType_1 = require("polar-shared/src/metadata/FlashcardType");
const MenuItem_1 = __importDefault(require("@material-ui/core/MenuItem"));
const Select_1 = __importDefault(require("@material-ui/core/Select"));
class FlashcardTypeSelector extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }
    render() {
        return (React.createElement(Select_1.default, { labelId: "demo-simple-select-helper-label", id: "demo-simple-select-helper", value: this.props.flashcardType, onChange: event => this.props.onChangeFlashcardType(event.target.value) },
            React.createElement(MenuItem_1.default, { value: FlashcardType_1.FlashcardType.BASIC_FRONT_BACK }, "Front and back"),
            React.createElement(MenuItem_1.default, { value: FlashcardType_1.FlashcardType.CLOZE }, "Cloze")));
    }
}
exports.FlashcardTypeSelector = FlashcardTypeSelector;
//# sourceMappingURL=FlashcardTypeSelector.js.map