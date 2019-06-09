import {Firestore} from '../../firebase/Firestore';
import {ISODateTimeStrings} from '../../metadata/ISODateTimeStrings';
import {ISODateTimeString} from '../../metadata/ISODateTimeStrings';
import {FirebaseDatastore} from '../FirebaseDatastore';
import {FirebaseDocMetaID} from '../FirebaseDatastore';
import * as firebase from '../../firebase/lib/firebase';
import {Firebase} from '../../firebase/Firebase';

const COLLECTION_NAME = 'shared_url';

/**
 *
 * The doc_permission table provides a system to allow us to lookup documents
 * based on their primary doc ID and then grant access to readers directly.
 *
 * The backend hook system allow us to can take a private / internal URL and
 * convert it to an external (shared) URL without exposing the private internal
 * URL and we also give users the ability to revoke permissions.
 *
 * This system has three types of URLs:
 *
 * internalURL: The actual URL for the document we're sharing.  We only need to
 * store the backend and the name of the file to be able to construct this.
 *
 * signedURL: used within the google cloud which proxies to the internalURL
 * without exposing it.
 *
 * sharedURL: That the user sees and is publicly viewable on the Internet and
 * is computed based on the doc ID and file informatil.
 *
 *      doc_permission
 *          Stores the metadata around permissions for that given document.
 *          key is the doc_meta_id like in the FirebaseDatastore.
 *
 *          fingerprint
 *          uid
 *          recipient: recipient[]
 *
 *      the download URL should be computed as
 *
 *          /fetch?id={doc_meta_id}&backend={backend}&file={file}
 *
 *      this system is enough to compute the target URL that should be fetched
 *
 */
export class DocPermissions {

    private static firestore?: firebase.firestore.Firestore;

    /**
     * Create a new shared URL which includes a download token which can be
     * shared publicly.
     */
    public static async write(fingerprint: string,
                              recipients: readonly Recipient[]) {

        const user = await Firebase.currentUser();

        const {uid} = user!;

        const id = FirebaseDatastore.computeDocMetaID(fingerprint, uid);

        const docPermission: DocPermission = {
            id,
            uid,
            fingerprint,
            recipients,
            lastUpdated: ISODateTimeStrings.create()
        };

        await this.writeDocPermission(docPermission);
    }

    private static async writeDocPermission(docPermission: DocPermission) {

        const {id} = docPermission;

        const firestore = await this.getFirestore();

        const ref = firestore
            .collection(COLLECTION_NAME)
            .doc(id);

        await ref.set(docPermission);

    }

    private static async getFirestore(): Promise<firebase.firestore.Firestore> {

        if (this.firestore) {
            return this.firestore;
        } else {
            this.firestore = await Firestore.getInstance();
            return this.firestore!;
        }


    }

}

/**
 * We only need the backend and the name of the file to be able to compute the
 * internal URL.
 */
interface DocPermission {

    /**
     * The ID record for this doc.
     */
    readonly id: FirebaseDocMetaID;

    /**
     * The uid of the user sharing this doc file.
     */
    readonly uid: string;

    /**
     * The fingerprint for this document
     */
    readonly fingerprint: string;


    readonly recipients: readonly Recipient[];

    readonly lastUpdated: ISODateTimeString;

}

/**
 * A team string of team:0x000 where 'foo' is the ID of the team.
 */
export type TeamStr = string;

/**
 * A mailto email address of mailto:alice@example.com
 */
export type EmailStr = string;

/**
 * A token:id string that we keep in the users account so that they can access
 * documents JUST by token.
 */
export type TokenStr = string;

export type Recipient = 'public' | TokenStr | TeamStr | EmailStr;
