"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPUBIFrameContextProvider = exports.useEPUBIFrameContext = void 0;
const react_1 = __importDefault(require("react"));
const ReactUtils_1 = require("../../../../../../web/js/react/ReactUtils");
const EPUBIFrameContext = react_1.default.createContext(null);
function useEPUBIFrameContext() {
    return react_1.default.useContext(EPUBIFrameContext);
}
exports.useEPUBIFrameContext = useEPUBIFrameContext;
exports.EPUBIFrameContextProvider = ReactUtils_1.deepMemo((props) => (react_1.default.createElement(EPUBIFrameContext.Provider, { value: props.element }, props.children)));
//# sourceMappingURL=EPUBIFrameContext.js.map