import {DependencyList} from "react";
import * as React from "react";

export type ReactCallback<T> = (...args: any[]) => T;

/**
 * Just like React.useCallback except we trace each time a new function is created and ALSO which one is executed
 * so that we know we're not holding onto an older callback accidentally.
 */
export function useCallbackWithTracing<T>(callbackName: string,
                                          callback: ReactCallback<T>,
                                          deps: DependencyList): ReactCallback<T> {

    const iter = React.useRef(0);

    const delegate = React.useCallback(callback, [callback, ...deps]);

    return React.useMemo(() => {

        iter.current = iter.current + 1;

        // const id = ISODateTimeStrings.create() + '-' + Strings.lpad(Numbers.toString(iter.current), '0', 3);

        const id = `${iter.current}`;

        console.log(`REACT CALLBACK CREATED: ${callbackName} with id: ${id}`);

        return (...args: any[]): T => {
            console.log(`REACT CALLBACK EXECUTING: ${callbackName} with id: ${id}`);
            return delegate(...args);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delegate, callbackName]);

}

