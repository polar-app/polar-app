import * as React from "react";
import deepEqual from "deep-equal";

/**
 * Calls a hook function, but then wraps it in a ref so that we can always
 * access the same version.
 *
 * This can be easier for avoiding bugs with callback hooks because we know
 * we're always accessing the current value.
 */
export function useRefProvider<T>(providerHook: () => T) {
    const value = providerHook();
    const ref = React.useRef<T>(value);
    ref.current = value;
    return ref;
}

/**
 * Use a ref but update the 'current' value each time so that this could be
 * used with callbacks easier.
 */
export function useRefWithUpdates<T>(value: T) {
    const ref = React.useRef<T>(value);
    ref.current = value;
    return ref;
}

export type RefState<V> = readonly [V, (value: V) => void, React.MutableRefObject<V>];

/**
 * Like useState but we also use a ref with the setter function so that it's updated each time as well.
 */
export function useRefState<V>(value: V): RefState<V> {

    const [state, setStateDelegate] = React.useState(value);
    const ref = React.useRef<V>(value);

    function setState(newValue: V) {
        ref.current = newValue;
        setStateDelegate(newValue);
    }

    return [state, setState, ref];

}

/**
 * Create a ref for the value and always update it so that inner functions can see the most recent value.
 */
export function useRefValue<V>(value: V) {
    const ref = React.useRef(value);
    ref.current = value;
    return ref;
}

function pprint(value: any) {

    if (value === undefined) {
        return 'undefined';
    } else if (value === null) {
        return 'null';
    } else if (typeof value === 'object') {
        return JSON.stringify(value);
    } else {
        return value.toString();
    }
}

export function useLogWhenChanged<T>(name: string, value: T) {
    const previous = React.useRef(value);

    // if (!Object.is(previous.current, value)) {
    if (! deepEqual(previous.current, value)) {
        console.log(`${name} changed. Old: ${pprint(previous.current)}, New: ${pprint(value)} `);
        previous.current = value;
    }

}

