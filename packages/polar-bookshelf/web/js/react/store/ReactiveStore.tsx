import * as React from 'react';

export interface IReactiveStoreProviderProps<T> {
    readonly children: JSX.Element;
    readonly initialStore?: T;
}

export type ReactiveStoreProviderComponent<T> = React.FunctionComponent<IReactiveStoreProviderProps<T>>;

export type StoreProvider<T> = () => T;

export type ReactiveStoreTuple<T> = [
    ReactiveStoreProviderComponent<T>,
    StoreProvider<T>
];


export function createReactiveStore<T>(useStoreDelegate: () => T): ReactiveStoreTuple<T> {

    const StoreContext = React.createContext<T>(null!);

    const StoreProvider = React.memo(function StoreProvider(props: IReactiveStoreProviderProps<T>) {

        const defaultStore = useStoreDelegate();

        const store = React.useMemo(() => props.initialStore || defaultStore, [defaultStore, props.initialStore]);

        return (
            <StoreContext.Provider value={store}>
                {props.children}
            </StoreContext.Provider>
        );

    });

    function useStore() {
        return React.useContext(StoreContext);
    }

    return [StoreProvider, useStore];

}


