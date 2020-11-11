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
exports.AnnotationActiveInputContextProvider = exports.useAnnotationActiveInputContext = void 0;
const react_1 = __importStar(require("react"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const Functions_1 = require("polar-shared/src/util/Functions");
const AnnotationActiveInputContext = react_1.default.createContext({
    active: 'none',
    reset: Functions_1.NULL_FUNCTION,
    setActive: Functions_1.NULL_FUNCTION,
    createComment: Functions_1.NULL_FUNCTION,
    createFlashcard: Functions_1.NULL_FUNCTION,
    createTextHighlight: Functions_1.NULL_FUNCTION
});
function useAnnotationActiveInputContext() {
    return react_1.useContext(AnnotationActiveInputContext);
}
exports.useAnnotationActiveInputContext = useAnnotationActiveInputContext;
exports.AnnotationActiveInputContextProvider = react_1.default.memo((props) => {
    const [active, setActive] = react_1.useState('none');
    function reset() {
        setActive('none');
    }
    function createComment() {
        setActive('comment');
    }
    function createFlashcard() {
        setActive('comment');
    }
    function createTextHighlight() {
        setActive('text-highlight');
    }
    const value = react_1.useMemo(() => {
        return {
            active,
            setActive,
            reset,
            createComment,
            createFlashcard,
            createTextHighlight
        };
    }, [active]);
    return (react_1.default.createElement(AnnotationActiveInputContext.Provider, { value: value }, props.children));
}, react_fast_compare_1.default);
//# sourceMappingURL=AnnotationActiveInputContext.js.map