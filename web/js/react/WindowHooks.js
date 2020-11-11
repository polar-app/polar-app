"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWindowResizeEventListener = exports.useWindowScrollEventListener = exports.useWindowEventListener = void 0;
const react_1 = __importDefault(require("react"));
const ReactLifecycleHooks_1 = require("../hooks/ReactLifecycleHooks");
function useWindowEventListener(name, delegate, opts = {}) {
    const winRef = react_1.default.useRef(opts.win || window);
    const listenerOpts = {
        capture: true,
        passive: true
    };
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        winRef.current.addEventListener(name, delegate, listenerOpts);
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        if (winRef.current) {
            winRef.current.removeEventListener(name, delegate, listenerOpts);
        }
        else {
            console.warn("No window ref");
        }
    });
}
exports.useWindowEventListener = useWindowEventListener;
function useWindowScrollEventListener(delegate, opts = {}) {
    useWindowEventListener('scroll', delegate, opts);
}
exports.useWindowScrollEventListener = useWindowScrollEventListener;
function useWindowResizeEventListener(delegate, opts = {}) {
    useWindowEventListener('resize', delegate, opts);
}
exports.useWindowResizeEventListener = useWindowResizeEventListener;
//# sourceMappingURL=WindowHooks.js.map