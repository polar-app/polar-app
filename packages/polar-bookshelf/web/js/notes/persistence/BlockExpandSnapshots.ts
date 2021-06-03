import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import React from "react";
import {IBlock, UIDStr} from "../store/IBlock";
import {IQuerySnapshot} from "polar-snapshot-cache/src/store/IQuerySnapshot";
import {MockBlocks} from "../../../../apps/stories/impl/MockBlocks";
import {IDocumentChange} from "polar-snapshot-cache/src/store/IDocumentChange";
import {createMockSnapshot, IGenericSnapshot} from "./IGenericSnapshot";
import {IGenericDocumentChange} from "./IGenericDocumentChange";
import {useGenericFirestoreSnapshots} from "./GenericFirestoreSnapshots";
import {BlockIDStr} from "../store/BlocksStore";
import {IDStr} from "polar-shared/src/util/Strings";

const IS_NODE = typeof window === 'undefined';

export type IBlocksPersistenceSnapshot = IGenericSnapshot<IBlock>;

/**
 * This is just a hook that will be re-called from within the UI...
 */
export type BlocksPersistenceSnapshotsHook = () => IBlocksPersistenceSnapshot;

export interface IBlockExpand {

    /**
     * "The block ID of this record which is just the
     */
    readonly id: BlockIDStr;

    readonly uid: UIDStr;

}

export function useFirestoreBlocksExpandSnapshots(listener: (snapshot: IGenericSnapshot<IBlockExpand>) => void) {

    const {user} = useFirestore();

    return useGenericFirestoreSnapshots('block_expand', ['uid', '==', user?.uid], listener);

}

export function useBlockExpandSnapshots(listener: (snapshot: IGenericSnapshot<IBlockExpand>) => void) {

    if (IS_NODE) {
        listener(createMockSnapshot([]));
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFirestoreBlocksExpandSnapshots(listener);

}
