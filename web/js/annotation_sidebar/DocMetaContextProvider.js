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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocMetaContextProvider = exports.useDocMetaContext = exports.DocMetaContext = void 0;
const react_1 = __importStar(require("react"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const Functions_1 = require("polar-shared/src/util/Functions");
const defaultValue = {
    doc: undefined,
    setDoc: Functions_1.NULL_FUNCTION
};
exports.DocMetaContext = react_1.default.createContext(defaultValue);
function useDocMetaContext() {
    return react_1.useContext(exports.DocMetaContext);
}
exports.useDocMetaContext = useDocMetaContext;
exports.DocMetaContextProvider = react_1.default.memo((props) => {
    const [doc, setDoc] = react_1.useState(props.doc);
    return (react_1.default.createElement(exports.DocMetaContext.Provider, { value: { doc, setDoc } }, props.children));
}, react_fast_compare_1.default);
//# sourceMappingURL=DocMetaContextProvider.js.map