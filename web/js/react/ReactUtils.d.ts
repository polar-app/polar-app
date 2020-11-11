import React from 'react';
export declare function memoForwardRef<E, P>(component: React.ForwardRefRenderFunction<E, P>): React.MemoExoticComponent<React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<E>>>;
export declare function memoForwardRefDiv<P>(component: React.ForwardRefRenderFunction<HTMLDivElement, P>): React.MemoExoticComponent<React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<HTMLDivElement>>>;
interface IDeepMemoOpts {
    readonly debug?: boolean;
}
export declare function deepMemo<T extends React.ComponentType<any>>(component: T, opts?: IDeepMemoOpts): React.MemoExoticComponent<T>;
export {};
