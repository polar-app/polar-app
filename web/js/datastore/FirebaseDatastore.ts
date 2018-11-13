import {BinaryMutationEvent, Datastore, DeleteResult,
        DocMutationEvent, FileMeta, InitResult,
        DocReplicationEvent, SynchronizingDatastore} from './Datastore';
import {Logger} from '../logger/Logger';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {Directories} from './Directories';

import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {Firestore} from '../firestore/Firestore';
import {DocInfo, IDocInfo} from '../metadata/DocInfo';
import {Preconditions} from '../Preconditions';
import {Hashcodes} from '../Hashcodes';
import * as firebase from '../firestore/lib/firebase';
import {Dictionaries} from '../util/Dictionaries';
import {DatastoreFiles} from './DatastoreFiles';
import {DatastoreMutation, DefaultDatastoreMutation} from './DatastoreMutation';
import {IEventDispatcher, SimpleReactor} from '../reactor/SimpleReactor';
import {NULL_FUNCTION} from '../util/Functions';

const log = Logger.create();

// You can allow users to sign in to your app using multiple authentication
// providers by linking auth provider credentials to an existing user account.
// Users are identifiable by the same Firebase user ID regardless of the
// authentication provider they used to sign in. For example, a user who signed
// in with a password can link a Google account and sign in with either method
// in the future. Or, an anonymous user can link a Facebook account and then,
// later, sign in with Facebook to continue using your app.

//
// TODO: all files need to also have associated metadata in firestore and
// the binary data is stored in firebase storage.

export class FirebaseDatastore implements Datastore, SynchronizingDatastore {

    public readonly stashDir: string;

    public readonly logsDir: string;

    public readonly directories: Directories;

    private app?: firebase.app.App;

    private firestore?: firebase.firestore.Firestore;

    private storage?: firebase.storage.Storage;

    private readonly binaryMutationReactor: IEventDispatcher<BinaryMutationEvent> = new SimpleReactor();

    private readonly docMutationReactor: IEventDispatcher<DocMutationEvent> = new SimpleReactor();

    private readonly replicationReactor: IEventDispatcher<DocReplicationEvent> = new SimpleReactor();

    private unsubscribeSnapshots: () => void = NULL_FUNCTION;

    private initialized: boolean = false;

    private readonly pendingMutationIndex: PendingMutationIndex = {};

    constructor() {

        this.directories = new Directories();
        this.stashDir = this.directories.stashDir;
        this.logsDir = this.directories.logsDir;

    }

    public async init(): Promise<InitResult> {

        if (this.initialized) {
            return {};
        }

        // get the firebase app. Make sure we are initialized externally.
        this.app = firebase.app();
        this.firestore = await Firestore.getInstance();
        this.storage = firebase.storage();

        // setup the initial snapshot so that we query for the users existing
        // data...

        const uid = this.getUserID();

        // start synchronizing the datastore.  You MUST register your listeners
        // BEFORE calling init if you wish to listen to the full stream of
        // events.
        this.unsubscribeSnapshots = await this.firestore!
            .collection(DatastoreCollection.DOC_META)
            .where('uid', '==', uid)
            .onSnapshot(snapshot => this.onDocMetaSnapshot(snapshot));

        this.initialized = true;

        return {};

    }

    public async stop() {
        this.unsubscribeSnapshots();
    }

    /**
     * Return true if the DiskDatastore contains a document for the given
     * fingerprint
     */
    public async contains(fingerprint: string): Promise<boolean> {

        // TODO: this isn't particularly efficient now but I don't think we're
        // actually using contains() for anything and we might want to remove
        // it since it's not very efficient if we just call getDocMeta anyway.
        const docMeta = await this.getDocMeta(fingerprint);

        return docMeta !== null;

    }

