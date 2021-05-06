import React from 'react';
import {IBlocksPersistence} from "./BlocksPersistence";
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
