import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {createMockSnapshot, IGenericCollectionSnapshot} from "./IGenericCollectionSnapshot";
import {useGenericFirestoreSnapshots} from "./GenericFirestoreSnapshots";
import {BlockIDStr, UIDStr} from "polar-blocks/src/blocks/IBlock";

const IS_NODE = typeof window === 'undefined';

export type IBlockExpandSnapshot = IGenericCollectionSnapshot<IBlockExpand>;

export interface IBlockExpand {

    /**
     * "The block ID of this record which is just the
     */
    readonly id: BlockIDStr;

    readonly uid: UIDStr;

}

export function useFirestoreBlocksExpandSnapshots(listener: (snapshot: IBlockExpandSnapshot) => void) {

    const {user} = useFirestore();

    return useGenericFirestoreSnapshots('block_expand', ['uid', '==', user?.uid], listener);

}

export function useBlockExpandSnapshots(listener: (snapshot: IBlockExpandSnapshot) => void) {

    if (IS_NODE) {
        listener(createMockSnapshot([]));
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFirestoreBlocksExpandSnapshots(listener);

}
