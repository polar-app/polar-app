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
exports.StringArrayAutocompleteProperty = void 0;
const React = __importStar(require("react"));
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
const Strings_1 = require("polar-shared/src/util/Strings");
const MUICreatableAutocomplete_1 = __importDefault(require("../../../../../web/js/mui/autocomplete/MUICreatableAutocomplete"));
const FormHelperText_1 = __importDefault(require("@material-ui/core/FormHelperText"));
exports.StringArrayAutocompleteProperty = ReactUtils_1.deepMemo((props) => {
    const options = React.useMemo(() => {
        if (props.values === undefined || props.values === null) {
            return [];
        }
        return (props.values).map(current => ({
            id: current,
            label: current,
            value: current
        }));
    }, [props]);
    const createOption = React.useCallback((label) => {
        return {
            id: label,
            label,
            value: label
        };
    }, []);
    const label = props.label || Strings_1.Strings.upperFirst(props.name);
    return (React.createElement("div", { className: props.className, style: Object.assign({}, props.style) },
        React.createElement("div", { style: { display: 'flex' } },
            React.createElement(MUICreatableAutocomplete_1.default, { options: options, label: label, style: { flexGrow: 1 }, placeholder: options.length === 0 ? label : undefined, defaultOptions: options, createOption: createOption, onChange: props.onChange })),
        props.description !== undefined && (React.createElement("div", null,
            React.createElement(FormHelperText_1.default, null, props.description)))));
});
//# sourceMappingURL=StringArrayAutocompleteProperty.js.map