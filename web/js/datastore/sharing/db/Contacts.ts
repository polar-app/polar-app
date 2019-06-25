import {Firestore} from '../../../firebase/Firestore';
import {EmailStr} from './Profiles';
import {ISODateTimeString} from '../../../metadata/ISODateTimeStrings';
import {Firebase} from '../../../firebase/Firebase';
import {Collections} from './Collections';

export class Contacts {

    public static readonly COLLECTION = 'contact';

    public static async list(): Promise<ReadonlyArray<Contact>> {

        const app = Firebase.init();
        const user = app.auth().currentUser;
        const uid = user!.uid;

        const firestore = await Firestore.getInstance();

        const query = firestore
            .collection(this.COLLECTION)
            .where('uid', '==', uid);

        const snapshot = await query.get();

        return snapshot.docs.map(current => <Contact> current.data());

    }

    /**
     * Delete all of the user contacts...
     */
    public static async purge() {
        await Collections.deleteByID(this.COLLECTION, () => this.list());
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
