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
 * sharedURL: That the user sees and is publicly viewable on the Internet.
 *
 * The underlying scheme here needs two records.
 *
 * shared_url:
 *
 *       Stores a mapping between the downloadToken (as id) and the backend and
 *       name of file so we can compute the internalURL and a signedURL to
 *       return to the user.
 *          uid: number : The user id of the user who owns the document.
 *          type: media type that this represents.
 *
 *       firebase ACL/permissions:
 *          read: ONLY the user and admin
 *          write: ONLY the user
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
 *
 *          TODO/FIXME: the id or the fingerprint or the docinfo?
 *
 *       firebase ACL/permissions:
 *          read: ONLY the user and admin
 *          write: ONLY the user
 *
 *       TODO: for the /users/:handle page we need a way to list files that the
 *       user performing the read has access to and then query those...  Right
 *       now though we only
 *
 *       TODO: the one downside though is that we're going to need a way to have
 *       a public timeline.
 *
 *       TODO: one issue is that MANY resources (not just the main one) are
 *       required.  Including pdf and image resources.
 *
 *       TODO: to find the main docs the user is indexing all we need to do is
 *       either group by doc_id or something or look at the type.
 *
 * Removing permissions requires a batch operation to remove the shared_url
 * and the entry from the shared_doc for that recipient at once using array
 * operations since a doc can be shared with more than one person.
 *
 *       TODO: a better design would be to give a DocMetaID (fingerprint+uid hash)
 *       and then the download token, and then the file ref information and then
 *       resolve it properly to the backend URL ourselves.  This way we don't
 *       need one entry per binary file type nor do we need the mime type
 *       and this also makes for the primary setting for the file.
 *
 *       FIXME: this won't REALLY work though because the unique metadata is
 *       encoded into the file in fact if we EVER give it out then it's
 *       permanently shared and can't be revoked.
 *
 *         - this could be fixed if we blinded it with metadata from the user
 *           that isn't computed locally but computed on the backend or locally
 *           per each user.
 *
 *         - the download token would be used to compute the URL directly I think
 *           and maybe we could encrypt the users user ID within it directly so
 *           that we can decrypt it on the backend, apply the user ID and the
 *           compute the RIGHT download URL.
 *
 *         - The major problem is how do we migrate to this NEW system. I could
 *           potentially have metadata within the files so that lookup is
 *           completely custom or has a prefix so to enable us to lookup
 *           directly.
 *
 *         - actually!  We do this already with computeStoragePath so I think I
 *           just need to do the following:
 *              - make sure the uid is stored with teh downloadToken and never given
 *                to the user
 *              - they give us a BackendFileRef in the URL
 *              - we lookup the download token, verify their access, compute the
 *                correct download URL , then create the signed URL from the
 *                download URL and then hand that out.
 *
 *              - the user can also revoke the downloadToken at ANY time...
 */
export class SharedDocFiles {

    private static firestore?: firebase.firestore.Firestore;

    /**
     * Create a new shared URL which includes a download token which can be
     * shared publicly.
     */
    public static async create(fingerprint: string,
                               backendFileRef: BackendFileRef,
                               type: BinaryFileType,
                               recipient: Recipient = 'public'): Promise<SharedURL> {

        // FIXME: we have to first get all the DocFiles for this
        // document to change their permissions.

        // FIXME: for any NEW writes of files we have to automatically share
        // the binary images there too.  Need tests for that.

        const {backend, name} = backendFileRef;

        const downloadToken = DownloadTokens.createToken();

        const sharedURL = `https://us-central1-polar-cors.cloudfunctions.net/fetch/?downloadToken=${downloadToken}`;

        const user = await Firebase.currentUser();

        const {uid} = user!;

        const docID = FirebaseDatastore.computeDocMetaID(fingerprint, uid);

        // TODO when writing NEW binary file attachments we need a cheap way
        // to lookup the previous perms and inherit them. Maybe it would be
        // easier to have ONE download token for the main doc and ALL the
        // attachments for it...

        // FIXME: also, the URL now needs to be computed without async right?
        // this completely botches our strategy doesn't it?
        //
        //

        const sharedDoc: SharedDocFile = {
            id: downloadToken,
            backend,
            name,
            downloadToken,
            sharedURL,
            uid,
            recipient,
            type,
            fingerprint,
            docID
        };

        await this.writeSharedDoc(sharedDoc);

        return sharedURL;
    }

    private static async writeSharedDoc(sharedDoc: SharedDocFile) {

        const {downloadToken} = sharedDoc;
        const id = downloadToken;

        const firestore = await this.getFirestore();

        const ref = firestore
            .collection(COLLECTION_NAME)
            .doc(id);

        await ref.set(sharedDoc);

    }

    /**
     * Resolve a downloadToken to the internalURL.
     */
    public static async resolve(downloadToken: DownloadToken): Promise<SharedDocFile | undefined> {

        const firestore = await this.getFirestore();

        const id = downloadToken;

        const ref = firestore
            .collection(COLLECTION_NAME)
            .doc(id);

        const doc = await ref.get();

        if (doc.exists) {
            return <SharedDocFile> doc.data();
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

    public static parse(sharedURL: SharedURL): SharedDocFileMeta {
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

interface SharedDocFileMeta {
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

export type Recipient = 'public';

/**
 * We only need the backend and the name of the file to be able to compute the
 * internal URL.
 */
interface SharedDocFile extends SharedDocFileMeta {

    readonly id: SharedURLRecordID;

    readonly backend: Backend;

    readonly name: string;

    /**
     * The uid of the user sharing this doc file.
     */
    readonly uid: string;

    readonly recipient: Recipient;

    /**
     * Used so we know what type is actually stored at the remote URL.
     */
    readonly type: BinaryFileType;

    /**
     * True if this is the main resource for the document (PHZ, PDF, EPUB, etc)
     * and not the images or other misc attachments.
     */
    readonly main: boolean;

    readonly fingerprint: string;

    readonly docID: FirebaseDocMetaID;

}

export type BinaryFileType = 'image/jpeg' |
                             'image/png' |
                             'image/svg' |
                             'image/webp' |
                             'application/pdf' |
                             'application/octet-stream';

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
