import React from 'react';
import isEqual from 'react-fast-compare';

type MemoForwardRefComponent<P> = (props: P) => JSX.Element | null;

/**
 * React.memo and React.forwardRef all in one function with deep isEqual support
 */
export function memoForwardRef<P>(component: MemoForwardRefComponent<P>) {
    return React.memo(React.forwardRef((props: P, ref) => component(props)), isEqual);
}
