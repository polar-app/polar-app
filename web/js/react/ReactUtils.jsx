"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepMemo = exports.memoForwardRefDiv = exports.memoForwardRef = void 0;
var react_1 = require("react");
var react_fast_compare_1 = require("react-fast-compare");
var DeepEquals_1 = require("../mui/DeepEquals");
var debugIsEqual = DeepEquals_1.DeepEquals.debugIsEqual;
/**
 * React.memo and React.forwardRef all in one function with deep isEqual support
 * for ease of use.
 */
function memoForwardRef(component) {
    return react_1.default.memo(react_1.default.forwardRef(function (props, ref) { return component(props, ref); }), react_fast_compare_1.default);
}
exports.memoForwardRef = memoForwardRef;
function memoForwardRefDiv(component) {
    return react_1.default.memo(react_1.default.forwardRef(function (props, ref) { return component(props, ref); }), react_fast_compare_1.default);
}
exports.memoForwardRefDiv = memoForwardRefDiv;
/**
 *
 * @param component The component to render
 * @param opts The opts for rendering the component
 */
function deepMemo(component, opts) {
    if (opts === void 0) { opts = {}; }
    var equalFunc = opts.debug ? debugIsEqual : react_fast_compare_1.default;
    return react_1.default.memo(component, equalFunc);
}
exports.deepMemo = deepMemo;
