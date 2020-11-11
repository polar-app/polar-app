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
exports.useCaptureSizeCalculator = exports.CaptureSizeContainer = void 0;
const React = __importStar(require("react"));
const Context = React.createContext(undefined);
exports.CaptureSizeContainer = (props) => {
    const [mounted, setMounted] = React.useState(false);
    const elementRef = React.useRef();
    const handleRef = React.useCallback((element) => {
        elementRef.current = element;
        setMounted(true);
    }, []);
    const calculator = React.useCallback(() => {
        const width = elementRef.current.clientWidth;
        const height = elementRef.current.clientHeight;
        return {
            width, height
        };
    }, []);
    return (React.createElement(Context.Provider, { value: calculator },
        React.createElement("div", { ref: handleRef, style: props.style, className: props.className }, mounted && props.children)));
};
function useCaptureSizeCalculator() {
    return React.useContext(Context);
}
exports.useCaptureSizeCalculator = useCaptureSizeCalculator;
//# sourceMappingURL=CaptureSizeContainer.js.map