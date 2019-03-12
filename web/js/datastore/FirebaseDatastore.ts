import {AbstractDatastore, BinaryFileData, Datastore, DatastoreConsistency, DatastoreInitOpts, DatastoreOverview, DeleteResult, DocMetaMutation, DocMetaSnapshotEvent, DocMetaSnapshotEventListener, ErrorListener, FileMeta, FileRef, InitResult, MutationType, PrefsProvider, SnapshotResult} from './Datastore';
import {Logger} from '../logger/Logger';
import {DocMetaFileRef, DocMetaFileRefs, DocMetaRef} from './DocMetaRef';
import {Backend} from './Backend';
import {DocFileMeta} from './DocFileMeta';
import {Optional} from '../util/ts/Optional';
import {Firestore} from '../firebase/Firestore';
import {DocInfo, IDocInfo} from '../metadata/DocInfo';
import {Preconditions} from '../Preconditions';
import {Hashcodes} from '../Hashcodes';
import * as firebase from '../firebase/lib/firebase';
import {Dictionaries} from '../util/Dictionaries';
import {DatastoreMutation, DefaultDatastoreMutation} from './DatastoreMutation';
import {NULL_FUNCTION} from '../util/Functions';
import {DocMetas} from "../metadata/DocMetas";
import {Percentages} from '../util/Percentages';
import {Percentage, ProgressTracker} from '../util/ProgressTracker';
import {AsyncProviders, Providers} from '../util/Providers';
import {FilePaths} from '../util/FilePaths';
import {FileHandle, FileHandles, Files} from '../util/Files';
import {UserID} from '../firebase/Firebase';
import {IEventDispatcher, SimpleReactor} from '../reactor/SimpleReactor';
import {LocalStoragePrefs} from '../util/prefs/Prefs';
import {ProgressMessage} from '../ui/progress_bar/ProgressMessage';
import {ProgressMessages} from '../ui/progress_bar/ProgressMessages';
import {Stopwatches} from '../util/Stopwatches';
import {WritableBinaryMetaDatastore} from './Datastore';

const log = Logger.create();

// You can allow users to sign in to your app using multiple authentication
// providers by linking auth provider credentials to an existing user account.
// Users are identifiable by the same Firebase user ID regardless of the
// authentication provider they used to sign in. For example, a user who signed
// in with a password can link a Google account and sign in with either method
// in the future. Or, an anonymous user can link a Facebook account and then,
// later, sign in with Facebook to continue using your app.

// @ts-ignore
export class FirebaseDatastore extends AbstractDatastore implements Datastore, WritableBinaryMetaDatastore {

    public readonly id = 'firebase';

    public enablePersistence: boolean = true;

    private app?: firebase.app.App;

    private firestore?: firebase.firestore.Firestore;

    private storage?: firebase.storage.Storage;

    private initialized: boolean = false;

    private primarySnapshot?: SnapshotResult;

    private readonly docMetaSnapshotEventDispatcher: IEventDispatcher<DocMetaSnapshotEvent> = new SimpleReactor();

    constructor() {
        super();

    }

    public async init(errorListener: ErrorListener = NULL_FUNCTION,
                      opts: DatastoreInitOpts = {}): Promise<InitResult> {

        if (this.initialized) {
            return {};
        }

        // get the firebase app. Make sure we are initialized externally.
        this.app = firebase.app();
        this.firestore = await Firestore.getInstance({enablePersistence: this.enablePersistence});
        this.storage = firebase.storage();

        if (! opts.noInitialSnapshot) {

            // do not run this if we specify options of noInitialSnapshot

            const snapshotListener = async (event: DocMetaSnapshotEvent) => this.docMetaSnapshotEventDispatcher.dispatchEvent(event);

            this.primarySnapshot = await this.snapshot(snapshotListener, errorListener);

        }

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


        type BatchIDMap = {
            [P in DatastoreConsistency]: number;
        };

        const batchIDs: BatchIDMap = {
            written: 0,
            committed: 0
        };

        const onNextForSnapshot = (snapshot: firebase.firestore.QuerySnapshot) => {

            try {

                const consistency = this.toConsistency(snapshot);
                const batchID = batchIDs[consistency];

                this.handleDocInfoSnapshot(snapshot, docMetaSnapshotEventListener, batchID);

                batchIDs[consistency]++;

            } catch (e) {
                log.error("Could not handle snapshot: ", e);
                errorListener(e);
            }

        };

        const onSnapshotError = (err: Error) => {
            log.error("Could not handle snapshot: ", err);
            errorListener(err);
        };

        const unsubscribe =
            query.onSnapshot({includeMetadataChanges: true}, onNextForSnapshot, onSnapshotError);

        return {
            unsubscribe
        };

    }

