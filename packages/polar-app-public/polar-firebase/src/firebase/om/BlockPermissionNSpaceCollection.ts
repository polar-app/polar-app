import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Collections} from "polar-firestore-like/src/Collections";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {IBlockPermissionRecord} from "./IBlockPermissionRecord";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";

export namespace BlockPermissionNSpaceCollection {

    export const COLLECTION = 'block_permission_nspace';

    export async function get(firestore: IFirestore<unknown>, id: BlockIDStr): Promise<IBlockPermissionRecord<'nspace'> | undefined> {
        return await Collections.get(firestore, COLLECTION, id);
    }

    export async function set(firestore: IFirestore<unknown>, id: BlockIDStr, record: IBlockPermissionRecord<'nspace'>) {

        const updated = ISODateTimeStrings.create();

        const newRecord: IBlockPermissionRecord<'nspace'> = {
            ...record,
            updated
        }

        return await Collections.set(firestore, COLLECTION, id, newRecord);
    }

}
