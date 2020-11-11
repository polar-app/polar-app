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
exports.createObservableStore = exports.useObservableStore = void 0;
const rxjs_1 = require("rxjs");
const react_1 = __importStar(require("react"));
const ReactLifecycleHooks_1 = require("../../hooks/ReactLifecycleHooks");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
function pick(value, keys) {
    const result = {};
    for (const key of keys) {
        result[key] = value[key];
    }
    return result;
}
function usePick(useStoreHook, keys) {
    const store = useStoreHook();
    const [value,] = react_1.default.useState(pick(store, keys));
    return value;
}
function useObservableStore(context, keys, opts) {
    const internalObservableStore = react_1.useContext(context);
    const [value, setValue] = react_1.useState(internalObservableStore.current);
    const valueRef = react_1.default.useRef(value);
    function doUpdateValue(newValue) {
        setValue(newValue);
        valueRef.current = newValue;
    }
    const subscriptionRef = react_1.default.useRef(internalObservableStore.subject.subscribe((nextValue) => {
        function debug(msg, ...args) {
            if (opts === null || opts === void 0 ? void 0 : opts.debug) {
                console.log("DEBUG: " + msg, args);
            }
        }
        if (keys) {
            debug("Using keys");
            const currValue = valueRef.current;
            const nextValuePicked = pick(nextValue, keys);
            const currValuePicked = pick(currValue, keys);
            if (!react_fast_compare_1.default(currValuePicked, nextValuePicked)) {
                debug("values are updated: ", nextValuePicked, currValuePicked);
                return doUpdateValue(nextValue);
            }
            else {
                debug("values are NOT updated: ", nextValuePicked, currValuePicked);
            }
        }
        else {
            const currValue = valueRef.current;
            if (!react_fast_compare_1.default(currValue, nextValue)) {
                return doUpdateValue(nextValue);
            }
        }
    }));
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
        }
    });
    return value;
}
exports.useObservableStore = useObservableStore;
function createInternalObservableStore(initialValue) {
    const subject = new rxjs_1.Subject();
    subject.next(initialValue);
    const store = {
        subject,
        current: initialValue
    };
    return store;
}
function createObservableStoreContext(store) {
    const context = react_1.default.createContext(store);
    return [context, store];
}
function createInitialContextValues(opts) {
    const { initialValue, mutatorFactory, callbacksFactory } = opts;
    const store = createInternalObservableStore(initialValue);
    const setStore = (value) => {
        store.current = value;
        store.subject.next(value);
    };
    const storeProvider = () => store.current;
    const mutator = mutatorFactory(storeProvider, setStore);
    const componentCallbacksFactory = () => callbacksFactory(storeProvider, setStore, mutator);
    return [store, mutator, componentCallbacksFactory, setStore];
}
function createObservableStore(opts) {
    const [store, mutator, componentCallbacksFactory, setStore] = createInitialContextValues(opts);
    const [storeContext,] = createObservableStoreContext(store);
    const useStoreHook = (keys, opts) => {
        return useObservableStore(storeContext, keys, opts);
    };
    const callbacksContext = react_1.default.createContext(componentCallbacksFactory);
    const useCallbacksHook = componentCallbacksFactory;
    const mutatorContext = react_1.default.createContext(mutator);
    const useMutatorHook = () => {
        return react_1.default.useContext(mutatorContext);
    };
    const ProviderComponent = (props) => {
        react_1.default.useMemo(() => {
            if (props.store !== undefined) {
                setStore(props.store);
            }
        }, [props.store]);
        return (react_1.default.createElement(storeContext.Provider, { value: store },
            react_1.default.createElement(callbacksContext.Provider, { value: componentCallbacksFactory },
                react_1.default.createElement(mutatorContext.Provider, { value: mutator }, props.children))));
    };
    return [ProviderComponent, useStoreHook, useCallbacksHook, useMutatorHook];
}
exports.createObservableStore = createObservableStore;
//# sourceMappingURL=ObservableStore.js.map