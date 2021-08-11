import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {Collections} from "polar-firestore-like/src/Collections";
import {Preconditions} from 'polar-shared/src/Preconditions';
import {EmailStr} from "polar-firebase/src/firebase/om/ProfileCollection";

import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";

import DocumentChange = Collections.DocumentChangeValue;


export class ContactCollection {

    public static readonly COLLECTION = 'contact';

    public static async list(): Promise<ReadonlyArray<Contact>> {

        const user = await FirebaseBrowser.currentUserAsync();
        const {uid} = Preconditions.assertPresent(user, 'user');
        const firestore = await FirestoreBrowserClient.getInstance();

        return await Collections.list(firestore ,this.COLLECTION, [['uid' , '==', uid]]);

    }

    public static async onSnapshot(delegate: (records: ReadonlyArray<DocumentChange<Contact>>) => void) {

        const user = await FirebaseBrowser.currentUserAsync();
        const {uid} = Preconditions.assertPresent(user, 'user');
        const firestore = await FirestoreBrowserClient.getInstance();

        return Collections.onQuerySnapshotChanges(firestore, this.COLLECTION, [['uid' , '==', uid]], delegate);

    }

    /**
     * Delete all of the user contacts...
     */
    public static async purge() {
        const firestore = await FirestoreBrowserClient.getInstance();
        const batch = firestore.batch();
        
        await Collections.deleteByID(firestore, this.COLLECTION, batch, () => this.list());
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
