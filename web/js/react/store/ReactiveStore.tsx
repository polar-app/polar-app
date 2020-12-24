import * as React from 'react';

export function createReactiveStore<T>(storeFactory: () => T) {

    const StoreContext = React.createContext(storeFactory());

    interface IStoreContextProviderProps<T> {
        readonly children: JSX.Element;
        readonly initialStore?: T;
    }

    const StoreProvider = React.memo((props: IStoreContextProviderProps<T>) => {
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


