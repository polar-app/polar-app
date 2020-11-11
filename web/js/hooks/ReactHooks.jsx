"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLogWhenChanged = exports.useRefValue = exports.useRefState = exports.useRefWithUpdates = exports.useRefProvider = void 0;
var React = require("react");
var deep_equal_1 = require("deep-equal");
/**
 * Calls a hook function, but then wraps it in a ref so that we can always
 * access the same version.
 *
 * This can be easier for avoiding bugs with callback hooks because we know
 * we're always accessing the current value.
 */
function useRefProvider(providerHook) {
    var value = providerHook();
    var ref = React.useRef(value);
    ref.current = value;
    return ref;
}
exports.useRefProvider = useRefProvider;
/**
 * Use a ref but update the 'current' value each time so that this could be
 * used with callbacks easier.
 */
function useRefWithUpdates(value) {
    var ref = React.useRef(value);
    ref.current = value;
    return ref;
}
exports.useRefWithUpdates = useRefWithUpdates;
/**
 * Like useState but we also use a ref with the setter function so that it's updated each time as well.
 */
function useRefState(value) {
    var _a = React.useState(value), state = _a[0], setStateDelegate = _a[1];
    var ref = React.useRef(value);
    function setState(newValue) {
        ref.current = newValue;
        setStateDelegate(newValue);
    }
    return [state, setState, ref];
}
exports.useRefState = useRefState;
/**
 * Create a ref for the value and always update it so that inner functions can see the most recent value.
 */
function useRefValue(value) {
    var ref = React.useRef(value);
    ref.current = value;
    return ref;
}
exports.useRefValue = useRefValue;
function pprint(value) {
    if (value === undefined) {
        return 'undefined';
    }
    else if (value === null) {
        return 'null';
    }
    else if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    else {
        return value.toString();
    }
}
function useLogWhenChanged(name, value) {
    var previous = React.useRef(value);
    // if (!Object.is(previous.current, value)) {
    if (!deep_equal_1.default(previous.current, value)) {
        console.log(name + " changed. Old: " + pprint(previous.current) + ", New: " + pprint(value) + " ");
        previous.current = value;
    }
}
exports.useLogWhenChanged = useLogWhenChanged;
