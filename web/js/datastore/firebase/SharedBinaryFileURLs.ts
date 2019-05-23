import {Firestore} from '../../firebase/Firestore';
import {ISODateTimeStrings} from '../../metadata/ISODateTimeStrings';
import {Hashcodes} from '../../Hashcodes';
import {FirebaseDatastore} from '../FirebaseDatastore';
import * as firebase from '../../firebase/lib/firebase';
import {Backend} from '../Backend';
import {BackendFileRef} from '../Datastore';

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
 * sharedURL: That the user sees and is publicly viewable on the Internet.
 *
 * The underlying scheme here needs two records.
 *
 * shared_url:
 *
 *       Stores a mapping between the downloadToken (as id) and the backend and
 *       name of file so we can compute the internalURL and a signedURL to
 *       return to the user.
 *
 *       firebase ACL/permissions:
 *          read: ONLY the user and admin
 *          write: ONLY the user
 *
 *       TODO/FIXME: we need an object for this. Right now SharedURL is a
 *       string and we should have a SharedURL object.  Maybe a
 *       SharedURLStr...
 *
 * shared_permissions:
 *       Stores a shared file permissions for a user with the id computed
 *       from the id of doc and then a list of permissions that this user has
 *       handed out to other users on the Internet.
 *
 *       This is needed allow the user to keep track of WHO has permissions to
 *       each of his documents to revoke individual permissions for individual
 *       users or teams.
 *
 *       This way in the permissions dialog they can see all the files they've
 *       shared and who has access to each file so that they can change
 *       them from one location.
 *
 *       We can also use this table to lookup permissions for a file and show
 *       the user an icon next to each file on the permissions.
 *
 *       schema:
 *          uid: number : The user id of the user who owns the document.
 *          target: 'public'
 *              JUST public for now.. We are going to make other types like
 *              groups and users in the future.
 *          TODO/FIXME: the id or the fingerprint or the docinfo?
 *
 *       firebase ACL/permissions:
 *          read: ONLY the user and admin
 *          write: ONLY the user
 *
 *       TODO: for the /users/:handle page we need a way to list files that the
 *       current user has access to and then query those... Maybe the best way
 *       to do this is to denormalize everything on writes / deletes / updates
 *       and just have fan-out configure the permissions.
 *
 *
 * Removing permissions requires a batch operation to remove the shared_url
 * and the entry from the shared_doc for that recipient at once using array
 * operations since a doc can be shared with more than one person.
 *
 */
export class SharedBinaryFileURLs {

    private static firestore?: firebase.firestore.Firestore;

    /**
     * Create a new shared URL which includes a download token which can be
     * shared publicly.
     */
    public static async create(backendFileRef: BackendFileRef): Promise<SharedURL> {

        const {backend, name} = backendFileRef;

        const downloadToken = DownloadTokens.createToken();

        const sharedURL = `https://us-central1-polar-cors.cloudfunctions.net/fetch/?downloadToken=${downloadToken}`;

        const sharedURLRecord: SharedURLRecord = {
            id: downloadToken,
            backend,
            name,
            downloadToken,
            sharedURL
        };

        await this.writeSharedURL(sharedURLRecord);

        return sharedURL;
    }

    private static async writeSharedURL(sharedURLRecord: SharedURLRecord) {

        const {downloadToken} = sharedURLRecord;
        const id = downloadToken;

        const firestore = await this.getFirestore();

        const ref = firestore
            .collection(COLLECTION_NAME)
            .doc(id);

        await ref.set(sharedURLRecord);

    }


    private static async writeSharedDoc() {
        // noop for now
    }

    /**
     * Resolve a downloadToken to the internalURL.
     */
    public static async resolve(downloadToken: DownloadToken): Promise<SharedURLRecord | undefined> {

        const firestore = await this.getFirestore();

        const id = downloadToken;

        const ref = firestore
            .collection(COLLECTION_NAME)
            .doc(id);

        const doc = await ref.get();

        if (doc.exists) {
            return <SharedURLRecord> doc.data();
        }

        return undefined;

    }

    public static async revoke(downloadToken: DownloadToken) {

        const firestore = await this.getFirestore();

        const id = downloadToken;

        const ref = firestore
            .collection(COLLECTION_NAME)
            .doc(id);

        await ref.delete();

    }

    public static parse(sharedURL: SharedURL): SharedURLMeta {
        const parsedURL = new URL(sharedURL);

        const downloadToken = parsedURL.searchParams.get('downloadToken');

        if (downloadToken) {
            return {downloadToken, sharedURL};
        }

        throw new Error("Not a shared URL: " + sharedURL);

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

type SharedURL = string;

interface SharedURLMeta {
    readonly sharedURL: SharedURL;
    readonly downloadToken: DownloadToken;
}

export type SharedURLRecordID = string;

class SharedURLRecordIDs {

    public static create(downloadToken: DownloadToken) {
        // the download token is already a good ID to use because we need
        // constant time lookup for the token to the record.
        return downloadToken;
    }

}

/**
 * We only need the backend and the name of the file to be able to compute the
 * internal URL.
 */
interface SharedURLRecord extends SharedURLMeta {

    readonly id: SharedURLRecordID;

    readonly backend: Backend;

    readonly name: string;
}

type DownloadToken = string;

/**
 * Maintains a system of tokens that user scan use to share internal Polar URLs
 * with other people without revealing the actual URL.
 */
class DownloadTokens {

    /**
     * Create an ID that we hand out that we can revoke later if we want.
     */
    public static createToken(): DownloadToken {

        const uid = FirebaseDatastore.getUserID();

        const timestamp = ISODateTimeStrings.create();

        const rand = Math.floor(Math.random() * 1000000);
        const hashcodeData = {uid, timestamp, rand};

        return Hashcodes.createID(hashcodeData, 20);

    }

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

export type SharedBinaryFileID = string;

interface SharedBinaryFile {

    readonly id: SharedBinaryFileID;

    /**
     * Grants to access this file.
     */
    readonly grants: ReadonlyArray<SharedBinaryFileGrant>;

}

export type SharedBinaryFileGrantID = string;

/**
 * An individual grant with the recipient.
 */
interface SharedBinaryFileGrant {
    id: SharedBinaryFileGrantID;
    recipient: Recipient;
    downloadToken: DownloadToken;
}
