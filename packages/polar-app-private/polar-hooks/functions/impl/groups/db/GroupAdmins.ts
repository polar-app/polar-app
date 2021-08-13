import {GroupIDStr} from './Groups';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {FirestoreTypedArray} from "polar-firebase/src/firebase/Collections";
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";
import {UserIDStr} from 'polar-shared/src/util/Strings';
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";

export class GroupAdmins {

    public static readonly COLLECTION = 'group_admin';

    public static async getOrCreate(batch: IWriteBatch<unknown>, id: GroupIDStr, uid: UserIDStr): Promise<GroupAdmin> {

        const result = await this.get(id);

        if (result) {
            return result;
        }

        return await this.create(batch, id, uid);

    }

    public static create(batch: IWriteBatch<unknown>, id: GroupIDStr, uid: UserIDStr): Promise<GroupAdmin> {
        const firestore = FirestoreAdmin.getInstance();
        const groupAdminRef = firestore.collection(this.COLLECTION).doc(id);
        const groupAdmin: GroupAdmin = {admins: [uid], moderators: []};
        const record = Dictionaries.onlyDefinedProperties(groupAdmin);
        batch.create(groupAdminRef, record);
        return record;
    }

    public static async get(id: GroupIDStr): Promise<GroupAdmin | undefined> {
        const firestore = FirestoreAdmin.getInstance();
        const ref = firestore.collection(this.COLLECTION).doc(id);
        const doc = await ref.get();
        return <GroupAdmin> doc.data();
    }

    public static delete(batch: IWriteBatch<unknown>, id: GroupIDStr) {
        const firestore = FirestoreAdmin.getInstance();
        const ref = firestore.collection(this.COLLECTION).doc(id);
        batch.delete(ref);
    }

}

export interface GroupAdminInit {
    readonly admins: FirestoreTypedArray<UserIDStr>;
    readonly moderators: FirestoreTypedArray<UserIDStr>;
}

export interface GroupAdmin extends GroupAdminInit {
}
