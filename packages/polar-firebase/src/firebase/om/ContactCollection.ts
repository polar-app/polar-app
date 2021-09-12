import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Collections} from "polar-firestore-like/src/Collections";
import {EmailStr, UserIDStr} from "polar-shared/src/util/Strings";
import DocumentChange = Collections.DocumentChangeValue;
import {IFirestore} from 'polar-firestore-like/src/IFirestore';

export class ContactCollection {

    public static readonly COLLECTION = 'contact';

    public static async list(firestore: IFirestore<unknown>, uid: UserIDStr): Promise<ReadonlyArray<Contact>> {
        return await Collections.list(firestore ,this.COLLECTION, [['uid' , '==', uid]]);
    }

    public static async onSnapshot<SM = unknown>(firestore: IFirestore<SM>, uid: UserIDStr, delegate: (records: ReadonlyArray<DocumentChange<Contact>>) => void) {
        return Collections.onQuerySnapshotChanges<Contact, SM>(firestore, this.COLLECTION, [['uid' , '==', uid]], delegate);
    }

    /**
     * Delete all of the user contacts...
     */
    public static async purge(firestore: IFirestore<unknown>, uid: UserIDStr) {
        const batch = firestore.batch();
        await Collections.deleteByID(firestore, this.COLLECTION, batch, () => this.list(firestore, uid));
    }

}

export interface ContactInit {

    readonly profileID?: EmailStr;
    readonly email?: EmailStr;

    /**
     * The label for this contact.  This is either the parsed 'name' that we
     * parsed from the email or it's going to be the profile name from their
     * profile metadata.
     */
    readonly label?: string;

    /**
     * The relationship with this contact.
     */
    readonly rel: ContactRelArray;

    /**
     * True if the user has me as a friend too.
     */
    readonly reciprocal: boolean;

}

export interface Contact extends ContactInit {

    readonly id: string;
    readonly uid: string;
    readonly created: ISODateTimeString;

}

export type ContactRelArray = ReadonlyArray<ContactRelType>;

/**
 * The relationship type:
 *
 * - sharing: sharing documents with this user.
 * - friend: added them as a friend.
 *
 */
export type ContactRelType = 'shared' | 'friend';

export type ContactIDStr = string;
