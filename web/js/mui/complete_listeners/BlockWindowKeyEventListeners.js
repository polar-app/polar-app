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
exports.BlockWindowKeyEventListeners = void 0;
const React = __importStar(require("react"));
const ReactLifecycleHooks_1 = require("../../hooks/ReactLifecycleHooks");
const ReactUtils_1 = require("../../react/ReactUtils");
function useBlockWindowKeyEventListeners() {
    const handler = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        window.addEventListener('keypress', handler, { capture: true });
        window.addEventListener('keydown', handler, { capture: true });
        window.addEventListener('keyup', handler, { capture: true });
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        window.removeEventListener('keypress', handler, { capture: true });
        window.removeEventListener('keydown', handler, { capture: true });
        window.removeEventListener('keyup', handler, { capture: true });
    });
}
exports.BlockWindowKeyEventListeners = ReactUtils_1.deepMemo((props) => {
    useBlockWindowKeyEventListeners();
    return props.children;
});
//# sourceMappingURL=BlockWindowKeyEventListeners.js.map