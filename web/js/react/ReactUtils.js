"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepMemo = exports.memoForwardRefDiv = exports.memoForwardRef = void 0;
const react_1 = __importDefault(require("react"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const DeepEquals_1 = require("../mui/DeepEquals");
var debugIsEqual = DeepEquals_1.DeepEquals.debugIsEqual;
function memoForwardRef(component) {
    return react_1.default.memo(react_1.default.forwardRef((props, ref) => component(props, ref)), react_fast_compare_1.default);
}
exports.memoForwardRef = memoForwardRef;
function memoForwardRefDiv(component) {
    return react_1.default.memo(react_1.default.forwardRef((props, ref) => component(props, ref)), react_fast_compare_1.default);
}
exports.memoForwardRefDiv = memoForwardRefDiv;
function deepMemo(component, opts = {}) {
    const equalFunc = opts.debug ? debugIsEqual : react_fast_compare_1.default;
    return react_1.default.memo(component, equalFunc);
}
exports.deepMemo = deepMemo;
//# sourceMappingURL=ReactUtils.js.map