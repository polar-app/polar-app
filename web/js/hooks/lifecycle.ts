import {useEffect} from "react";
import * as React from "react";

export function useComponentDidMount<T>(delegate: () => void) {
    // https://dev.to/trentyang/replace-lifecycle-with-hooks-in-react-3d4n

    // will only execute the first time.
    useEffect(() => delegate(), []);
}

export function useComponentWillUnmount(delegate: () => void) {
    // if we return a function it will only execute on unmount

    // this isn't REALLY on unmount though.  There can be no remaining reference
    // to the component.

    useEffect(() => delegate, []);
}

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

