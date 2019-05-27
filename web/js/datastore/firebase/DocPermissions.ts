import {Firestore} from '../../firebase/Firestore';
import {ISODateTimeStrings} from '../../metadata/ISODateTimeStrings';
import {Hashcodes} from '../../Hashcodes';
import {FirebaseDatastore} from '../FirebaseDatastore';
import * as firebase from '../../firebase/lib/firebase';
import {Backend} from '../Backend';
import {BackendFileRef} from '../Datastore';
import {Firebase} from '../../firebase/Firebase';
import {Optional} from '../../util/ts/Optional';
import {FirebaseDocMetaID} from '../FirebaseDatastore';

const COLLECTION_NAME = 'shared_url';

/**
 * Provides a system so that we can taken a private / internal URL and convert
 * it to an external (shared) URL without exposing the private internal URL and
 * we also give users the ability to revoke permissions.
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
 *          permissions: permission[]
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

    // FIXME: this is a problem because in the UI we are generating a custom
    // download URL for the file but the OTHER resources will not have this
    // param so we're unable to get them. I might have to have a way to store
    // this in the main JSON file itself so that I can get access to it from
    // within all layers of the system.
    //
    // In fact, yes I do because the getFile() method will need this metadata
    // to build a NEW type of URL for each file which we can COMPUTE of course
    // but I need a hint to be able to do it.
    //
    // TODO: I can fix this by putting this metadata in the FileRef so that when
    // the user calls BackendFileRefs.toBackendFileRefs I can compute/add the
    // required metadata that needs to be attached to the FileRef to denote
    // whether they are the owner or not and who the owner is and how we build
    // the URL properly.  What metadata do I need to include?
    //
    //  - if I can keep the DocMetaID in the doc itself then what I can do is
    //    use THAT to store the keys I need to lookup the file and compute the
    //    URL myself but what am I going to call this new field.
    //
    //  - what are we going to call this file??
    //
    //  - we can specify to load a specific doc_id in the URL for the viewer
    //    rather than loading a fingerprint but right this isn't supported.
    //
    //  - I think the BEST way to do this is to have a sharedWith param and then
    //    have a set of additional doc meta IDs there and then fetch those and
    //    store them along side the main this way the user can add the main
    //    document and it seems like a normal document to them but we have
    //    additional metadata as a new state.json file but it's referenced via
    //    its doc_meta_id directly and not the users own doc_meta_id. this way
    //    the user can turn on/;off.

    /**
     * Create a new shared URL which includes a download token which can be
     * shared publicly.
     */
    public static async update(fingerprint: string,
                               recipient: Recipient = 'public',
                               type: 'add' | 'remove') {

        const user = await Firebase.currentUser();

        const {uid} = user!;

        const id = FirebaseDatastore.computeDocMetaID(fingerprint, uid);

        const docPermission: DocPermission = {
            id,
            uid,
            recipient,
            type,
            fingerprint,
            docID
        };

        await this.writeDocPermission(docPermission);

        return sharedURL;
    }

    private static async writeDocPermission(docPermission: DocPermission) {

        const {downloadToken} = sharedDoc;
        const id = downloadToken;

        const firestore = await this.getFirestore();

        const ref = firestore
            .collection(COLLECTION_NAME)
            .doc(id);

        await ref.set(sharedDoc);

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

export type Recipient = 'public';

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
     * The fingerprint for this document
     */
    readonly fingerprint: string;

    /**
     * The uid of the user sharing this doc file.
     */
    readonly uid: string;

    readonly recipients: Recipient;

}

/**
 * A team string of team:foo where 'foo' is the name of the team
 */
type TeamStr = string;

/**
 * Normal email address.
 */
type EmailStr = string;

type Recipient = 'public' | TeamStr | EmailStr;
