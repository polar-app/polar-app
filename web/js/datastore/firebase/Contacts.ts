import {Firestore} from '../../firebase/Firestore';
import {Firebase} from '../../firebase/Firebase';
import {Hashcodes} from '../../Hashcodes';

const COLLECTION_NAME = 'contact';

export class ContactsUsingEmail {

    // public static async create(email: string) {
    //
    //     const firestore = await Firestore.getInstance();
    //
    //     const user = await Firebase.currentUser();
    //
    //     const query = firestore
    //         .collection(COLLECTION_NAME)
    //         .where('uid', '==', user!.uid)
    //         .where('email', '==', email);
    //
    //     const snapshot = await query.get({source: 'server'});
    //
    //     const docs = snapshot.docs;
    //
    //     if (docs.length >= 1) {
    //         return <Contact> docs[0].data();
    //     }
    //
    //     return undefined;
    //
    // }

    public static async get(email: string): Promise<Contact | undefined> {

        const firestore = await Firestore.getInstance();

        const user = await Firebase.currentUser();

        const query = firestore
            .collection(COLLECTION_NAME)
            .where('uid', '==', user!.uid)
            .where('email', '==', email);

        const snapshot = await query.get({source: 'server'});

        const docs = snapshot.docs;

        if (docs.length >= 1) {
            return <Contact> docs[0].data();
        }

        return undefined;

    }

    public static async getOrCreate(email: string,
                                    init: ContactInit | ContactBase): Promise<Contact> {

        const contact = await this.get(email);

        if (contact) {
            return contact;
        }

        const rels: Rel[] = ['shared'];

        const newContact = {
            email, rels, ...init
        };

        await Contacts.write(newContact);

        const result = await this.get(email);

        if (! result) {
            throw new Error("Unable to find email for: " + email);
        }

        return result!;

    }

}

export class Contacts {

    public static createID() {
        return Hashcodes.createRandomID(20);
    }


    /**
     * Create a new shared URL which includes a download token which can be
     * shared publicly.
     */
    public static async write(contact: ContactInit) {

        const id = this.createID();
        const user = await Firebase.currentUser();
        const uid = user!.uid;

        const firestore = await Firestore.getInstance();

        const ref = firestore
            .collection(COLLECTION_NAME)
            .doc(id);

        const record: Contact = {id, uid, ...contact};

        await ref.set(record);

    }


}

export interface ContactBase {

    /**
     *  The email for a user (if we have it) as this could have been added as
     *  a shared relation at which point we DO have the email otherwise it
     *  could just be a friend and we wouldn't have their contact information.
     */
    readonly email: string | null;

    readonly name: string | null;

    readonly image: Image | null;

}

export interface ContactInit extends ContactBase {

    readonly rels: ReadonlyArray<Rel>;

}

export interface Contact extends ContactInit {

    readonly uid: string;

    readonly id: string;

}

export type Rel = 'friend' | 'shared';

export interface Image {
    readonly url: string;
    readonly size: Size | null;
}

export interface Size {
    readonly width: number;
    readonly height: number;
}

