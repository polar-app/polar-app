import React from 'react';
import isEqual from "react-fast-compare";
import {Context} from "react";

const MAX_INTEGER = Math.pow(2, 31);

/**
 * Like React createContext but operates like React.useMemo or React.memo and
 * only fires if the values have changed.
 */
export function createContextMemo<T>(value: T) {
    return React.createContext<T>(value, calculateChangedBitsMemo);
}

function calculateChangedBitsMemo<T>(prev: T, next: T) {
    return isEqual(prev, next) ? 0 : MAX_INTEGER;
}

type InternalUseContext<T> = <T>(context: Context<T>, observedBits?: number|boolean) => T;

export function useContextMemo<T>(context: Context<T>) {
    const internalUseContext = React.useContext as InternalUseContext<T>;
    return internalUseContext(context, MAX_INTEGER);
}
