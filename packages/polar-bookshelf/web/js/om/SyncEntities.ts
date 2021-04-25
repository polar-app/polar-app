import {IDStr} from "polar-shared/src/util/Strings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {Clause, Collections, OrderByClause} from "../datastore/sharing/db/Collections";
import {Firebase} from "../firebase/Firebase";
import {Firestore} from "../firebase/Firestore";

export interface ISyncEntityInit {
    readonly src: IDStr;
    readonly dest: IDStr;
    readonly type: IDStr;
}

export interface ISyncEntity extends ISyncEntityInit  {
    readonly id: IDStr;
    readonly uid: string;
}


/**
 * Map primary keys between 3rd party APIs we sync with to map our ID to their
 * ID if we can't specify thE ID on creation.
 */
export namespace SyncEntities {

    const HASHCODE_LEN = 20;

    const COLLECTION = 'sync_entity';

    export function createID(type: string, src: IDStr) {
        return Hashcodes.createID({type, src}, HASHCODE_LEN);
    }

    export async function listByType(type: string): Promise<ReadonlyArray<ISyncEntity>> {

        // search by tag and by number of members descending

        // no paging yet.. just top groups to get this working and off the groupnd

        const uid = await Firebase.currentUserID();

        const clauses: ReadonlyArray<Clause> = [
            ['type', '==', type],
            ['uid', '==' , uid]
        ];

        return await Collections.list(this.COLLECTION,  clauses, {});

    }

    export async function get(type: string, src: IDStr): Promise<ISyncEntity | undefined> {
        const id = createID(type, src);
        const uid = await Firebase.currentUserID();
        const firestore = await Firestore.getInstance();
        const ref = firestore.collection(COLLECTION).doc(id);
        const doc = await ref.get();
        return doc.exists ? <ISyncEntity> doc.data() : undefined;
    }

    export async function set(type: IDStr, src: IDStr, dest: IDStr) {
        const id = createID(type, src);
        const uid = await Firebase.currentUserID();
        const firestore = await Firestore.getInstance();
        const ref = firestore.collection(COLLECTION).doc(id);
        await ref.set({id, uid, src, dest, type});
    }

}