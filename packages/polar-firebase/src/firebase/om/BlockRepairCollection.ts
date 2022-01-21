import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Collections} from "polar-firestore-like/src/Collections";
import {IBlock} from "polar-blocks/src/blocks/IBlock";

export interface IBlockRepair extends IBlock {

}

/**
 * Maintains a backup of blocks we're about to repair/mutate
 */
export namespace BlockRepairCollection {

    export const COLLECTION = 'block_repair';

    export async function set(firestore: IFirestore<unknown>, blockRepair: IBlockRepair) {
        return await Collections.set(firestore, COLLECTION, blockRepair.id, blockRepair);
    }

}
