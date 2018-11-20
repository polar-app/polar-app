import {
    BinaryMutationEvent, Datastore, DeleteResult,
    DocMutationEvent, DocSynchronizationEvent, FileMeta,
    InitResult, SynchronizingDatastore, DocMutationType, FileRef
} from './Datastore';
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
import {DocMetas} from "../metadata/DocMetas";
import {Percentages} from '../util/Percentages';

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

    private readonly docSynchronizationReactor: IEventDispatcher<DocSynchronizationEvent> = new SimpleReactor();

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

        // There's no way to control where the snapshot comes from and on
        // startup so we do a get() from the cache which we can control with
        // GetOptions.  This gets us data quickly and then we start listening to
        // snapshots after this which can come from the network async

        const query = this.firestore!
            .collection(DatastoreCollection.DOC_META)
            .where('uid', '==', uid);

        // fetch from the local cache so that we have at least some data after
        // init instead of relying on the network.  This will get us data into
        // the document repository faster.
        const cachedQuerySnapshot = await query.get({source: 'cache'});

        this.onDocMetaSnapshot(cachedQuerySnapshot);

        // the rest of the data can come in lazily from the network.
        this.unsubscribeSnapshots = query.onSnapshot(snapshot => this.onDocMetaSnapshot(snapshot));

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


        if (docMetaFileRef.docFile && docMetaFileRef.docFile.name) {

            // the PDF/PHZ data file should be added as a stash file via
            // writeFile so it also needs to be removed.
            await this.deleteFile(Backend.STASH, docMetaFileRef.docFile);

        }

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

            return { };

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
                           ref: FileRef,
                           data: Buffer | string,
                           meta: FileMeta = {}): Promise<DatastoreFile> {

        DatastoreFiles.assertValidFileName(ref);

        const storage = this.storage!;

        const fileRef = storage.ref().child(`${backend}/${ref.name}`);

        let uploadTask: firebase.storage.UploadTask;

        if (typeof data === 'string') {
            uploadTask = fileRef.putString(data, 'raw', {customMetadata: meta});
        } else {
            uploadTask = fileRef.put(Uint8Array.from(data), {customMetadata: meta});
        }

        // TODO: we can get progress from the uploadTask here.

        // uploadTask.on('state_changed', (snapshotData: any) => {
        //     // Observe state change events such as progress, pause, and resume
        //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        //
        //     const snapshot: firebase.storage.UploadTaskSnapshot = snapshotData;
        //
        //     // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //
        //     const progress = Percentages.calculate(snapshot.bytesTransferred, snapshot.totalBytes);
        //
        //     console.log('Upload is ' + progress + '% done');
        //
        //     switch (snapshot.state) {
        //         case firebase.storage.TaskState.PAUSED: // or 'paused'
        //             console.log('Upload is paused');
        //             break;
        //         case firebase.storage.TaskState.RUNNING: // or 'running'
        //             console.log('Upload is running');
        //             break;
        //     }
        //
        // });

        const uploadTaskSnapshot = await uploadTask;

        const downloadURL = uploadTaskSnapshot.downloadURL;

        return {
            backend,
            ref,
            url: downloadURL!,
            meta
        };

    }

    public async getFile(backend: Backend, ref: FileRef): Promise<Optional<DatastoreFile>> {

        DatastoreFiles.assertValidFileName(ref);

        const storage = this.storage!;

        const fileRef = storage.ref().child(`${backend}/${ref.name}`);

        const url: string = await fileRef.getDownloadURL();
        const metadata = await fileRef.getMetadata();
        const meta = metadata.customMetadata;

        return Optional.of({backend, ref, url, meta});

    }

    public async containsFile(backend: Backend, ref: FileRef): Promise<boolean> {

        DatastoreFiles.assertValidFileName(ref);

        // TODO: we should have some cache here to avoid checking the server too
        // often but I don't think this is goign to be used often.

        const storage = this.storage!;
        const fileRef = storage.ref().child(`${backend}/${ref.name}`);

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

    public async deleteFile(backend: Backend, ref: FileRef): Promise<void> {

        DatastoreFiles.assertValidFileName(ref);

        try {

            const storage = this.storage!;
            const fileRef = storage.ref().child(`${backend}/${ref.name}`);
            await fileRef.delete();

        } catch (e) {

            if (e.code === "storage/object-not-found") {
                return;
            }

            // some other type of exception ias occurred
            throw e;

        }

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

    public addDocSynchronizationEventListener(listener: (docReplicationEvent: DocSynchronizationEvent) => void): void {
        this.docSynchronizationReactor.addEventListener(listener);
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

        for (const docChange of snapshot.docChanges()) {

            const record = <RecordHolder<DocMetaHolder>> docChange.doc.data();
            const id = record.id;

            const docMeta = DocMetas.deserialize(record.value.value);

            const docMutationEvent: DocMutationEvent = {
                docInfo: record.value.docInfo,
                mutationType: toMutationType(docChange.type)
            };

            const docReplicationEvent: DocSynchronizationEvent = {
                docMeta,
                mutationType: toMutationType(docChange.type)
            };

            this.docMutationReactor.dispatchEvent(docMutationEvent);

            if (!this.pendingMutationIndex[id]) {
                this.docSynchronizationReactor.dispatchEvent(docReplicationEvent);
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

/**
 * Convert a Firestore DocumentChangeType to a DocMutationType.  We prefer the
 * CRUD (create update delete) naming.
 * @param docChangeType
 */
function toMutationType(docChangeType: firebase.firestore.DocumentChangeType): DocMutationType {

    switch (docChangeType) {

        case 'added':
            return 'created';

        case 'modified':
            return 'updated';

        case 'removed':
            return 'deleted';

    }

}
