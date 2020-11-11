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
exports.MyContextStoreComponent = exports.useMyContextStore = exports.createContextStore = exports.createStore = void 0;
const react_1 = __importStar(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
function createStore(initialValue) {
    const [state] = react_1.useState(() => {
        return { current: initialValue };
    });
    const [iter, setIter] = react_1.useState(0);
    const setState = react_1.useCallback((newState) => {
        state.current = newState;
        setIter(Date.now());
    }, [state]);
    return [state, setState];
}
exports.createStore = createStore;
function createContextStore(initialValue) {
    return react_1.createContext(undefined);
}
exports.createContextStore = createContextStore;
const MyCallbacks = () => {
};
const MyContextStore = createContextStore({ alice: 'no', bob: 'no', carol: 'no' });
function useMyContextStore() {
    return react_1.useContext(MyContextStore);
}
exports.useMyContextStore = useMyContextStore;
const MyActionsComponent = () => {
    var _a;
    const store = useMyContextStore();
    const value = store === null || store === void 0 ? void 0 : store[0];
    const setValue = store === null || store === void 0 ? void 0 : store[1];
    const computeNewValue = (invitations) => {
        return Object.assign(Object.assign({}, invitations), { alice: invitations.alice === 'yes' ? 'no' : 'yes' });
    };
    return (react_1.default.createElement("div", null,
        "hello world:",
        value && setValue && (react_1.default.createElement("div", null,
            "alice: ", (_a = value.current) === null || _a === void 0 ? void 0 :
            _a.alice,
            react_1.default.createElement(Button_1.default, { variant: "contained", onClick: () => setValue(computeNewValue(value.current)) }, "toggle")))));
};
exports.MyContextStoreComponent = () => {
    console.log("MyContextStoreComponent: rendering");
    const store = createStore({
        alice: 'yes',
        bob: 'yes',
        carol: 'yes'
    });
    return (react_1.default.createElement(MyContextStore.Provider, { value: store },
        react_1.default.createElement(MyActionsComponent, null)));
};
//# sourceMappingURL=ContextStore.js.map