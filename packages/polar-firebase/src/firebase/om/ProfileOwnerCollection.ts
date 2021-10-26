import {DocumentReferences, IGetOptionsWithOrder} from "polar-firestore-like/src/DocumentReferences";
import {EmailStr, HandleStr, ProfileIDStr, UserIDStr} from "polar-shared/src/util/Strings";
import {IDocumentReference} from "polar-firestore-like/src/IDocumentReference";
import {IFirestore} from "polar-firestore-like/src/IFirestore";

export class ProfileOwnerCollection {

    public static readonly COLLECTION = 'profile_owner';

    public static async doc<SM = unknown>(firestore: IFirestore<SM>, uid: UserIDStr): Promise<readonly [HandleStr, IDocumentReference<SM>]> {
        const doc = firestore.collection(this.COLLECTION).doc(uid);
        return [uid, doc];
    }

    public static async get<SM = unknown>(firestore: IFirestore<SM>,
                                          uid: UserIDStr,
                                          opts: IGetOptionsWithOrder = {}): Promise<IProfileOwner | undefined> {
        const [_, ref] = await this.doc(firestore, uid);
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
