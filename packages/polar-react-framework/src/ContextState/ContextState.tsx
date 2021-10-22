import React from 'react';


interface IProviderProps<V> {
    readonly initialValue?: V | undefined
    readonly children: JSX.Element;
}

export type UseValueHook<V> = () => V | undefined;

export type UseSetterHook<V> = (value: V | undefined) => void;

// export type ProviderElement<V> = (props: IProviderProps<V>) => React.ReactElement

export type ProviderElement<V> = React.FC<IProviderProps<V>>;

export type ContextStateTuple<V> = Readonly<[ProviderElement<V>, UseValueHook<V>,  UseSetterHook<V>]>;

/**
 * Creates a provider, and two hooks, one that provides the value and another
 * that provides a setter for that value.
 *
 * It's designed for simple state injection where an single value changes
 * atomically without having to use something like mobx.
 *
 */
export function createContextState<V>(): ContextStateTuple<V> {

    const providerContext = React.createContext<V | undefined>(undefined);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const setterContext = React.createContext<UseSetterHook<V>>(null!);

    const Provider = React.memo((props: IProviderProps<V>) => {

        const [value, setValue] = React.useState(props.initialValue);

        return (
            <setterContext.Provider value={setValue}>
                <providerContext.Provider value={value}>
                    {props.children}
                </providerContext.Provider>
            </setterContext.Provider>
        );

    });

    const useProvider = () => {
        return React.useContext(providerContext);
    }

    const useSetter = () => {
        return React.useContext(setterContext);
    }

    return [Provider, useProvider, useSetter];

}
