import React from 'react';
import {
    BlocksPersistenceSnapshotsHook,
    BlocksPersistenceWriter, createMockBlocksPersistenceSnapshot,
    useFirestoreBlocksPersistenceWriter
} from "./BlocksPersistence";
import {BlocksStoreMutations} from "../store/BlocksStoreMutations";
import IBlocksStoreMutation = BlocksStoreMutations.IBlocksStoreMutation;
import {MockBlocks} from "../../../../apps/stories/impl/MockBlocks";

const IS_NODE = typeof window === 'undefined';

function createMockBlocksPersistenceWriter(): BlocksPersistenceWriter {

    return async (mutations: ReadonlyArray<IBlocksStoreMutation>) => {
        // noop
    }

}


function createNullBlockPersistenceSnapshots(): BlocksPersistenceSnapshotsHook {

    return () => {
        return createMockBlocksPersistenceSnapshot(MockBlocks.create());
    }

}

const BlockPersistenceWriterContext = React.createContext<BlocksPersistenceWriter>(createMockBlocksPersistenceWriter())

export function useBlocksPersistenceWriter(): BlocksPersistenceWriter {

    if (IS_NODE) {
        return createMockBlocksPersistenceWriter();
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useFirestoreBlocksPersistenceWriter();

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
