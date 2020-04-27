import React, {useRef} from "react";

interface InternalSharedState<T> {
    iter: number;
    value: T;
}

export interface SharedState<T> {
    readonly iter: number;
    readonly value: T;
}

/**
 * Shared state allows us to keep an inner value, which we can fetch via get()
 * and share this state with functions using useCallback that don't have to be
 * reset, which might trigger callbacks in some sub-components.
 *
 * The value is updated but the functions accessing value do not need to be
 * evicted and can still be memoized.
 */
export function useSharedState<T>(value: T): [SharedState<T>, (value: T) => void] {

    const state = useRef<InternalSharedState<T>>({
        iter: 0,
        value
    });

    const setState = (value: T) => {

        // update the result so it can be referenced again next time and return
        // the updated state

        state.current = {
            iter: state.current.iter + 1,
            value
        };

        return state;

    }

    return [state.current, setState];

}
