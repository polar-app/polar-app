import React, {Context, useContext} from 'react';
import isEqual from 'react-fast-compare';

const MAX_INTEGER = 1073741823;

const ENABLED = false;

/**
 * Like React createContext but operates like React.useMemo or React.memo and
 * only fires if the values have changed.
 */
export function createContextMemo<T>(value: T) {

    // if (ENABLED) {
    //     return React.createContext<T>(value, calculateChangedBitsMemo);
    // }

    return React.createContext<T>(value);
}

function calculateChangedBitsMemo<T>(prev: T, next: T) {
    return isEqual(prev, next) ? 0 : MAX_INTEGER;
    // return debugIsEqual(prev, next) ? 0 : MAX_INTEGER;
}

type InternalUseContext<T> = <T>(context: Context<T>, observedBits?: number|boolean) => T;

export function useContextMemo<T>(context: Context<T>) {

    // if (ENABLED) {
    //     const internalUseContext = useContext as InternalUseContext<T>;
    //     return internalUseContext(context, MAX_INTEGER);
    // }

    return useContext(context);

}
