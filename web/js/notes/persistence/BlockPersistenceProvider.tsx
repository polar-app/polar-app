import React from 'react';
import {BlocksPersistenceWriter, IBlocksPersistence, useFirestoreBlocksPersistenceWriter} from "./BlocksPersistence";
import {BlockStoreMutations} from "../store/BlockStoreMutations";
import IBlocksStoreMutation = BlockStoreMutations.IBlocksStoreMutation;


function createNullBlockPersistence(): BlocksPersistenceWriter {

    return async (mutations: ReadonlyArray<IBlocksStoreMutation>) => {
        // noop
    }

}

const BlockPersistenceWriterContext = React.createContext<BlocksPersistenceWriter>(createNullBlockPersistence())

export function useBlocksPersistenceWriter() {
    return React.useContext(BlockPersistenceWriterContext);
}

interface IProps {
    readonly children: JSX.Element;
}

export const BlockPersistenceProvider = (props: IProps) => {

    const firestoreBlocksPersistenceWriter = useFirestoreBlocksPersistenceWriter();

    return (
        <BlockPersistenceWriterContext.Provider value={firestoreBlocksPersistenceWriter}>
            {props.children}
        </BlockPersistenceWriterContext.Provider>
    );

}
