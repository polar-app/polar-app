import {BlockIDStr, IBlock} from "polar-blocks/src/blocks/IBlock";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Collections} from "polar-firestore-like/src/Collections";

export namespace BlockCollection {

    export const COLLECTION = 'block';

    export async function get(firestore: IFirestore<unknown>, id: BlockIDStr): Promise<IBlock | undefined> {
        return await Collections.getByID(firestore, COLLECTION, id);
    }

}
