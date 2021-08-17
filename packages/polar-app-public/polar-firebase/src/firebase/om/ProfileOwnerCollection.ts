import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {DocumentReferences, GetOptions} from "polar-bookshelf/web/js/firebase/firestore/DocumentReferences";
import {EmailStr, HandleStr, ProfileIDStr, UserIDStr} from "polar-shared/src/util/Strings";
import {IDocumentReferenceClient} from "polar-firestore-like/src/IDocumentReference";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";

export class ProfileOwnerCollection {

    public static readonly COLLECTION = 'profile_owner';

    public static async doc(id: UserIDStr): Promise<[HandleStr, IDocumentReferenceClient]> {
        const firestore = await FirestoreBrowserClient.getInstance();
        const doc = firestore.collection(this.COLLECTION).doc(id);
        return [id, doc];
    }

    public static async get(id?: UserIDStr, opts: GetOptions = {}): Promise<IProfileOwner | undefined> {

        if (! id) {
            const user = await FirebaseBrowser.currentUserAsync();

            if (! user) {
                return undefined;
            }

            id = user!.uid;
        }

        const [_, ref] = await this.doc(id);
        const doc = await DocumentReferences.get(ref, opts);
        return <IProfileOwner> doc.data();
    }

}

export interface IProfileOwner {

    readonly uid: UserIDStr;

    readonly profileID: ProfileIDStr;
    /**
     * The email for the profile.
     */
    readonly email: EmailStr;

    readonly handle?: HandleStr;

}
