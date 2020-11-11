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
exports.FlashcardButtons = void 0;
const React = __importStar(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const MUIButtonBar_1 = require("../../../../mui/MUIButtonBar");
const CancelButton_1 = require("../../CancelButton");
exports.FlashcardButtons = (props) => {
    return (React.createElement(MUIButtonBar_1.MUIButtonBar, null,
        React.createElement(CancelButton_1.CancelButton, { onClick: props.onCancel }),
        React.createElement(Button_1.default, { color: "primary", variant: "contained", onClick: () => props.onCreate() }, props.existingFlashcard ? 'Update' : 'Create')));
};
//# sourceMappingURL=FlashcardButtons.js.map