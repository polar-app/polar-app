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
exports.useContextMemo = exports.createContextMemo = void 0;
const react_1 = __importStar(require("react"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const MAX_INTEGER = 1073741823;
const ENABLED = false;
function createContextMemo(value) {
    return react_1.default.createContext(value);
}
exports.createContextMemo = createContextMemo;
function calculateChangedBitsMemo(prev, next) {
    return react_fast_compare_1.default(prev, next) ? 0 : MAX_INTEGER;
}
function useContextMemo(context) {
    return react_1.useContext(context);
}
exports.useContextMemo = useContextMemo;
//# sourceMappingURL=ContextMemo.js.map