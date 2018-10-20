import {Datastore, FileMeta} from './Datastore';
import {Logger} from '../logger/Logger';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {Directories} from './Directories';

import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {DeleteResult} from './DiskDatastore';
import {Firestore} from '../firestore/Firestore';
import {Firebase} from '../firestore/Firebase';
import {DocInfo, IDocInfo} from '../metadata/DocInfo';
import {Preconditions} from '../Preconditions';
import {Hashcodes} from '../Hashcodes';

const log = Logger.create();

// You can allow users to sign in to your app using multiple authentication
// providers by linking auth provider credentials to an existing user account.
// Users are identifiable by the same Firebase user ID regardless of the
// authentication provider they used to sign in. For example, a user who signed
// in with a password can link a Google account and sign in with either method
// in the future. Or, an anonymous user can link a Facebook account and then,
// later, sign in with Facebook to continue using your app.

export class FirebaseDatastore implements Datastore {

    public readonly stashDir: string;

    public readonly logsDir: string;

    public readonly directories: Directories;

    private app?: firebase.app.App;

    private firestore?: firebase.firestore.Firestore;

    constructor() {

        this.directories = new Directories();

        // the path to the stash directory
        this.stashDir = this.directories.stashDir;
        this.logsDir = this.directories.logsDir;

    }

    public async init() {
        this.app = Firebase.init();
        this.firestore = Firestore.getInstance();
    }

    /**
     * Return true if the DiskDatastore contains a document for the given
     * fingerprint
     */
    public async contains(fingerprint: string): Promise<boolean> {

        // TODO: I don't think there's an efficient way to do this on Firebase
        // since we're paying for the query. If we call this method and end up
        // needing the doc it's just better to get the doc directly.
        return await this.getDocMeta(fingerprint) !== null;

    }

    /**
     * Delete the DocMeta file and the underlying doc from the stash.
     *
     */
    public async delete(docMetaFileRef: DocMetaFileRef): Promise<Readonly<DeleteResult>> {

        const uid = this.getUserID();
        const id = this.computeDocMetaID(uid, docMetaFileRef.fingerprint);

        const documentSnapshot = await this.firestore!
            .collection(DatastoreCollection.DOC_META)
            .doc(id)
            .delete();

        // FIXME: this is VERY wrong but for now DeleteResult assumes the filesystem
        // but instead we should return a generic DeleteResult and have a DiskDeleteResult
        // and a FirebaseDeleteResult in the future.

        return null!;

    }

    /**
     * Get the DocMeta we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    public async getDocMeta(fingerprint: string): Promise<string | null> {

        const uid = this.getUserID();
        const id = this.computeDocMetaID(uid, fingerprint);

        const documentSnapshot = await this.firestore!
            .collection(DatastoreCollection.DOC_META)
            .doc(id)
            .get();

        if ( ! documentSnapshot.exists) {
            // nothing was found in firebase
            return null;
        }

        const data: RecordHolder<DocMetaHolder> = <any> documentSnapshot.data();

        return data.value.value;

    }


    public async addFile(backend: Backend, name: string, data: Buffer | string, meta: FileMeta = {}): Promise<DatastoreFile> {
        throw new Error("Not implemented");
    }

    public async getFile(backend: Backend, name: string): Promise<Optional<DatastoreFile>> {
        throw new Error("Not implemented");
    }

    public containsFile(backend: Backend, name: string): Promise<boolean> {
        throw new Error("Not implemented");
    }

    /**
     * Write the datastore to disk.
     */
    public async sync(fingerprint: string, data: string, docInfo: DocInfo) {

        const uid = this.getUserID();
        const id = this.computeDocMetaID(uid, fingerprint);

        const docMetaHolder: DocMetaHolder = {
            docInfo,
            value: data
        };

        const recordHolder: RecordHolder<DocMetaHolder> = {
            uid,
            id,
            visibility: Visibility.PRIVATE,
            value: docMetaHolder
        };

        await this.firestore!
            .collection(DatastoreCollection.DOC_META)
            .doc(id)
            .set(recordHolder);

    }

    public async getDocMetaFiles(): Promise<DocMetaRef[]> {

        throw new Error("Not implemented");


    }

    private computeDocMetaID(uid: UserID, fingerprint: string) {
        return Hashcodes.createID(uid + ':' + fingerprint, 32);
    }

    private getUserID(): UserID {

        const auth = this.app!.auth();
        Preconditions.assertPresent(auth, "Not authenticated");

        const user = auth.currentUser;
        Preconditions.assertPresent(user, "Not authenticated");

        return user!.uid;
    }

}

/**
 * Holds a data object literal by value. This contains the high level information
 * about a document including the ID and the visibility.  The value object
 * points to a more specific object which hold the actual data we need.
 */
export interface RecordHolder<T> {

    // the owner of this record.
    readonly uid: UserID;

    // the visibilty of this record.
    readonly visibility: Visibility;

    readonly id: string;

    readonly value: T;

}

export interface DocMetaHolder {

    // expose the high level DocInfo on this object which allows us to search by
    // URL, tags, etc.
    readonly docInfo: IDocInfo;

    readonly value: string;

}


export enum Visibility {

    /**
     * Only visible for the user.
     */
    PRIVATE,

    /**
     * Only to users that
     */
    FOLLOWING,

    /**
     * To anyone on the service.
     */
    PUBLIC

}

enum DatastoreCollection {

    DOC_META = "doc_meta"

}

type UserID = string;
