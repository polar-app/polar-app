import React from 'react';
import {
    BlocksPersistenceSnapshotsHook,
    BlocksPersistenceWriter, createMockBlocksPersistenceSnapshot,
    useFirestoreBlocksPersistenceWriter
} from "./BlocksPersistence";
import {BlocksStoreMutations} from "../store/BlocksStoreMutations";
import IBlocksStoreMutation = BlocksStoreMutations.IBlocksStoreMutation;
import {MockBlocks} from "../../../../apps/stories/impl/MockBlocks";

function createNullBlockPersistence(): BlocksPersistenceWriter {

    return async (mutations: ReadonlyArray<IBlocksStoreMutation>) => {
        // noop
    }

}


function createNullBlockPersistenceSnapshots(): BlocksPersistenceSnapshotsHook {

    return () => {
        return createMockBlocksPersistenceSnapshot(MockBlocks.create());
    }

}

const BlockPersistenceWriterContext = React.createContext<BlocksPersistenceWriter>(createNullBlockPersistence())

const BlockPersistenceSnapshotsContext = React.createContext<BlocksPersistenceSnapshotsHook>(createNullBlockPersistenceSnapshots())

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