    public async stop() {

        if (this.primarySnapshot && this.primarySnapshot.unsubscribe) {
            this.primarySnapshot.unsubscribe();
        }

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

        log.info("delete: ", docMetaFileRef);

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
            log.warn("Could not get docMeta with id: " + id);
            return null;
        }

        return recordHolder.value.value;

    }

    // TODO: the cloud storage operations are possibly unsafe and could
    // leave local files in place or too many remote files but this is good
    // for a first MVP pass.

    public async writeFile(backend: Backend,
                           ref: FileRef,
                           data: BinaryFileData ,
                           meta: FileMeta = {}): Promise<DocFileMeta> {

        if (await this.containsFile(backend, ref)) {
            // the file is already in the datastore so don't attempt to
            // overwrite it for now.  The files are immutable and we don't
            // accept overwrites.
            return (await this.getFile(backend, ref)).get();
        }

        const storage = this.storage!;

        const storagePath = this.computeStoragePath(backend, ref);

        const fileRef = storage.ref().child(storagePath.path);

        let uploadTask: firebase.storage.UploadTask;

        // TODO: we need to compute visibility for this for the future.

        const uid = this.getUserID();

        // stick the uid into the metadata which we use for authorization of the
        // blob when not public.
        meta = {...meta, uid, visibility: Visibility.PRIVATE};

        const metadata: firebase.storage.UploadMetadata = { customMetadata: meta };

        if (storagePath.settings) {
            metadata.contentType = storagePath.settings.contentType;
            metadata.cacheControl = storagePath.settings.cacheControl;
        }

        if (typeof data === 'string') {
            uploadTask = fileRef.putString(data, 'raw', metadata);
        } else if (data instanceof Blob) {
            uploadTask = fileRef.put(data, metadata);
        } else {

            if (FileHandles.isFileHandle(data)) {

                // MEMORY_ALLOCATION_ISSUE migrate this to a streaming API to
                // help with huge PDFs.

                // it's not a buffer but convert it to one...
                const fileHandle = <FileHandle> data;
                data = await Files.readFileAsync(fileHandle.path);

            }

            uploadTask = fileRef.put(Uint8Array.from(<Buffer> data), metadata);

        }

        // TODO: we can get progress from the uploadTask here.

        const started = Date.now();

        const task = ProgressTracker.createNonce();

        uploadTask.on('state_changed', (snapshotData: any) => {

            const snapshot: firebase.storage.UploadTaskSnapshot = snapshotData;

            const now = Date.now();
            const duration = now - started;

            const percentage = Percentages.calculate(snapshot.bytesTransferred, snapshot.totalBytes);
            log.notice('Upload is ' + percentage + '%// done');

            const progress: ProgressMessage = {
                id: 'firebase-upload',
                task,
                completed: snapshot.bytesTransferred,
                total: snapshot.totalBytes,
                duration,
                progress: <Percentage> percentage
            };

            ProgressMessages.broadcast(progress);

            switch (snapshot.state) {

                case firebase.storage.TaskState.PAUSED:
                    // or 'paused'
                    // console.log('Upload is paused');
                    break;

                case firebase.storage.TaskState.RUNNING:
                    // or 'running'
                    // console.log('Upload is running');
                    break;
            }

        });

        const uploadTaskSnapshot = await uploadTask;

        const downloadURL = uploadTaskSnapshot.downloadURL;

        return {
            backend,
            ref,
            url: downloadURL!,
            meta
        };

    }

    public async getFileMeta(backend: Backend, ref: FileRef): Promise<Optional<DocFileMeta>> {

        const stopwatch = Stopwatches.create();

        const id = this.createFileMetaID(backend, ref);

        const snapshot = await this.firestore!
            .collection(DatastoreCollection.DOC_FILE_META)
            .doc(id)
            .get();

        const recordHolder = <RecordHolder<DocFileMeta> | undefined> snapshot.data();

        if (! recordHolder) {
            return Optional.empty();
        }

        return Optional.of(recordHolder.value);

    }

    public async writeFileMeta(backend: Backend, ref: FileRef, docFileMeta: DocFileMeta) {

        const id = this.createFileMetaID(backend, ref);

        const recordHolder: RecordHolder<DocFileMeta> = {
            uid: this.getUserID(),
            id,
            visibility: Visibility.PRIVATE,
            value: docFileMeta
        };

        await this.firestore!
            .collection(DatastoreCollection.DOC_FILE_META)
            .doc(id)
            .set(recordHolder);

    }

    public async deleteFileMeta(backend: Backend, ref: FileRef) {

        const id = this.createFileMetaID(backend, ref);

        await this.firestore!
            .collection(DatastoreCollection.DOC_FILE_META)
            .doc(id)
            .delete();

    }

    private createFileMetaID(backend: Backend, ref: FileRef) {
        const storagePath = this.computeStoragePath(backend, ref);
        return Hashcodes.create(storagePath.path);
    }

    public async getFile(backend: Backend, ref: FileRef): Promise<Optional<DocFileMeta>> {

        let result = await this.getFileFromFileMeta(backend, ref);

        if (! result.isPresent()) {

            result = await this.getFileFromStorage(backend, ref);

            if (result.isPresent()) {
                // write it to doc_file_meta so that next time we have it
                // available

                await this.writeFileMeta(backend, ref, result.get());

            }

            return result;

        } else {
            return result;
        }

    }

    private async getFileFromFileMeta(backend: Backend, ref: FileRef): Promise<Optional<DocFileMeta>> {
        return await this.getFileMeta(backend, ref);
    }

    private async getFileFromStorage(backend: Backend, ref: FileRef): Promise<Optional<DocFileMeta>> {

        // TODO: this code and containsFile could be unified I think.
        // containsFile should just be getFile().isPresent()

        const storage = this.storage!;

        const storagePath = this.computeStoragePath(backend, ref);

        const fileRef = storage.ref().child(storagePath.path);

        try {

            const metadata = await fileRef.getMetadata();

            const url: string = await fileRef.getDownloadURL();

            const meta = metadata.customMetadata;

            return Optional.of({ backend, ref, url, meta });

        } catch (e) {

            if (e.code === "storage/object-not-found") {
                return Optional.empty();
            }

            // some other type of exception ias occurred
            throw e;

        }

    }

    public async containsFile(backend: Backend, ref: FileRef): Promise<boolean> {

        // TODO: we should have some cache here to avoid checking the server too
        // often but I don't think this is goign to be used often.

        // TODO: this is slow when referencing the storage path directly we should
        // instead use the doc_file_meta but not all files have this yet.

        const storagePath = this.computeStoragePath(backend, ref);

        const storage = this.storage!;
        const fileRef = storage.ref().child(storagePath.path);

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

        const deleteFileFromStorage = async () => {

            try {

                const storage = this.storage!;

                const storagePath = this.computeStoragePath(backend, ref);

                const fileRef = storage.ref().child(storagePath.path);
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

        };

        await deleteFileFromStorage();
        await this.deleteFileMeta(backend, ref);

    }

    /**
     * Write the datastore to disk.
     */
    public async write(fingerprint: string,
                       data: string,
                       docInfo: DocInfo,
                       datastoreMutation: DatastoreMutation<boolean> = new DefaultDatastoreMutation()) {

        try {

            docInfo = Object.assign({}, Dictionaries.onlyDefinedProperties(docInfo));

            const uid = this.getUserID();
            const id = this.computeDocMetaID(uid, fingerprint);

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

    public async overview(): Promise<DatastoreOverview> {
        throw new Error("Not implemented");
    }

    public getPrefs(): PrefsProvider {
        return Providers.toInterface(() => new LocalStoragePrefs());
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

    public async getDocMetaRefs(): Promise<DocMetaRef[]> {

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

    private computeStoragePath(backend: Backend, fileRef: FileRef): StoragePath {

        const ext = FilePaths.toExtension(fileRef.name);

        const suffix = ext.map(value => {

                if ( ! value.startsWith('.') ) {
                    // if the suffix doesn't begin with a '.' then add it.
                    value = '.' + value;
                }

                return value;

            })
            .getOrElse('');

        const settings = this.computeStorageSettings(ext).getOrUndefined();

        let key: any;

        const uid = this.getUserID();

        if (fileRef.hashcode) {

            key = {

                // We include the uid of the user to avoid the issue of user
                // conflicting on files and the ability to share them per file.
                // The cloud storage costs for raw binary files are
                // inconsequential so have one file per user.

                uid,
                backend,
                alg: fileRef.hashcode.alg,
                enc: fileRef.hashcode.enc,
                data: fileRef.hashcode.data,
                suffix

            };

        } else {

            // build a unique name from the filename and the UUID of the user.
            // this shouldn't actually be used except in the cases of VERY old
            // datastores.
            key = {
                uid,
                filename: fileRef.name
            };

        }

        const id = Hashcodes.createID(key, 40);

        const path = `${backend}/${id}${suffix}`;

        return {path, settings};

    }

    private computeStorageSettings(optionalExt: Optional<string>): Optional<StorageSettings> {

        const PUBLIC_MAX_AGE_1WEEK = 'public,max-age=604800';

        const ext = optionalExt.getOrElse('');

        if (ext === 'jpg' || ext === 'jpeg') {

            return Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'image/jpeg'
            });

        }

        if (ext === 'pdf') {

            return Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'application/pdf'
            });

        }

        if (ext === 'png') {

            return Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'image/png'
            });

        }

        if (ext === 'svg') {

            return Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'image/svg'
            });

        }

        // the fall through of cached data should work for PHZ files and other
        // types of binary data.

        return Optional.of({
            cacheControl: PUBLIC_MAX_AGE_1WEEK,
            contentType: 'application/octet-stream'
        });

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
                                  batchID: number) {

        log.debug("onSnapshot... ");

        const docMetaMutationFromRecord = (record: RecordHolder<DocInfo>,
                                           mutationType: MutationType = 'created') => {

            const id = record.id;

            const docInfo = record.value;

            const dataProvider = async () => {
                return await this.getDocMeta(docInfo.fingerprint);
            };

            const docMetaProvider = AsyncProviders.memoize(async () => {
                const data = await dataProvider();
                const docMetaID = this.computeDocMetaID(this.getUserID(), docInfo.fingerprint);
                Preconditions.assertPresent(data, `No data for docMeta with fingerprint: ${docInfo.fingerprint}, docMetaID: ${docMetaID}`);
                return DocMetas.deserialize(data!, docInfo.fingerprint);
            });

            const docMetaMutation: FirebaseDocMetaMutation = {
                id,
                fingerprint: docInfo.fingerprint,
                dataProvider,
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

        const handleDocMetaMutation = async (docMetaMutation: DocMetaMutation) => {

            // dispatch a progress event so we can detect how far we've been
            // loading
            await docMetaSnapshotEventListener({
                datastore: this.id,
                consistency,
                progress: progressTracker.incr(),
                docMetaMutations: [docMetaMutation],
                batch: {
                    id: batchID,
                    terminated: false,
                }
            });

        };

        const handleDocChange = (docChange: firebase.firestore.DocumentChange) => {
            const docMetaMutation = docMetaMutationFromDocChange(docChange);
            handleDocMetaMutation(docMetaMutation)
                .catch(err => log.error(err));

        };


        const handleDoc = (doc: firebase.firestore.QueryDocumentSnapshot) => {
            const docMetaMutation = docMetaMutationFromDoc(doc.data());
            handleDocMetaMutation(docMetaMutation)
                .catch(err => log.error(err));

        };


        const consistency = snapshot.metadata.fromCache ? 'written' : 'committed';

        const docChanges = snapshot.docChanges();

        const nrDocChanges = docChanges.length;
        const nrDocs = snapshot.docs.length;

        // log.notice(`GOT SNAPSHOT with consistency ${consistency}, nrDocs:
        // ${nrDocs}, nrDocChanges: ${nrDocChanges}`);

        // if (docChanges.length === 0) {
        //     log.notice("SKIPPING SNAPSHOT (no docChanges)");
        // }

        const progressTracker = new ProgressTracker(docChanges.length, 'firebase-snapshot');

        for (const docChange of docChanges) {
            handleDocChange(docChange);
        }

        // progressTracker = new ProgressTracker(snapshot.docs.length);
        //
        // for (const doc of snapshot.docs) {
        //     handleDoc(doc);
        // }

        docMetaSnapshotEventListener({
            datastore: this.id,
            consistency,
            progress: progressTracker.terminate(),
            docMetaMutations: [],
            batch: {
                id: batchID,
                terminated: true,
            }
        }).catch(err => log.error("Unable to dispatch event listener"));

        log.debug("onSnapshot... done");

    }

    private toConsistency(snapshot: firebase.firestore.QuerySnapshot): DatastoreConsistency {
        return snapshot.metadata.fromCache ? 'written' : 'committed';
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

    public addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void {
        this.docMetaSnapshotEventDispatcher.addEventListener(docMetaSnapshotEventListener);
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
    PRIVATE = 'private', /* or 0 */

    /**
     * Only to users that this user is following.
     */
    FOLLOWING = 'following', /* or 1 */

    /**
     * To anyone on the service.
     */
    PUBLIC = 'public' /* or 2 */

}

export enum DatastoreCollection {

    DOC_INFO = "doc_info",

    DOC_META = "doc_meta",

    DOC_FILE_META = "doc_file_meta"

}


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

interface StoragePath {
    readonly path: string;
    readonly settings?: StorageSettings;
}

interface StorageSettings {
    readonly cacheControl: string;
    readonly contentType: string;
}

