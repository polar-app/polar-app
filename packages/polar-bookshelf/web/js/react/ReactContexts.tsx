import React from 'react';

interface IProps {
    readonly children: React.ReactNode;
}

/**
 * Create HOCs for the provider and useContext functions...
 *
 * This is just for a simple react component that just has one value that
 * never changes.
 */
export function createReactContext<T>(provider: () => T) {

    const Context = React.createContext<T>(null!);

    const useContext = React.useContext(Context);

    const Provider = React.memo((props: IProps) => {

        const value = provider()

        return (
            <Context.Provider value={value}>
                {props.children}
            </Context.Provider>
        );

    });

    return [Provider, useContext];

}
