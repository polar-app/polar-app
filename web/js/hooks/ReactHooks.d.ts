import * as React from "react";
export declare function useRefProvider<T>(providerHook: () => T): React.MutableRefObject<T>;
export declare function useRefWithUpdates<T>(value: T): React.MutableRefObject<T>;
export declare type RefState<V> = readonly [V, (value: V) => void, React.MutableRefObject<V>];
export declare function useRefState<V>(value: V): RefState<V>;
export declare function useRefValue<V>(value: V): React.MutableRefObject<V>;
export declare function useLogWhenChanged<T>(name: string, value: T): void;
