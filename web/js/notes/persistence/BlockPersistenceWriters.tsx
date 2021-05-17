import React from 'react';
import {BlocksPersistenceWriter} from "./FirestoreBlocksStoreMutations";
import {BlocksStoreMutations} from "../store/BlocksStoreMutations";
import IBlocksStoreMutation = BlocksStoreMutations.IBlocksStoreMutation;
import {useFirestoreBlocksPersistenceWriter} from "./FirestoreBlocksPersistenceWriter";

const IS_NODE = typeof window === 'undefined';

function createMockBlocksPersistenceWriter(): BlocksPersistenceWriter {

    return async (mutations: ReadonlyArray<IBlocksStoreMutation>) => {
        // noop
    }

}

export function useBlocksPersistenceWriter(): BlocksPersistenceWriter {

    if (IS_NODE) {
        return createMockBlocksPersistenceWriter();
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useFirestoreBlocksPersistenceWriter();

}
