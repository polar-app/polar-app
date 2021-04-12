import * as React from 'react';

const AddressContext = React.createContext('default value');

function useAddressContext() {
    return React.useContext(AddressContext);
}

const ContextValue = () => {
    const address = useAddressContext();
    return (
        <div>
            {address}
        </div>
    );
}

interface IProps {
    readonly children: JSX.Element;
}

const ContextProvider = (props: IProps) => {
    return (
        <AddressContext.Provider value="custom value">
            {props.children}
        </AddressContext.Provider>
    )
}

const WithoutInner = () => {

    return (
        <div>
            <ContextProvider>
                <ContextValue/>
            </ContextProvider>
        </div>
    );

}

export const NestedContextStory = () => {
    return (
        <>
            <WithoutInner/>
        </>
    );
}