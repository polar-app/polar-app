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
exports.SharedStateTest = void 0;
const react_1 = __importStar(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const DeepEquals_1 = require("../../js/mui/DeepEquals");
var debugIsEqual = DeepEquals_1.DeepEquals.debugIsEqual;
const ChildComponent = react_1.default.memo((props) => {
    const value = props.value;
    console.log("ChildComponent: render");
    return (react_1.default.createElement(react_1.default.Fragment, null,
        "value is: ",
        value,
        react_1.default.createElement(Button_1.default, { variant: "contained", color: "primary", onClick: () => props.setValue(value + 1) }, "Update")));
}, debugIsEqual);
exports.SharedStateTest = () => {
    const [state, setState] = react_1.useState(1);
    const setValue = react_1.useCallback((value) => setState(value), []);
    console.log("SharedStateTest: render");
    return (react_1.default.createElement(ChildComponent, { value: state, setValue: setValue }));
};
//# sourceMappingURL=SharedStateTest.js.map