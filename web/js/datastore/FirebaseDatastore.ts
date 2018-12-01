import {
    FileSynchronizationEvent, Datastore, DeleteResult,
    DocMetaSnapshotEvent, FileMeta,
    InitResult, SynchronizingDatastore, MutationType, FileRef,
    DocMetaMutation, DocMetaSnapshotEventListener, SnapshotResult,
    DocMetaSnapshotBatch, ErrorListener, AbstractDatastore
} from './Datastore';
import {Logger} from '../logger/Logger';
import {DocMetaFileRef, DocMetaFileRefs, DocMetaRef} from './DocMetaRef';
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
import {ProgressTracker} from '../util/ProgressTracker';
import {Providers, AsyncProviders} from '../util/Providers';

const log = Logger.create();

// You can allow users to sign in to your app using multiple authentication
// providers by linking auth provider credentials to an existing user account.
// Users are identifiable by the same Firebase user ID regardless of the
// authentication provider they used to sign in. For example, a user who signed
// in with a password can link a Google account and sign in with either method
// in the future. Or, an anonymous user can link a Facebook account and then,
// later, sign in with Facebook to continue using your app.

export class FirebaseDatastore extends AbstractDatastore implements Datastore {

    public readonly id = 'firebase';

    public readonly stashDir: string;

    public readonly logsDir: string;

    public readonly directories: Directories;

    private app?: firebase.app.App;

    private firestore?: firebase.firestore.Firestore;

    private storage?: firebase.storage.Storage;

    private initialized: boolean = false;

    constructor() {
        super();
        this.directories = new Directories();
        this.stashDir = this.directories.stashDir;
        this.logsDir = this.directories.logsDir;

    }

    public async init(errorListener: ErrorListener = NULL_FUNCTION): Promise<InitResult> {

        if (this.initialized) {
            return {};
        }

        // get the firebase app. Make sure we are initialized externally.
        this.app = firebase.app();
        this.firestore = await Firestore.getInstance();
        this.storage = firebase.storage();

        this.initialized = true;

        return {};

    }

    public async snapshot(docMetaSnapshotEventListener: DocMetaSnapshotEventListener,
                          errorListener: ErrorListener = NULL_FUNCTION): Promise<SnapshotResult> {

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
            .collection(DatastoreCollection.DOC_INFO)
            .where('uid', '==', uid);

        // FIXME:
        // https://firebase.google.com/docs/firestore/query-data/query-cursors
        // FIXME: must NOT read all the data in at one time... must use cursors
        // here but not sure if these even use the local cache. Fuck this is
        // harder than I thought...

        // TODO: I don't think it's necessary to first fetch from from the
        // cache though as I think the first snapshot comes from cache anyway.

        const batch = {
            id: 0,
            terminated: true
        };

        // FIXME: is it possible to tell it only future data and NOT local data?
        //  that would be easier... no.. I don't think so.. I think we're stuck
        // with the default behavior which also means I need to implement
        // pagination here too but I THINK they don't send all the documents by
        // default here ANYWAY... I think we get like units of 100... so that
        // will work.  we just need to support the concept of
        // full and partial batches and batch IDs.

        // FIXME: the initial call is all docChanges ... but maybe I CAN keep
        // track of the first call if I"m getting them all back at once.. maybe
        // I can try to put 1k records in the DB and then get a query Snapshot
        // over them and lookk at the actual data that was written... then I
        // can look and listen for the events and see if they're paged. If they
        // ARE properly handled and we get back ONE call with all the documetns
        // AND the are paged then I think I can just use one snapshto for both
        // the cached and server version... the first will be the cached, the
        // second will be the server...

        const onNextForSnapshot = (snapshot: firebase.firestore.QuerySnapshot) => {

            try {
                this.handleDocInfoSnapshot(snapshot, docMetaSnapshotEventListener, batch);
                ++batch.id;
            } catch (e) {
                log.error("Could not handle snapshot: ", e);
                errorListener(e);
            }

        };

        const onErrorForSnapshot = (err: Error) => {
            log.error("Could not handle snapshot: ", err);
            errorListener(err);
        };

        const unsubscribe =
            query.onSnapshot({includeMetadataChanges: true}, onNextForSnapshot, onErrorForSnapshot);

        return {
            unsubscribe
        };

    }

