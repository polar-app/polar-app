import {EmailStr} from './DocPermissions';
import {Hashcodes} from '../../Hashcodes';
import {Firebase} from '../../firebase/Firebase';
import {Firestore} from '../../firebase/Firestore';
import {DocPeers} from './DocPeers';
import {Image} from './Contacts';
import {ContactsUsingEmail} from './Contacts';
import {ISODateTimeString} from '../../metadata/ISODateTimeStrings';
import {ISODateTimeStrings} from '../../metadata/ISODateTimeStrings';
import {DocPeer} from './DocPeers';

const COLLECTION_NAME = 'doc_peer_pending';

export class DocPeerPendings {

    public static createID() {
        return Hashcodes.createRandomID(20);
    }


    /**
     * Create a new shared URL which includes a download token which can be
     * shared publicly.
     */
    public static async write(docPeerPending: DocPeerPendingInit) {

        const id = this.createID();

        const firestore = await Firestore.getInstance();

        const ref = firestore
            .collection(COLLECTION_NAME)
            .doc(id);

        const created = ISODateTimeStrings.create();

        const user = await Firebase.currentUser();

        const image = user!.photoURL ? {url: user!.photoURL, size: null} : null;

        const from: Sender = {
            name: user!.displayName || "",
            email: user!.email!,
            image
        };

        const record: DocPeerPending = {id, from, created, ...docPeerPending};

        await ref.set(record);

    }

    /**
     * Get all the pending doc peers for the currently signed in user.
     *
     * We then migrate these over to the doc_peer table once they are accepted.
     */
    public static async get(): Promise<ReadonlyArray<DocPeerPending>>  {

        const firestore = await Firestore.getInstance();

        const user = await Firebase.currentUser();

        const query = firestore
            .collection(COLLECTION_NAME)
            .where('to', '==', user!.email);

        const snapshot = await query.get({source: 'server'});

        const docs = snapshot.docs;

        return docs.map(current => <DocPeerPending> current.data());

    }

    public static async delete(id: string) {

        const firestore = await Firestore.getInstance();

        const ref = firestore
            .collection(COLLECTION_NAME)
            .doc(id);

        await ref.delete();

    }

    public static async accept(pending: DocPeerPending): Promise<DocPeer>{

        // first get all the pending requests
        const docPeerPendings = await this.get();

        // then sort them as we may have been invited N times.
        const ranked =
            docPeerPendings.filter(current => current.from.email === pending.from.email)
                .sort((a, b) => a.created.localeCompare(b.created))
                .reverse();

        // get the primary one (most recent)
        const primary = ranked[0];

        const contact = await ContactsUsingEmail.getOrCreate(primary.from.email, primary.from);

        const docPeer = await DocPeers.write({
            token: primary.token,
            reciprocal: primary.reciprocal,
            contact_id: contact.id,
            docID: primary.docID
        });

        // now delete the remaining.
        for (const docPeerPending of docPeerPendings) {
            await this.delete(docPeerPending.id);
        }

        return docPeer;

    }

}

export interface DocPeerPendingInit {

    readonly to: EmailStr;

    readonly token: string;

    readonly message: string;

    readonly reciprocal: boolean;

    /**
     * The actual DocID we're working with.
     */
    readonly docID: DocIDStr;

}

export interface DocPeerPending extends DocPeerPendingInit {

    /**
     * The record for this entry.
     */
    readonly id: string;

    /**
     * We have to keep the sender so that when we go to accept the doc we
     * actually know who it's from.
     */
    readonly from: Sender;

    readonly created: ISODateTimeString;
}

export interface Sender {
    readonly name: string;
    readonly email: string;
    readonly image: Image | null;
}

export type DocIDStr = string;
