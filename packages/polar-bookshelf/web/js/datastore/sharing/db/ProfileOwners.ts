import {Firebase} from "polar-firebase-browser/src/firebase/Firebase";
import {DocumentReferences, GetOptions} from "../../../firebase/firestore/DocumentReferences";
import {EmailStr, HandleStr, ProfileIDStr, UserIDStr} from "polar-firebase/src/firebase/om/ProfileCollection";
import {IDocumentReferenceClient} from "polar-firestore-like/src/IDocumentReference";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";

export class ProfileOwners {

    public static readonly COLLECTION = 'profile_owner';

    public static async doc(id: UserIDStr): Promise<[HandleStr, IDocumentReferenceClient]> {
        const firestore = await FirestoreBrowserClient.getInstance();
        const doc = firestore.collection(this.COLLECTION).doc(id);
        return [id, doc];
    }

    public static async get(id?: UserIDStr, opts: GetOptions = {}): Promise<ProfileOwner | undefined> {

        if (! id) {
            const user = await Firebase.currentUserAsync();

            if (! user) {
                return undefined;
            }

            id = user!.uid;
        }

        const [_, ref] = await this.doc(id);
        const doc = await DocumentReferences.get(ref, opts);
        return <ProfileOwner> doc.data();
    }

}

export interface ProfileOwner {

    readonly uid: UserIDStr;

    readonly profileID: ProfileIDStr;
    /**
     * The email for the profile.
     */
    readonly email: EmailStr;

    readonly handle?: HandleStr;

}
