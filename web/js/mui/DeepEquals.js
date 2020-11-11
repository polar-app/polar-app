"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepEquals = void 0;
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
var DeepEquals;
(function (DeepEquals) {
    function debug(a, b) {
        console.log('=== comparing values: ', a, b);
        if (!react_fast_compare_1.default(Object.keys(a), Object.keys(b))) {
            console.log("keys differ: ", Object.keys(a), Object.keys(b));
            return;
        }
        const keys = Object.keys(a);
        let broken = false;
        console.log("Comparing keys: ", keys);
        for (const key of keys) {
            if (!react_fast_compare_1.default(a[key], b[key])) {
                console.log(`values for key: ${key} differ: `, a[key], b[key]);
                broken = true;
            }
        }
        if (!broken) {
            console.log("objects are equal");
        }
    }
    DeepEquals.debug = debug;
    function debugIsEqual(a, b) {
        debug(a, b);
        return react_fast_compare_1.default(a, b);
    }
    DeepEquals.debugIsEqual = debugIsEqual;
})(DeepEquals = exports.DeepEquals || (exports.DeepEquals = {}));
//# sourceMappingURL=DeepEquals.js.map