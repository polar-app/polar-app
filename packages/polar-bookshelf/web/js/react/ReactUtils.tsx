import React from 'react';
import isEqual from 'react-fast-compare';

/**
 * React.memo and React.forwardRef all in one function with deep isEqual support
 *  for ease of use.
 */
export function memoForwardRef<E, P>(component: React.ForwardRefRenderFunction<E, P>) {
    return React.memo(React.forwardRef<E, P>((props: P, ref) => component(props, ref)), isEqual);
}

export function memoForwardRefDiv<P>(component: React.ForwardRefRenderFunction<HTMLDivElement, P>) {
    return React.memo(React.forwardRef<HTMLDivElement, P>((props: P, ref) => component(props, ref)), isEqual);
}

export function deepMemo<P>(component: React.FunctionComponent<P>) {
    return React.memo((props: P) => component(props), isEqual);
}