    /**
     * Delete the DocMeta file and the underlying doc from the stash.
     *
     */
    public async delete(docMetaFileRef: DocMetaFileRef,
                        datastoreMutation: DatastoreMutation<boolean> = new DefaultDatastoreMutation()): Promise<Readonly<DeleteResult>> {

        // FIXME: the PDF data file should be added as a stash file via
        // writeFile so it also needs to be removed.

        // TODO: these could get out of sync and we have to force them to
        // execute together.  The remote delete followed by the local ...

        const uid = this.getUserID();
        const id = this.computeDocMetaID(uid, docMetaFileRef.fingerprint);

        const ref = this.firestore!
            .collection(DatastoreCollection.DOC_META)
            .doc(id);

        this.pendingMutationIndex[id] = {type: 'delete', id};

        try {

            this.handleDatastoreMutations(ref, datastoreMutation);

            const commitPromise = this.waitForCommit(ref);

            const documentSnapshot = await ref.delete();

            await commitPromise;

            // TODO: this is a major hack but we are only deleting remote data here
            // and not deleting any local data so we don't have any path to work
            // with..  Maybe we need to make the DeleteResult an Optional so that
            // it only works on local stores where files are involved or return a
            // specific structure for the DiskDatastore like a DiskDeleteResult
            // which implements DeleteResult but adds additional fields.
            const result: DeleteResult = <DeleteResult> { };

            return result;

        } finally {
            delete this.pendingMutationIndex[id];
        }

    }

    /**
     * Get the DocMeta we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    public async getDocMeta(fingerprint: string): Promise<string | null> {

        const uid = this.getUserID();
        const id = this.computeDocMetaID(uid, fingerprint);

        const ref = this.firestore!.collection(DatastoreCollection.DOC_META).doc(id);

        const snapshot = await ref.get();

        const recordHolder = <RecordHolder<DocMetaHolder> | undefined> snapshot.data();

        if (! recordHolder) {
            return null;
        }

        return recordHolder.value.value;

    }

    // TODO: the cloud storage operations are possibly unsafe and could
    // leave local files in place or too many remote files but this is good
    // for a first MVP pass.

    public async writeFile(backend: Backend,
                           name: string,
                           data: Buffer | string,
                           meta: FileMeta = {}): Promise<DatastoreFile> {

        DatastoreFiles.assertValidFileName(name);

        const storage = this.storage!;

        const fileRef = storage.ref().child(`${backend}/${name}`);

        let uploadTask: firebase.storage.UploadTask;

        if (typeof data === 'string') {
            uploadTask = fileRef.putString(data, 'raw', {customMetadata: meta});
        } else {
            uploadTask = fileRef.put(Uint8Array.from(data), {customMetadata: meta});
        }

        // TODO: we can get progress from the uploadTask here.

        const uploadTaskSnapshot = await uploadTask;

        const downloadURL = uploadTaskSnapshot.downloadURL;

        return {
            backend,
            name,
            url: downloadURL!,
            meta
        };

    }

    public async getFile(backend: Backend, name: string): Promise<Optional<DatastoreFile>> {

        DatastoreFiles.assertValidFileName(name);

        const storage = this.storage!;

        const fileRef = storage.ref().child(`${backend}/${name}`);

        const url: string = await fileRef.getDownloadURL();
        const metadata = await fileRef.getMetadata();
        const meta = metadata.customMetadata;

        return Optional.of({backend, name, url, meta});

    }

    public async containsFile(backend: Backend, name: string): Promise<boolean> {

        DatastoreFiles.assertValidFileName(name);

        // TODO: we should have some cache here to avoid checking the server too
        // often but I don't think this is goign to be used often.

        const storage = this.storage!;
        const fileRef = storage.ref().child(`${backend}/${name}`);

        try {
            await fileRef.getMetadata();
            return true;
        } catch (e) {

            if (e.code === "storage/object-not-found") {
                return false;
            }

            // some other type of exception ias occurred
            throw e;

        }

    }

    public async deleteFile(backend: Backend, name: string): Promise<void> {
        DatastoreFiles.assertValidFileName(name);

        const storage = this.storage!;
        const fileRef = storage.ref().child(`${backend}/${name}`);
        await fileRef.delete();
    }

    /**
     * Write the datastore to disk.
     */
    public async write(fingerprint: string,
                       data: string,
                       docInfo: DocInfo,
                       datastoreMutation: DatastoreMutation<boolean> = new DefaultDatastoreMutation()) {

        const uid = this.getUserID();
        const id = this.computeDocMetaID(uid, fingerprint);

        docInfo = Object.assign({}, Dictionaries.onlyDefinedProperties(docInfo));

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

        const ref = this.firestore!.collection(DatastoreCollection.DOC_META).doc(id);

        this.pendingMutationIndex[id] = {type: 'write', id};

        try {

            this.handleDatastoreMutations(ref, datastoreMutation);

            const commitPromise = this.waitForCommit(ref);

            log.debug("Setting...");
            await ref.set(recordHolder);
            log.debug("Setting...done");

            // we need to make sure that we only return when it's committed
            // remotely...
            log.debug("Waiting for promise...");
            await commitPromise;
            log.debug("Waiting for promise...done");

        } finally {
            delete this.pendingMutationIndex[id];
        }

    }

