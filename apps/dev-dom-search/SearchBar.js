"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchBar = void 0;
const react_1 = __importDefault(require("react"));
const TextField_1 = __importDefault(require("@material-ui/core/TextField"));
exports.SearchBar = (props) => {
    const value = react_1.default.useRef("");
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            event.stopPropagation();
            event.preventDefault();
            props.onSearch(value.current);
        }
    }
    function handleChange(text) {
        value.current = text;
    }
    return (react_1.default.createElement(TextField_1.default, { label: "Enter a search: ", variant: "outlined", onChange: event => handleChange(event.currentTarget.value), onKeyPress: event => handleKeyPress(event) }));
};
//# sourceMappingURL=SearchBar.js.map