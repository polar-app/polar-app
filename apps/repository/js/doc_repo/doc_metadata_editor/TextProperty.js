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
exports.TextProperty = void 0;
const React = __importStar(require("react"));
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
const Strings_1 = require("polar-shared/src/util/Strings");
const TextField_1 = __importDefault(require("@material-ui/core/TextField"));
exports.TextProperty = ReactUtils_1.deepMemo((props) => {
    const label = props.label || Strings_1.Strings.upperFirst(props.name);
    return (React.createElement(TextField_1.default, { className: props.className, style: props.style, required: !props.optional, multiline: true, rows: 5, rowsMax: 10, label: label, defaultValue: props.value || '', helperText: props.description, onChange: event => props.onChange(event.target.value) }));
});
//# sourceMappingURL=TextProperty.js.map