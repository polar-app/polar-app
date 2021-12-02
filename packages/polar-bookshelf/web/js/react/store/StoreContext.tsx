import * as React from 'react';

export interface IStoreContextProviderProps<T> {
    readonly initialStore?: T;
}

export type StoreContextProviderComponent<T> = React.FC<IStoreContextProviderProps<T>>;

export type UseStoreProvider<T> = () => T;

export type StoreContextTuple<T> = Readonly<[
    StoreContextProviderComponent<T>,
    UseStoreProvider<T>
]>;

export function createStoreContext<T>(useStoreDelegate: () => T): StoreContextTuple<T> {

    const StoreContext = React.createContext<T>(null!);

    const StoreProvider: React.FC<IStoreContextProviderProps<T>> = React.memo(function StoreProvider(props) {

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


