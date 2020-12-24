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


export function createReactiveStore<T>(storeFactory: () => T): ReactiveStoreTuple<T> {

    const StoreContext = React.createContext(storeFactory());

    const StoreProvider = React.memo((props: IReactiveStoreProviderProps<T>) => {
        return (
            <StoreContext.Provider value={props.initialStore || storeFactory()}>
                {props.children}
            </StoreContext.Provider>
        );
    });

    function useStore() {
        return React.useContext(StoreContext);
    }

    return [StoreProvider, useStore];

}


