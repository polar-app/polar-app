import * as React from "react";

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