    public async getDocMetaFiles(): Promise<DocMetaRef[]> {

        const uid = this.getUserID();

        const snapshot = await this.firestore!
            .collection(DatastoreCollection.DOC_META)
            .where('uid', '==', uid)
            .get();

        const result: DocMetaRef[] = [];

        for (const doc of snapshot.docs) {

            const recordHolder = <RecordHolder<DocMetaHolder>> doc.data();

            result.push({fingerprint: recordHolder.value.docInfo.fingerprint});

        }

        return result;

    }

    public addBinaryMutationEventListener(listener: (binaryMutation: BinaryMutationEvent) => void): void {
        this.binaryMutationReactor.addEventListener(listener);
    }

    public addDocMutationEventListener(listener: (docMutation: DocMutationEvent) => void): void {
        this.docMutationReactor.addEventListener(listener);
    }

    public addDocReplicationEventListener(listener: (replicationEvent: DocReplicationEvent) => void): void {
        this.replicationReactor.addEventListener(listener);
    }

    /**
     * Wait for the record to be fully committed to the remote datastore - not
     * just written to the local cache.
     */
    private waitForCommit(ref: firebase.firestore.DocumentReference): Promise<void> {

        return new Promise(resolve => {

            ref.onSnapshot({includeMetadataChanges: true}, snapshot => {

                if (!snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites) {
                    resolve();
                }

            });

        });

    }

    private handleDatastoreMutations(ref: firebase.firestore.DocumentReference,
                                     datastoreMutation: DatastoreMutation<any>) {

        ref.onSnapshot({includeMetadataChanges: true}, snapshot => {

            if (snapshot.metadata.fromCache && snapshot.metadata.hasPendingWrites) {
                datastoreMutation.written.resolve(true);
                log.debug("Got written...");

            }

            if (!snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites) {

                // it's been committed remotely which also implies it was
                // written locally so resolve that as well. We might not always
                // get the locally written callback and I think this happens
                // when the cache entry can't be updated due to it already being
                // pending.

                datastoreMutation.written.resolve(true);
                datastoreMutation.committed.resolve(true);
                log.debug("Got committed...");

            }

        });

    }

    /**
     * Called when new data is available from Firebase so we can solve promises,
     * add things to local stores, etc.
     *
     * ALL operations are done via snapshots which we create and subscribe to
     * on init().
     *
     * This solves to problems:
     *
     * 1. The most important, is that when data is added remotely (the user is
     *    on another machine and this machine-rejoins the network or detects
     *    changes) then content if pulled locally and added to the local
     *    datastore.
     *
     * 2. Local data is added via the same code path.  The code path is remote-
     *    first but then then immediately resolved from the cache and added
     *    locally.
     */
    private onDocMetaSnapshot(snapshot: firebase.firestore.QuerySnapshot) {

        log.debug("onSnapshot... ");

        const messagesElement = document.getElementById('messages')!;

        for (const docChange of snapshot.docChanges()) {

            const record = <RecordHolder<DocMetaHolder>> docChange.doc.data();
            const id = record.id;

            const docMutationEvent: DocMutationEvent = {
                docInfo: record.value.docInfo,
                mutationType: docChange.type
            };

            const docReplicationEvent: DocReplicationEvent = docMutationEvent;

            this.docMutationReactor.dispatchEvent(docMutationEvent);

            if (!this.pendingMutationIndex[id]) {
                this.replicationReactor.dispatchEvent(docReplicationEvent);
            }

        }

        log.debug("onSnapshot... done");

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
 * Holds a data object literal by value. This contains the high level
 * information about a document including the ID and the visibility.  The value
 * object points to a more specific object which hold the actual data we need.
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

/**
 * The result of a FB database mutation.
 */
interface Mutation {

}

interface PendingMutationIndex {[id: string]: PendingMutation};

interface PendingMutation {

    id: string;
    type: 'delete' | 'write';

}
