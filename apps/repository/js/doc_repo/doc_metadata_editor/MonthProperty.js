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
exports.MonthProperty = void 0;
const React = __importStar(require("react"));
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
const Strings_1 = require("polar-shared/src/util/Strings");
const MenuItem_1 = __importDefault(require("@material-ui/core/MenuItem"));
const Select_1 = __importDefault(require("@material-ui/core/Select"));
const FormControl_1 = __importDefault(require("@material-ui/core/FormControl"));
const InputLabel_1 = __importDefault(require("@material-ui/core/InputLabel"));
const FormHelperText_1 = __importDefault(require("@material-ui/core/FormHelperText"));
exports.MonthProperty = ReactUtils_1.deepMemo((props) => {
    const label = props.label || Strings_1.Strings.upperFirst(props.name);
    const handleChange = React.useCallback((event) => {
        props.onChange(event.target.value);
    }, [props]);
    return (React.createElement("div", { className: props.className, style: Object.assign({}, props.style) },
        React.createElement(FormControl_1.default, { style: { flexGrow: 1, display: 'flex' } },
            React.createElement(InputLabel_1.default, null, label),
            React.createElement(Select_1.default, { labelId: "demo-simple-select-label", id: "demo-simple-select", label: label, value: props.value, onChange: handleChange },
                React.createElement(MenuItem_1.default, { value: "jan" }, "January"),
                React.createElement(MenuItem_1.default, { value: "feb" }, "February"),
                React.createElement(MenuItem_1.default, { value: "mar" }, "March"),
                React.createElement(MenuItem_1.default, { value: "apr" }, "April"),
                React.createElement(MenuItem_1.default, { value: "may" }, "May"),
                React.createElement(MenuItem_1.default, { value: "jun" }, "June"),
                React.createElement(MenuItem_1.default, { value: "jul" }, "July"),
                React.createElement(MenuItem_1.default, { value: "aug" }, "August"),
                React.createElement(MenuItem_1.default, { value: "sep" }, "September"),
                React.createElement(MenuItem_1.default, { value: "oct" }, "October"),
                React.createElement(MenuItem_1.default, { value: "nov" }, "November"),
                React.createElement(MenuItem_1.default, { value: "dec" }, "December")),
            props.description !== undefined && (React.createElement("div", null,
                React.createElement(FormHelperText_1.default, null, props.description))))));
});
//# sourceMappingURL=MonthProperty.js.map