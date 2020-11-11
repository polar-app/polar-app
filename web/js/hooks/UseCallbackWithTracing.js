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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCallbackWithTracing = void 0;
const React = __importStar(require("react"));
function useCallbackWithTracing(callbackName, callback, deps) {
    const iter = React.useRef(0);
    const delegate = React.useCallback(callback, [callback, ...deps]);
    return React.useMemo(() => {
        iter.current = iter.current + 1;
        const id = `${iter.current}`;
        console.log(`REACT CALLBACK CREATED: ${callbackName} with id: ${id}`);
        return (...args) => {
            console.log(`REACT CALLBACK EXECUTING: ${callbackName} with id: ${id}`);
            return delegate(...args);
        };
    }, [delegate, callbackName]);
}
exports.useCallbackWithTracing = useCallbackWithTracing;
//# sourceMappingURL=UseCallbackWithTracing.js.map