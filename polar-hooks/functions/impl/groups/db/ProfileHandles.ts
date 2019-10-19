import {ProfileIDStr} from './Profiles';
import {HandleStr} from './Profiles';
import {Firestore} from '../../util/Firestore';
import {DocumentReference, WriteBatch} from '@google-cloud/firestore';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';

/**
 * Lookup from a handle (alice101) to their profileID.
 */
export class ProfileHandles {

    public static readonly COLLECTION = 'profile_handle';

    public static doc(handle: HandleStr): [HandleStr, DocumentReference] {
        const firestore = Firestore.getInstance();
        const id = handle;
        const doc = firestore.collection(this.COLLECTION).doc(id);
        return [id, doc];
    }

    public static async get(handle: HandleStr): Promise<ProfileHandle | undefined> {
        const [_, ref] = this.doc(handle);
        const doc = await ref.get();
        return <ProfileHandle> doc.data();
    }

    public static create(batch: WriteBatch, handle: HandleStr, profileHandle: ProfileHandle) {
        const [_, ref] = this.doc(handle);
        batch.create(ref, Dictionaries.onlyDefinedProperties(profileHandle));
    }

    public static delete(batch: WriteBatch, handle: HandleStr) {
        const [_, ref] = this.doc(handle);
        batch.delete(ref);
    }

}



export interface ProfileHandle {
    readonly profileID: ProfileIDStr;
}
