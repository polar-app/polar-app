import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";
import {IDocumentReference} from "polar-firestore-like/src/IDocumentReference";
import {HandleStr, ProfileIDStr} from "polar-shared/src/util/Strings";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";

/**
 * Lookup from a handle (alice101) to their profileID.
 */
export class ProfileHandles {

    public static readonly COLLECTION = 'profile_handle';

    public static doc(handle: HandleStr): readonly [HandleStr, IDocumentReference<unknown>] {
        const firestore = FirestoreAdmin.getInstance();
        const id = handle;
        const doc = firestore.collection(this.COLLECTION).doc(id);
        return [id, doc];
    }

    public static async get(handle: HandleStr): Promise<ProfileHandle | undefined> {
        const [_, ref] = this.doc(handle);
        const doc = await ref.get();
        return <ProfileHandle> doc.data();
    }

    public static create(batch: IWriteBatch<unknown>, handle: HandleStr, profileHandle: ProfileHandle) {
        const [_, ref] = this.doc(handle);
        batch.create(ref, Dictionaries.onlyDefinedProperties(profileHandle));
    }

    public static delete(batch: IWriteBatch<unknown>, handle: HandleStr) {
        const [_, ref] = this.doc(handle);
        batch.delete(ref);
    }

}



export interface ProfileHandle {
    readonly profileID: ProfileIDStr;
}
