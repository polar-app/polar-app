import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {UIDStr} from "../store/IBlock";
import {createMockSnapshot, IGenericSnapshot} from "./IGenericSnapshot";
import {useGenericFirestoreSnapshots} from "./GenericFirestoreSnapshots";
import {BlockIDStr} from "../store/BlocksStore";

const IS_NODE = typeof window === 'undefined';

export type IBlockExpandSnapshot = IGenericSnapshot<IBlockExpand>;

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
