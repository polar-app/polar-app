import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import React from "react";
import {IBlock} from "../store/IBlock";
import {IQuerySnapshot} from "polar-snapshot-cache/src/store/IQuerySnapshot";
import {MockBlocks} from "../../../../apps/stories/impl/MockBlocks";
import {IDocumentChange} from "polar-snapshot-cache/src/store/IDocumentChange";
import {IGenericSnapshot} from "./IGenericSnapshot";
import {IGenericDocumentChange} from "./IGenericDocumentChange";
import {useGenericFirestoreSnapshots} from "./GenericFirestoreSnapshots";

const IS_NODE = typeof window === 'undefined';

export type IBlocksPersistenceSnapshot = IGenericSnapshot<IBlock>;

/**
 * This is just a hook that will be re-called from within the UI...
 */
export type BlocksPersistenceSnapshotsHook = () => IBlocksPersistenceSnapshot;

/**
 * Use blocks to create mock snapshots where everything is 'added'
 */
export function createMockBlocksPersistenceSnapshot(blocks: ReadonlyArray<IBlock>): IBlocksPersistenceSnapshot {

    const convertBlockToDocChange = (block: IBlock): IGenericDocumentChange<IBlock> => {

        return {
            id: block.id,
            type: 'added',
            data: block
        }
    }

    return {
        empty: blocks.length === 0,
        metadata: {
            hasPendingWrites: false,
            fromCache: true
        },
        docChanges: blocks.map(current => convertBlockToDocChange(current))
    };

}

export function createEmptyBlocksPersistenceSnapshot(): IBlocksPersistenceSnapshot {

    return {
        empty: true,
        metadata: {
            hasPendingWrites: false,
            fromCache: true
        },
        docChanges: []
    }

}

export function useFirestoreBlocksPersistenceSnapshots(listener: (snapshot: IBlocksPersistenceSnapshot) => void) {

    const {user} = useFirestore();

    return useGenericFirestoreSnapshots('block', ['nspace', 'in', [user?.uid]], listener);


}

export function useBlocksPersistenceSnapshots(listener: (snapshot: IBlocksPersistenceSnapshot) => void) {

    if (IS_NODE) {
        listener(createMockBlocksPersistenceSnapshot(MockBlocks.create()));
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFirestoreBlocksPersistenceSnapshots(listener);

}
