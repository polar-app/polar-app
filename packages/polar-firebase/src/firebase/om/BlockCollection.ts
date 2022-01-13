import {BlockIDStr, IBlock} from "polar-blocks/src/blocks/IBlock";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Collections} from "polar-firestore-like/src/Collections";
import {UserIDStr} from "polar-shared/src/util/Strings";

export namespace BlockCollection {

    export const COLLECTION = 'block';

    export async function get(firestore: IFirestore<unknown>, id: BlockIDStr): Promise<IBlock | undefined> {
        return await Collections.get(firestore, COLLECTION, id);
    }

    export async function set(firestore: IFirestore<unknown>, block: IBlock) {
        return await Collections.set(firestore, COLLECTION, block.id, block);
    }

    export async function list(firestore: IFirestore<unknown>, uid: UserIDStr): Promise<ReadonlyArray<IBlock>> {
        return await Collections.list(firestore, COLLECTION, [['nspace', '==', uid ]]);
    }

}
