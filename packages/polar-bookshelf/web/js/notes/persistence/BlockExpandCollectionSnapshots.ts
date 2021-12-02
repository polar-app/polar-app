import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {createMockSnapshot, IGenericCollectionSnapshot} from "./IGenericCollectionSnapshot";
import {useGenericFirestoreSnapshots} from "./GenericFirestoreSnapshots";
import {BlockIDStr, UIDStr} from "polar-blocks/src/blocks/IBlock";
import {Testing} from "polar-shared/src/util/Testing";

const IS_NODE = typeof window === 'undefined';

export type IBlockExpandCollectionSnapshot = IGenericCollectionSnapshot<IBlockExpand>;

export interface IBlockExpand {

    /**
     * "The block ID of this record which is just the
     */
    readonly id: BlockIDStr;

    readonly uid: UIDStr;

}

export function useFirestoreBlocksExpandCollectionSnapshots(listener: (snapshot: IBlockExpandCollectionSnapshot) => void) {

    const firestoreContext = useFirestore();
    const user = firestoreContext?.user;

    return useGenericFirestoreSnapshots('block_expand', ['uid', '==', user?.uid], listener);

}

export function useBlockExpandCollectionSnapshots(listener: (snapshot: IBlockExpandCollectionSnapshot) => void) {

    if (IS_NODE || Testing.isTestingRuntime()) {
        listener(createMockSnapshot([]));
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFirestoreBlocksExpandCollectionSnapshots(listener);

}
