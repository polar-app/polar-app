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
exports.RichTextArea = void 0;
const React = __importStar(require("react"));
const RichTextEditor4_1 = require("../apps/card_creator/elements/schemaform/RichTextEditor4");
class RichTextArea extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        const autofocus = this.props.autofocus !== undefined ? this.props.autofocus : false;
        let label = React.createElement("label", { className: "text-muted" }, this.props.label);
        if (this.props.label === undefined) {
            label = undefined;
        }
        const Label = () => {
            if (this.props.label) {
                return (React.createElement("div", null, label));
            }
            else {
                return (React.createElement("div", null));
            }
        };
        return (React.createElement("div", { id: this.props.id, className: "rich-text-area" },
            React.createElement("div", null,
                React.createElement(Label, null),
                React.createElement("div", { className: "border rounded mb-1 rich-text-area-input" },
                    React.createElement(RichTextEditor4_1.RichTextEditor4, { id: `rich-text-area-${this.props.id}`, value: this.props.value || '', defaultValue: this.props.defaultValue, autofocus: autofocus, onKeyDown: this.props.onKeyDown, onRichTextMutator: this.props.onRichTextMutator, onChange: (html) => this.props.onChange(html) })))));
    }
}
exports.RichTextArea = RichTextArea;
//# sourceMappingURL=RichTextArea.js.map