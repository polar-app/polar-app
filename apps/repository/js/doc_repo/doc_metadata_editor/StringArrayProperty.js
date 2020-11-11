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
exports.StringArrayProperty = void 0;
const React = __importStar(require("react"));
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
const TextField_1 = __importDefault(require("@material-ui/core/TextField/TextField"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const Strings_1 = require("polar-shared/src/util/Strings");
exports.StringArrayProperty = ReactUtils_1.deepMemo((props) => {
    const values = React.useMemo(() => props.values || [], [props.values]);
    const handleUpdate = React.useCallback((values) => {
        const newDocInfo = Dictionaries_1.Dictionaries.deepCopy(props.docInfo);
        newDocInfo[props.name] = values.filter(current => current.trim() !== '');
        props.onUpdate(newDocInfo);
    }, [props]);
    const handleAddValue = React.useCallback(() => {
        handleUpdate([...values, '']);
    }, [handleUpdate, values]);
    const handleUpdatedValue = React.useCallback((value, idx) => {
        const newValues = [...values];
        newValues[idx] = value;
        handleUpdate(newValues);
    }, [handleUpdate, values]);
    const label = props.label || Strings_1.Strings.upperFirst(props.name);
    return (React.createElement("div", { className: props.className, style: Object.assign(Object.assign({}, props.style), { display: 'flex', flexDirection: 'column' }) },
        values.map((current, idx) => {
            return (React.createElement(Box_1.default, { key: idx, mb: 1, style: { display: 'flex' } },
                React.createElement(TextField_1.default, { required: false, style: { flexGrow: 1 }, label: idx === 0 ? label : undefined, defaultValue: current || '', onChange: event => handleUpdatedValue(event.target.value, idx) })));
        }),
        React.createElement("div", { style: { textAlign: 'right' } },
            React.createElement(Button_1.default, { variant: "contained", size: "small", onClick: handleAddValue }, "Add"))));
});
//# sourceMappingURL=StringArrayProperty.js.map