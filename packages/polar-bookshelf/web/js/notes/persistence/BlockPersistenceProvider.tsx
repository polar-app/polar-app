import React from 'react';
import {IBlocksPersistence, useFirestoreBlocksPersistence} from "./BlocksPersistence";
import {BlockStoreMutations} from "../store/BlockStoreMutations";
import IBlocksStoreMutation = BlockStoreMutations.IBlocksStoreMutation;


function createNullBlockPersistence(): IBlocksPersistence {

    const write = async (mutations: ReadonlyArray<IBlocksStoreMutation>) => {
        // noop
    }

    return {
        write
    };

}

const BlockPersistenceProviderContext = React.createContext<IBlocksPersistence>(createNullBlockPersistence())

export function useBlocksPersistence() {
    return React.useContext(BlockPersistenceProviderContext);
}

export const BlockPersistenceProvider = () => {

    const write = useFirestoreBlocksPersistence();

    return (
        <BlockPersistenceProviderContext.Provider value={{write}}>

        </BlockPersistenceProviderContext.Provider>
    );

}
