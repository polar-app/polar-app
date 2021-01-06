import * as React from 'react';

const AddressContext = React.createContext('default value');


const WithoutInner = () => {

    return (
        <div>
            <AddressContext.Provider value="custom value">
                
            </AddressContext.Provider>
        </div>
    );

}

export const NestedContextStory = () => {
    return (
        <>

        </>
    );
}