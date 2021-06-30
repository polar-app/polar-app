import {Firestore} from '../../util/Firestore';
import {Collections} from './Collections';
import {Preconditions} from "polar-shared/src/Preconditions";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";
import {EmailStr, HandleStr, ProfileIDStr, UserIDStr } from 'polar-firebase/src/firebase/om/Profiles';
import {IDocumentReference} from "polar-firestore-like/src/IDocumentReference";

/**
 * Allow the backend to lookup a profile ID via UID.
 *
 * uid -> profileID and handle.
 */
export class ProfileOwners {

    public static readonly COLLECTION = 'profile_owner';

    public static doc(uid: UserIDStr): [HandleStr, IDocumentReference<unknown>] {
        const firestore = Firestore.getInstance();
        const doc = firestore.collection(this.COLLECTION).doc(uid);
        return [uid, doc];
    }

    public static async get(uid: UserIDStr): Promise<ProfileOwner | undefined> {
        const [_, ref] = this.doc(uid);
        const doc = await ref.get();
        return <ProfileOwner> doc.data();
    }

    public static async getByProfileID(profileID: ProfileIDStr): Promise<ProfileOwner | undefined> {
        return await Collections.getByFieldValue(this.COLLECTION, 'profileID', profileID);
    }

    public static async getByEmail(email: EmailStr): Promise<ProfileOwner | undefined> {
        return await Collections.getByFieldValue(this.COLLECTION, 'email', email);
    }

    public static set(batch: IWriteBatch<unknown>, uid: UserIDStr, profileOwner: ProfileOwner) {
        const [_, ref] = this.doc(uid);
        Preconditions.assertPresent(profileOwner.email, "No email on profile owner");
        batch.set(ref, Dictionaries.onlyDefinedProperties(profileOwner), {merge: true});
    }

    public static async delete(batch: IWriteBatch<unknown>, id: UserIDStr) {
        await Collections.deleteByID(batch, this.COLLECTION, async () => [{id}] );
    }

}

export interface ProfileOwner {

    readonly uid: UserIDStr;

    /**
     * The email for the profile.
     */
    readonly email: EmailStr;

    readonly handle?: HandleStr;

    readonly profileID: ProfileIDStr;

}
