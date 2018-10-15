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

const log = Logger.create();

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
        throw new Error("Not implemented");
    }

    /**
     * Delete the DocMeta file and the underlying doc from the stash.
     *
     */
    public async delete(docMetaFileRef: DocMetaFileRef): Promise<Readonly<DeleteResult>> {
        throw new Error("Not implemented");
    }

    /**
     * Get the DocMeta we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    public async getDocMeta(fingerprint: string): Promise<string | null> {

        const auth = this.app!.auth();

        const user = auth.currentUser;

        Preconditions.assertPresent(auth, "Not authenticated");

        const querySnapshot = await this.firestore!
            .collection(DatastoreCollection.DOC_META)
            // FIXME:
            .where('from', '==', user!.email!)
            .get();

        const docs = querySnapshot.docs;

        if (docs.length === 0) {
            // nothing was found in firebase
            return null;
        }

        if (docs.length === 1) {

            const doc = docs[0];

            const data: RecordHolder<DocMetaHolder> = <any> doc.data();

            return data.value.value;

        }

        throw new Error("Too many results: " + docs.length);

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

        // FIXME: compute a SHA1 based on the Firebase user ID + the hash of
        // the fingerprint.  While anyone could compute this publicly and look
        // at the source here, the firebase rules would prevent them from
        // actually overwriting it.  We CAN use the firebase automatically
        // generated ID for documents but since we

        // FIXME: t his is wrong.. someone could generate ane write a document
        // for that user a-priori which would be shit... maybe use some sort
        // of private user ID?  Would this even be faster than using and index?
        //
        //

        const id = fingerprint;

        const docMetaHolder: DocMetaHolder = {
            docInfo,
            value: data
        };

        const recordHolder: RecordHolder<DocMetaHolder> = {
            id,
            visibility: Visibility.PRIVATE, // FIXME for now.
            value: docMetaHolder
        };

        await this.firestore!
            .collection(DatastoreCollection.DOC_META)
            .doc() // FIXME: right doc ID?
            .set(recordHolder);

    }

    public async getDocMetaFiles(): Promise<DocMetaRef[]> {
        throw new Error("Not implemented");
    }

}

/**
 * Holds a data object literal by value. This contains the high level information
 * about a document including the ID and the visibility.  The value object
 * points to a more specific object which hold the actual data we need.
 */
export interface RecordHolder<T> {
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
