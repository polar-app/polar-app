import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Collections} from "polar-firestore-like/src/Collections";
import {BlockIDStr, NamespaceIDStr} from "polar-blocks/src/blocks/IBlock";
import {BlockPermissionRecordType, IBlockPermission} from "./IBlockPermission";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";

export namespace BlockPermissionCollection {

    export const COLLECTION = 'block_permission';

    export async function get<T extends Exclude<BlockPermissionRecordType, 'effective'>>(firestore: IFirestore<unknown>,
                                                                                         id: BlockIDStr | NamespaceIDStr): Promise<IBlockPermission<T> | undefined> {

        return await Collections.get(firestore, COLLECTION, id);

    }

    export async function set<T extends Exclude<BlockPermissionRecordType, 'effective'>>(firestore: IFirestore<unknown>,
                                                                                         id: BlockIDStr | NamespaceIDStr,
                                                                                         record: IBlockPermission<T>,
                                                                                         batch?: IWriteBatch<unknown>) {

        const updated = ISODateTimeStrings.create();

        const newRecord: IBlockPermission<T> = {
            ...record,
            updated
        }

        return await Collections.set(firestore, COLLECTION, id, newRecord, batch);

    }

    export async function doDelete(firestore: IFirestore<unknown>, id: BlockIDStr | NamespaceIDStr) {
        return await Collections.doDelete(firestore, COLLECTION, id);
    }

}
