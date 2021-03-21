import {GroupIDStr} from './Groups';
import {WriteBatch} from "@google-cloud/firestore";
import {Firestore} from '../../util/Firestore';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {UserIDStr} from './Profiles';
import {FirestoreArray, FirestoreTypedArray} from "polar-firebase/src/firebase/Collections";

export class GroupAdmins {

    public static readonly COLLECTION = 'group_admin';

    public static async getOrCreate(batch: WriteBatch, id: GroupIDStr, uid: UserIDStr): Promise<GroupAdmin> {

        const result = await this.get(id);

        if (result) {
            return result;
        }

        return await this.create(batch, id, uid);

    }

    public static create(batch: WriteBatch, id: GroupIDStr, uid: UserIDStr): Promise<GroupAdmin> {
        const firestore = Firestore.getInstance();
        const groupAdminRef = firestore.collection(this.COLLECTION).doc(id);
        const groupAdmin: GroupAdmin = {admins: [uid], moderators: []};
        const record = Dictionaries.onlyDefinedProperties(groupAdmin);
        batch.create(groupAdminRef, record);
        return record;
    }

    public static async get(id: GroupIDStr): Promise<GroupAdmin | undefined> {
        const firestore = Firestore.getInstance();
        const ref = firestore.collection(this.COLLECTION).doc(id);
        const doc = await ref.get();
        return <GroupAdmin> doc.data();
    }

    public static delete(batch: WriteBatch, id: GroupIDStr) {
        const firestore = Firestore.getInstance();
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
