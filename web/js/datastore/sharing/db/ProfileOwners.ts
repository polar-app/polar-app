import {UserIDStr} from './Profiles';
import {HandleStr} from './Profiles';
import {ProfileIDStr} from './Profiles';
import {Firestore} from '../../../firebase/Firestore';
import * as firebase from '../../../firebase/lib/firebase';
import DocumentReference = firebase.firestore.DocumentReference;

export class ProfileOwners {

    public static readonly COLLECTION = 'profile_owner';

    public static async doc(id: UserIDStr): Promise<[HandleStr, DocumentReference]> {
        const firestore = await Firestore.getInstance();
        const doc = firestore.collection(this.COLLECTION).doc(id);
        return [id, doc];
    }

    public static async get(id: UserIDStr): Promise<ProfileOwner | undefined> {
        const [_, ref] = await this.doc(id);
        const doc = await ref.get();
        return <ProfileOwner> doc.data();
    }

}

export interface ProfileOwner {
    readonly uid: UserIDStr;
    readonly profileID: ProfileIDStr;
    readonly handle?: HandleStr;
}