    public async stop() {

        // TODO: all snapshots that have been handed out should be stopped...

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

    public async delete(docMetaFileRef: DocMetaFileRef,
                        datastoreMutation: DatastoreMutation<boolean> = new DefaultDatastoreMutation()): Promise<Readonly<DeleteResult>> {

        if (docMetaFileRef.docFile && docMetaFileRef.docFile.name) {

            // the PDF/PHZ data file should be added as a stash file via
            // writeFile so it also needs to be removed.
            await this.deleteFile(Backend.STASH, docMetaFileRef.docFile);

        }

        const uid = this.getUserID();
        const id = this.computeDocMetaID(uid, docMetaFileRef.fingerprint);

        const docMetaRef = this.firestore!
            .collection(DatastoreCollection.DOC_META)
            .doc(id);

        const docInfoRef = this.firestore!
            .collection(DatastoreCollection.DOC_INFO)
            .doc(id);

        try {

            this.handleDatastoreMutations(docMetaRef, datastoreMutation);

            const commitPromise = this.waitForCommit(docMetaRef);
            await docMetaRef.delete();

            const batch = this.firestore!.batch();

            batch.delete(docMetaRef);
            batch.delete(docInfoRef);

            await batch.commit();

            await commitPromise;

            return { };

        } finally {
            // noop for now
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

        const storage = this.storage!;

        const storagePath = this.computeStoragePath(backend, ref);

        const fileRef = storage.ref().child(storagePath);

        let uploadTask: firebase.storage.UploadTask;

        if (typeof data === 'string') {
            uploadTask = fileRef.putString(data, 'raw', {customMetadata: meta});
        } else {
            uploadTask = fileRef.put(Uint8Array.from(data), {customMetadata: meta});
        }

        // TODO: we can get progress from the uploadTask here.

        // uploadTask.on('state_changed', (snapshotData: any) => {
        //     // Observe state change events such as progress, pause, and
        // resume // Get task progress, including the number of bytes uploaded
        // and the total number of bytes to be uploaded  const snapshot:
        // firebase.storage.UploadTaskSnapshot = snapshotData;  // const
        // progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // const progress = Percentages.calculate(snapshot.bytesTransferred,
        // snapshot.totalBytes);  console.log('Upload is ' + progress + '%
        // done');  switch (snapshot.state) { case
        // firebase.storage.TaskState.PAUSED: // or 'paused'
        // console.log('Upload is paused'); break; case
        // firebase.storage.TaskState.RUNNING: // or 'running'
        // console.log('Upload is running'); break; }  });

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

        const storage = this.storage!;

        const storagePath = this.computeStoragePath(backend, ref);

        const fileRef = storage.ref().child(storagePath);

        const url: string = await fileRef.getDownloadURL();
        const metadata = await fileRef.getMetadata();
        const meta = metadata.customMetadata;

        return Optional.of({backend, ref, url, meta});

    }

    public async containsFile(backend: Backend, ref: FileRef): Promise<boolean> {

        // TODO: we should have some cache here to avoid checking the server too
        // often but I don't think this is goign to be used often.

        const storagePath = this.computeStoragePath(backend, ref);

        const storage = this.storage!;
        const fileRef = storage.ref().child(storagePath);

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

        try {

            const storage = this.storage!;

            const storagePath = this.computeStoragePath(backend, ref);

            const fileRef = storage.ref().child(storagePath);
            await fileRef.delete();

        } catch (e) {

            if (e.code === "storage/object-not-found") {
                // this is acceptable for now as we want deletes to be
                // idempotent
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

        docInfo = Object.assign({}, Dictionaries.onlyDefinedProperties(docInfo));

        const uid = this.getUserID();
        const id = this.computeDocMetaID(uid, fingerprint);

        try {

            const docMetaRef = this.firestore!
                .collection(DatastoreCollection.DOC_META)
                .doc(id);

            const docInfoRef = this.firestore!
                .collection(DatastoreCollection.DOC_INFO)
                .doc(id);

            this.handleDatastoreMutations(docMetaRef, datastoreMutation);

            const docMetaCommitPromise = this.waitForCommit(docMetaRef);

            log.debug("Setting...");

            const batch = this.firestore!.batch();

            batch.set(docMetaRef, this.createDocForDocMeta(docInfo, data));
            batch.set(docInfoRef, this.createDocForDocInfo(docInfo));

            await batch.commit();

            log.debug("Setting...done");

            // we need to make sure that we only return when it's committed
            // remotely...
            log.debug("Waiting for promise...");
            await docMetaCommitPromise;
            log.debug("Waiting for promise...done");

        } finally {
            // noop for now
        }

    }

    /**
     * Create the document that we will store in for the DocMeta
     */
    private createDocForDocMeta(docInfo: DocInfo, docMeta: string) {

        const uid = this.getUserID();
        const id = this.computeDocMetaID(uid, docInfo.fingerprint);

        const docMetaHolder: DocMetaHolder = {
            docInfo,
            value: docMeta
        };

        const recordHolder: RecordHolder<DocMetaHolder> = {
            uid,
            id,
            visibility: Visibility.PRIVATE,
            value: docMetaHolder
        };

        return recordHolder;

    }

    private createDocForDocInfo(docInfo: DocInfo) {

        const uid = this.getUserID();
        const id = this.computeDocMetaID(uid, docInfo.fingerprint);

        const recordHolder: RecordHolder<DocInfo> = {
            uid,
            id,
            visibility: Visibility.PRIVATE,
            value: docInfo
        };

        return recordHolder;

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

            // FIXME: this is wrong I think..
            result.push({fingerprint: recordHolder.value.docInfo.fingerprint});

        }

        return result;

    }

    private computeStoragePath(backend: Backend, fileRef: FileRef): string {

        if (fileRef.hashcode) {

            // we're going to build this from the hashcode of the file
            return `${backend}/${fileRef.hashcode.alg}+${fileRef.hashcode.enc}:${fileRef.hashcode.data}`;

        } else {

            // build a unique name from the filename and the UUID of the user.

            const key = {
                uid: this.getUserID(),
                filename: fileRef.name
            };

            const id = Hashcodes.createID(key, 20);

            return `${backend}/${id}`;

        }

    }

    /**
     * Wait for the record to be fully committed to the remote datastore - not
     * just written to the local cache.
     */
    private waitForCommit(ref: firebase.firestore.DocumentReference): Promise<void> {

        return new Promise(resolve => {

            const unsubscribeToSnapshot = ref.onSnapshot({includeMetadataChanges: true}, snapshot => {

                if (!snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites) {
                    unsubscribeToSnapshot();
                    resolve();
                }

            });

        });

    }

    private handleDatastoreMutations(ref: firebase.firestore.DocumentReference,
                                     datastoreMutation: DatastoreMutation<boolean>) {

        const unsubscribeToSnapshot = ref.onSnapshot({includeMetadataChanges: true}, snapshot => {

            if (snapshot.metadata.fromCache && snapshot.metadata.hasPendingWrites) {
                datastoreMutation.written.resolve(true);
                log.debug("Got written for: ", ref);

            }

            if (!snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites) {

                // it's been committed remotely which also implies it was
                // written locally so resolve that as well. We might not always
                // get the locally written callback and I think this happens
                // when the cache entry can't be updated due to it already being
                // pending.

                datastoreMutation.written.resolve(true);
                datastoreMutation.committed.resolve(true);
                log.debug("Got committed for: ", ref);

                // not interested in snapshots from this document any more.
                unsubscribeToSnapshot();

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
    private handleDocInfoSnapshot(snapshot: firebase.firestore.QuerySnapshot,
                                  docMetaSnapshotEventListener: DocMetaSnapshotEventListener,
                                  batch: DocMetaSnapshotBatch) {

        log.debug("onSnapshot... ");

        const docMetaMutationFromRecord = (record: RecordHolder<DocInfo>,
                                           mutationType: MutationType = 'created') => {

            const id = record.id;

            const docInfo = record.value;

            const docMetaProvider = AsyncProviders.memoize(async () => {
                const data = await this.getDocMeta(docInfo.fingerprint);
                Preconditions.assertPresent(data, "No data for docMeta with fingerprint: " + docInfo.fingerprint);
                return DocMetas.deserialize(data!);
            });

            const docMetaMutation: FirebaseDocMetaMutation = {
                id,
                fingerprint: docInfo.fingerprint,
                docMetaProvider,
                docInfoProvider: AsyncProviders.of(docInfo),
                docMetaFileRefProvider: AsyncProviders.of(DocMetaFileRefs.createFromDocInfo(docInfo)),
                mutationType
            };

            return docMetaMutation;

        };

        const docMetaMutationFromDocChange = (docChange: firebase.firestore.DocumentChange) => {
            const record = <RecordHolder<DocInfo>> docChange.doc.data();
            return docMetaMutationFromRecord(record, toMutationType(docChange.type));

        };

        const docMetaMutationFromDoc = (doc: firebase.firestore.DocumentData) => {
            const record = <RecordHolder<DocInfo>> doc;
            return docMetaMutationFromRecord(record, 'created');

        };

        const handleDocMetaMutation = (docMetaMutation: DocMetaMutation) => {

            // dispatch a progress event so we can detect how far we've been
            // loading
            docMetaSnapshotEventListener({
                datastore: this.id,
                consistency,
                progress: progressTracker.incr(),
                docMetaMutations: [docMetaMutation],
                batch: {
                    id: batch.id,
                    terminated: false,
                }
            });

        };

        const handleDocChange = (docChange: firebase.firestore.DocumentChange) => {
            const docMetaMutation = docMetaMutationFromDocChange(docChange);
            handleDocMetaMutation(docMetaMutation);
        };


        const handleDoc = (doc: firebase.firestore.QueryDocumentSnapshot) => {
            const docMetaMutation = docMetaMutationFromDoc(doc.data());
            handleDocMetaMutation(docMetaMutation);
        };

        const progressTracker = new ProgressTracker(snapshot.size);

        const consistency = snapshot.metadata.fromCache ? 'written' : 'committed';

        for (const docChange of snapshot.docChanges()) {
            handleDocChange(docChange);
        }

        for (const doc of snapshot.docs) {
            handleDoc(doc);
        }

        // TODO: I'm not really sure of the difference of docs vs docChanges
        // in our situation.

        docMetaSnapshotEventListener({
            datastore: this.id,
            consistency,
            progress: progressTracker.peek(),
            docMetaMutations: [],
            batch: {
                id: batch.id,
                terminated: true,
            }
        });

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

    DOC_INFO = "doc_info",

    DOC_META = "doc_meta"

}

type UserID = string;

/**
 * The result of a FB database mutation.
 */
interface Mutation {

}

interface PendingMutationIndex {
    [id: string]: PendingMutation;
}

interface PendingMutation {

    id: string;
    type: 'delete' | 'write';

}

interface FirebaseDocMetaMutation extends DocMetaMutation {
    readonly id: string;
}

/**
 * Convert a Firestore DocumentChangeType to a DocMutationType.  We prefer the
 * CRUD (create update delete) naming.
 * @param docChangeType
 */
function toMutationType(docChangeType: firebase.firestore.DocumentChangeType): MutationType {

    switch (docChangeType) {

        case 'added':
            return 'created';

        case 'modified':
            return 'updated';

        case 'removed':
            return 'deleted';

    }

}
