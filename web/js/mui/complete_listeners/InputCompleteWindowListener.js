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
exports.InputCompleteWindowListener = exports.isInputCompleteEvent = void 0;
const React = __importStar(require("react"));
const ReactLifecycleHooks_1 = require("../../hooks/ReactLifecycleHooks");
const ReactUtils_1 = require("../../react/ReactUtils");
function isInputCompleteEvent(event) {
    return (event.ctrlKey || event.metaKey) && event.key === 'Enter';
}
exports.isInputCompleteEvent = isInputCompleteEvent;
function useInputCompleteWindowListener(opts) {
    const onKeyDown = React.useCallback((event) => {
        if (isInputCompleteEvent(event)) {
            opts.onComplete();
        }
        if (event.key === 'Escape' && opts.onCancel) {
            opts.onCancel();
        }
        console.log("FIXME1: blocking key binding");
        event.preventDefault();
        event.stopPropagation();
    }, []);
    const stopPropagationHandler = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        document.addEventListener('keydown', onKeyDown, { capture: true });
        document.addEventListener('keyup', stopPropagationHandler, { capture: true });
        document.addEventListener('keypress', stopPropagationHandler, { capture: true });
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        document.removeEventListener('keydown', onKeyDown, { capture: true });
        document.removeEventListener('keypress', stopPropagationHandler, { capture: true });
        document.removeEventListener('keyup', stopPropagationHandler, { capture: true });
        window.blur();
        window.focus();
    });
}
exports.InputCompleteWindowListener = ReactUtils_1.deepMemo((props) => {
    useInputCompleteWindowListener({
        onComplete: props.onComplete,
        onCancel: props.onCancel
    });
    return props.children;
});
//# sourceMappingURL=InputCompleteWindowListener.js.map