import * as React from 'react';

export interface IStoreContextProviderProps<T> {
    readonly children: JSX.Element;
    readonly initialStore?: T;
}

export type StoreContextProviderComponent<T> = React.FunctionComponent<IStoreContextProviderProps<T>>;

export type StoreProvider<T> = () => T;

export type StoreContextTuple<T> = [
    StoreContextProviderComponent<T>,
    StoreProvider<T>
];


export function createStoreContext<T>(useStoreDelegate: () => T): StoreContextTuple<T> {

    const StoreContext = React.createContext<T>(null!);

    const StoreProvider = React.memo(function StoreProvider(props: IStoreContextProviderProps<T>) {

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


