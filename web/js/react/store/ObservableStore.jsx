"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createObservableStore = exports.useObservableStore = void 0;
var rxjs_1 = require("rxjs");
var react_1 = require("react");
var ReactLifecycleHooks_1 = require("../../hooks/ReactLifecycleHooks");
var react_fast_compare_1 = require("react-fast-compare");
function pick(value, keys) {
    var result = {};
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        result[key] = value[key];
    }
    return result;
}
/**
 * Hook that allows us to just pick specific keys from the store.
 */
function usePick(useStoreHook, keys) {
    var store = useStoreHook();
    var value = react_1.default.useState(pick(store, keys))[0];
    return value;
}
function useObservableStore(context, keys, opts) {
    var internalObservableStore = react_1.useContext(context);
    var _a = react_1.useState(internalObservableStore.current), value = _a[0], setValue = _a[1];
    var valueRef = react_1.default.useRef(value);
    function doUpdateValue(newValue) {
        setValue(newValue);
        valueRef.current = newValue;
    }
    var subscriptionRef = react_1.default.useRef(internalObservableStore.subject.subscribe(function (nextValue) {
        function debug(msg) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (opts === null || opts === void 0 ? void 0 : opts.debug) {
                console.log("DEBUG: " + msg, args);
            }
        }
        if (keys) {
            debug("Using keys");
            // we have received an update but we're only interested in a few
            // keys so compare them.
            var currValue = valueRef.current;
            var nextValuePicked = pick(nextValue, keys);
            var currValuePicked = pick(currValue, keys);
            if (!react_fast_compare_1.default(currValuePicked, nextValuePicked)) {
                // the internal current in the context is already updated.
                debug("values are updated: ", nextValuePicked, currValuePicked);
                return doUpdateValue(nextValue);
            }
            else {
                debug("values are NOT updated: ", nextValuePicked, currValuePicked);
            }
        }
        else {
            var currValue = valueRef.current;
            if (!react_fast_compare_1.default(currValue, nextValue)) {
                // we can STILL do the lazy comparison here and only
                // update when the value has actually changed.
                return doUpdateValue(nextValue);
            }
        }
    }));
    ReactLifecycleHooks_1.useComponentWillUnmount(function () {
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
        }
    });
    // return the initial value...
    return value;
}
exports.useObservableStore = useObservableStore;
function createInternalObservableStore(initialValue) {
    var subject = new rxjs_1.Subject();
    subject.next(initialValue);
    var store = {
        subject: subject,
        current: initialValue
    };
    return store;
}
function createObservableStoreContext(store) {
    var context = react_1.default.createContext(store);
    return [context, store];
}
/**
 * Create the initial values of the components we're working with (store
 * and callbacks)
 */
function createInitialContextValues(opts) {
    var initialValue = opts.initialValue, mutatorFactory = opts.mutatorFactory, callbacksFactory = opts.callbacksFactory;
    var store = createInternalObservableStore(initialValue);
    var setStore = function (value) {
        // the current value needs to be set because we have to first update
        // the value for other components which will be created with the
        // internal value
        store.current = value;
        // now we have to send the next value which will cause the
        // subscriber to update, which will increment the state iter, and
        // cause a new render with updated data.
        store.subject.next(value);
    };
    var storeProvider = function () { return store.current; };
    var mutator = mutatorFactory(storeProvider, setStore);
    var componentCallbacksFactory = function () { return callbacksFactory(storeProvider, setStore, mutator); };
    return [store, mutator, componentCallbacksFactory, setStore];
}
function createObservableStore(opts) {
    var _a = createInitialContextValues(opts), store = _a[0], mutator = _a[1], componentCallbacksFactory = _a[2], setStore = _a[3];
    var storeContext = createObservableStoreContext(store)[0];
    var useStoreHook = function (keys, opts) {
        return useObservableStore(storeContext, keys, opts);
    };
    var callbacksContext = react_1.default.createContext(componentCallbacksFactory);
    // NOTE: the callbacksFactory should be written with EXACTLY the same
    // semantics as a react hook since it's called directly including useMemo
    // and useCallbacks
    var useCallbacksHook = componentCallbacksFactory;
    var mutatorContext = react_1.default.createContext(mutator);
    var useMutatorHook = function () {
        return react_1.default.useContext(mutatorContext);
    };
    var providerComponent = function (props) {
        react_1.default.useMemo(function () {
            // this is a hack to setStore only on the initial render and only when we have a props.store
            if (props.store !== undefined) {
                setStore(props.store);
            }
        }, [props.store]);
        return (<storeContext.Provider value={store}>
                <callbacksContext.Provider value={componentCallbacksFactory}>
                    <mutatorContext.Provider value={mutator}>
                        {props.children}
                    </mutatorContext.Provider>
                </callbacksContext.Provider>
            </storeContext.Provider>);
    };
    return [providerComponent, useStoreHook, useCallbacksHook, useMutatorHook];
}
exports.createObservableStore = createObservableStore;
