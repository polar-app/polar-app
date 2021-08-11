import {IBlockPermissionUser} from "./IBlockPermissionUser";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Collections} from "polar-firestore-like/src/Collections";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {BlockPermissionUserIDStr} from "./IBlockPermissionEntry";

export namespace BlockPermissionUserCollection {

    export const COLLECTION = 'block_permission_user';

    export async function get(firestore: IFirestore<unknown>, uid: BlockPermissionUserIDStr): Promise<IBlockPermissionUser | undefined> {
        return await Collections.get(firestore, COLLECTION, uid);
    }

    export async function set(firestore: IFirestore<unknown>,
                              id: BlockPermissionUserIDStr,
                              record: IBlockPermissionUser) {

        const updated = ISODateTimeStrings.create();

        const newRecord: IBlockPermissionUser = {
            ...record,
            updated
        }

        return await Collections.set(firestore, COLLECTION, id, newRecord);

    }

    export async function doDelete(firestore: IFirestore<unknown>, id: BlockPermissionUserIDStr) {
        return await Collections.doDelete(firestore, COLLECTION, id);
    }

}
