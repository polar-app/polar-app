import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Collections} from "polar-firestore-like/src/Collections";
import {BlockIDStr, NamespaceIDStr} from "polar-blocks/src/blocks/IBlock";
import {BlockPermissionRecordType, IBlockPermissionRecord} from "./IBlockPermissionRecord";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";

export namespace BlockPermissionCollection {

    export const COLLECTION = 'block_permission';

    export async function get<T extends Exclude<BlockPermissionRecordType, 'effective'>>(firestore: IFirestore<unknown>,
                                                                                         id: BlockIDStr | NamespaceIDStr): Promise<IBlockPermissionRecord<T> | undefined> {

        return await Collections.get(firestore, COLLECTION, id);

    }

    export async function set<T extends Exclude<BlockPermissionRecordType, 'effective'>>(firestore: IFirestore<unknown>,
                                                                                         id: BlockIDStr | NamespaceIDStr,
                                                                                         record: IBlockPermissionRecord<T>) {

        const updated = ISODateTimeStrings.create();

        const newRecord: IBlockPermissionRecord<T> = {
            ...record,
            updated
        }

        return await Collections.set(firestore, COLLECTION, id, newRecord);

    }

}
