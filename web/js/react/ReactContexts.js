"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReactContext = void 0;
const react_1 = __importDefault(require("react"));
function createReactContext(provider) {
    const Context = react_1.default.createContext(null);
    const useContext = react_1.default.useContext(Context);
    const Provider = react_1.default.memo((props) => {
        const value = provider();
        return (react_1.default.createElement(Context.Provider, { value: value }, props.children));
    });
    return [Provider, useContext];
}
exports.createReactContext = createReactContext;
//# sourceMappingURL=ReactContexts.js.map