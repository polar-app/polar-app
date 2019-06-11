import {Hashcodes} from '../../Hashcodes';
import {Firebase} from '../../firebase/Firebase';
import {Firestore} from '../../firebase/Firestore';
import {ISODateTimeString} from '../../metadata/ISODateTimeStrings';
import {ISODateTimeStrings} from '../../metadata/ISODateTimeStrings';
import {DocIDStr} from './DocPeerPendings';

const COLLECTION_NAME = 'doc_peer';

export class DocPeers {

    public static createID() {
        return Hashcodes.createRandomID(20);
    }


    /**
     * Create a new shared URL which includes a download token which can be
     * shared publicly.
     */
    public static async write(docPeer: DocPeerInit): Promise<DocPeer> {

        const id = this.createID();

        const firestore = await Firestore.getInstance();

        const user = await Firebase.currentUser();

        const uid = user!.uid;

        const ref = firestore
            .collection(COLLECTION_NAME)
            .doc(id);

        const created = ISODateTimeStrings.create();

        const record: DocPeer = {id, created, uid, ...docPeer};

        await ref.set(record);

        return record;

    }

}

export interface DocPeerInit {

    readonly token: string;

    readonly reciprocal: boolean;

    /**
     * The record for the user in the users contacts.
     */
    readonly contact_id: string;

    /**
     * The actual DocID we're working with.
     */
    readonly docID: DocIDStr;

    readonly fingerprint: string;

}

export interface DocPeer extends DocPeerInit {
    readonly id: string;
    readonly uid: string;
    readonly created: ISODateTimeString;
}
