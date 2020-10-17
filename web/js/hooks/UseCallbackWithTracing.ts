import {DependencyList} from "react";
import * as React from "react";

let NONCE = 0;

export type ReactCallback = (...args: any[]) => any;

/**
 * Just like React.useCallback except we trace each time a new function is created and ALSO which one is executed
 * so that we know we're not holding onto an older callback accidentally.
 */
export function useCallbackWithTracing(callbackName: string, callback: ReactCallback, deps: DependencyList): ReactCallback {

    return React.useMemo(() => {

        const id = NONCE++;

        console.log(`REACT CALLBACK CREATED: ${callbackName} with id: ${id}`);

        return (...args: any[]): any => {
            console.log(`REACT CALLBACK EXECUTING: ${callbackName} with id: ${id}`);
            return callback(args);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback, callbackName, ...deps]);

}

