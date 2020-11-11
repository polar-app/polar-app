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
exports.createRXJSStore = void 0;
const React = __importStar(require("react"));
const rxjs_1 = require("rxjs");
const ReactHooks_1 = require("../../hooks/ReactHooks");
const ReactLifecycleHooks_1 = require("../../hooks/ReactLifecycleHooks");
function createInternalObservableStore(initialValue) {
    const subject = new rxjs_1.Subject();
    subject.next(initialValue);
    const store = {
        subject,
        current: initialValue
    };
    return store;
}
function createRXJSStore() {
    const Context = React.createContext(null);
    const useSetStore = () => {
        const context = React.useContext(Context);
        return (value) => {
            context.current = value;
            context.subject.next(value);
        };
    };
    const useStoreListener = () => {
        const context = React.useContext(Context);
        const [state, setState] = React.useState(context.current);
        const subscriptionRef = React.useRef(context.subject.subscribe((nextValue) => {
            setState(nextValue);
        }));
        ReactLifecycleHooks_1.useComponentWillUnmount(() => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
        });
        return state;
    };
    const Provider = ReactHooks_1.typedMemo((props) => {
        const store = React.useMemo(() => createInternalObservableStore(props.initialValue), [props.initialValue]);
        return (React.createElement(Context.Provider, { value: store }, props.children));
    });
    return [Provider, useSetStore, useStoreListener];
}
exports.createRXJSStore = createRXJSStore;
//# sourceMappingURL=RXJSStore.js.map