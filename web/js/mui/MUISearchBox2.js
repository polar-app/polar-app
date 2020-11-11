"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUISearchBox2 = void 0;
const react_1 = __importDefault(require("react"));
const Search_1 = __importDefault(require("@material-ui/icons/Search"));
const InputAdornment_1 = __importDefault(require("@material-ui/core/InputAdornment"));
const OutlinedInput_1 = __importDefault(require("@material-ui/core/OutlinedInput"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
exports.MUISearchBox2 = react_1.default.memo((props) => {
    const handleChange = (text) => {
        props.onChange(text);
    };
    return (react_1.default.createElement(OutlinedInput_1.default, { startAdornment: (react_1.default.createElement(InputAdornment_1.default, { position: "start" },
            react_1.default.createElement(Search_1.default, null))), margin: "dense", type: "search", autoFocus: props.autoFocus, id: props.id, style: props.style, label: props.label, value: props.value, defaultValue: props.initialValue, placeholder: props.placeholder, className: props.className, ref: props.ref, autoComplete: props.autoComplete, onChange: event => handleChange(event.currentTarget.value) }));
}, react_fast_compare_1.default);
//# sourceMappingURL=MUISearchBox2.js.map