import {
    AbstractDatastore,
    Datastore,
    DatastoreCapabilities,
    DatastoreInitOpts,
    DatastoreOverview,
    DeleteResult,
    DocMetaMutation,
    DocMetaSnapshotEvent,
    DocMetaSnapshotEventListener,
    DocMetaSnapshotOpts,
    DocMetaSnapshotResult,
    ErrorListener,
    InitResult,
    MutationType,
    SnapshotResult,
    WritableBinaryMetaDatastore,
} from './Datastore';
import {Logger} from 'polar-shared/src/logger/Logger';
import {DocMetaFileRef, DocMetaFileRefs, DocMetaRef} from './DocMetaRef';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DocFileMeta} from 'polar-shared/src/datastore/DocFileMeta';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {isPresent, Preconditions} from 'polar-shared/src/Preconditions';
import firebase from 'firebase/app'
import 'firebase/storage';
import {DatastoreMutation, DefaultDatastoreMutation} from 'polar-shared/src/datastore/DatastoreMutation';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {DocMetas} from "polar-shared/src/metadata/DocMetas";
import {Percentages} from 'polar-shared/src/util/Percentages';
import {Percentage, ProgressTracker} from 'polar-shared/src/util/ProgressTracker';
import {AsyncProviders} from 'polar-shared/src/util/Providers';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {FileHandle, FileHandles} from 'polar-shared/src/util/Files';
import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {IEventDispatcher, SimpleReactor} from '../reactor/SimpleReactor';
import {ProgressMessage} from '../ui/progress_bar/ProgressMessage';
import {ProgressMessages} from '../ui/progress_bar/ProgressMessages';
import {Stopwatches} from 'polar-shared/src/util/Stopwatches';
import {URLs} from 'polar-shared/src/util/URLs';
import {Datastores} from './Datastores';
import {Visibility} from "polar-shared/src/datastore/Visibility";
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {Latch} from "polar-shared/src/util/Latch";
import {GetFileOpts, NetworkLayers} from "polar-shared/src/datastore/IDatastore";
import {SnapshotUnsubscriber} from 'polar-shared/src/util/Snapshots';
import {IQuerySnapshotClient} from "polar-firestore-like/src/IQuerySnapshot";
import {IDocumentChangeClient} from "polar-firestore-like/src/IDocumentChange";
import {IDocumentReferenceClient} from "polar-firestore-like/src/IDocumentReference";
import {IFirestoreClient} from "polar-firestore-like/src/IFirestore";
import {IDocumentSnapshotClient} from "polar-firestore-like/src/IDocumentSnapshot";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";
import {DocMetaHolder} from "polar-shared/src/metadata/DocMetaHolder";
import {RecordHolder} from "polar-shared/src/metadata/RecordHolder";
import {FirebaseDatastores} from "polar-shared-datastore/src/FirebaseDatastores";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {RecordPermission} from "polar-shared/src/metadata/RecordPermission";
import {DocPermissionCollection} from "./sharing/db/DocPermissionCollection";
import WriteFileProgress = FirebaseDatastores.WriteFileProgress;
import DatastoreCollection = FirebaseDatastores.DatastoreCollection;
import DatastoreConsistency = FirebaseDatastores.DatastoreConsistency;
import FirestoreSource = FirebaseDatastores.FirestoreSource;
import WriteOpts = FirebaseDatastores.WriteOpts;
import DefaultWriteOpts = FirebaseDatastores.DefaultWriteOpts;
import BinaryFileData = FirebaseDatastores.BinaryFileData;
import WriteController = FirebaseDatastores.WriteController;
import WriteFileOpts = FirebaseDatastores.WriteFileOpts;
import DefaultWriteFileOpts = FirebaseDatastores.DefaultWriteFileOpts;
import FileMeta = FirebaseDatastores.FileMeta;

const log = Logger.create();

let STORAGE_UPLOAD_ID: number = 0;

export class FirebaseDatastore extends AbstractDatastore implements Datastore, WritableBinaryMetaDatastore {

    public readonly id = 'firebase';

    private app?: firebase.app.App;

    private firestore?: IFirestoreClient;

    private storage?: firebase.storage.Storage;

    private initialized: boolean = false;

    private primarySnapshot?: SnapshotResult;

    private uid: string = '';

    private readonly docMetaSnapshotEventDispatcher: IEventDispatcher<DocMetaSnapshotEvent> = new SimpleReactor();

    constructor() {
        super();
    }

    public async init(errorListener: ErrorListener = NULL_FUNCTION,
                      opts: DatastoreInitOpts = {}): Promise<InitResult> {

        if (this.initialized) {
            return {};
        }

        console.log("Initializing FirebaseDatastore...");

        // get the firebase app. Make sure we are initialized externally.
        this.app = firebase.app();
        this.firestore = await FirestoreBrowserClient.getInstance();
        this.storage = firebase.storage();
        this.uid = (await FirebaseBrowser.currentUserID())!;

        if (opts.noInitialSnapshot) {

            log.debug("Skipping initial snapshot");

        } else if (this.uid === undefined) {

            log.debug("Skipping initial snapshot: no user");

        } else {

            log.debug("Performing initial snapshot");

            // do not run this if we specify options of noInitialSnapshot

            const snapshotListener = async (event: DocMetaSnapshotEvent) => this.docMetaSnapshotEventDispatcher.dispatchEvent(event);

            this.primarySnapshot = await this.snapshot(snapshotListener, errorListener);

        }

        this.initialized = true;

        console.log("Initializing FirebaseDatastore...done");

        return {};

    }

    public async snapshot(docMetaSnapshotEventListener: DocMetaSnapshotEventListener,
                          errorListener: ErrorListener = NULL_FUNCTION): Promise<SnapshotResult> {

        // setup the initial snapshot so that we query for the users existing
        // data...

        const uid = this.uid;

        // start synchronizing the datastore.  You MUST register your listeners
        // BEFORE calling init if you wish to listen to the full stream of
        // events.

        // There's no way to control where the snapshot comes from and on
        // startup so we do a get() from the cache which we can control with
        // GetOptions.  This gets us data quickly and then we start listening to
        // snapshots after this which can come from the network async

        // TODO: we should ALSO snapshot the DOC_META table too and try to get
        // them BOTH at the same time ... this way the performance is much much
        // better.

        const firestore = this.firestore!;

        const query = firestore
            .collection(DatastoreCollection.DOC_META)
            .where('uid', '==', uid);

        type BatchIDMap = {
            [P in DatastoreConsistency]: number;
        };

        const batchIDs: BatchIDMap = {
            written: 0,
            committed: 0
        };

        const onNextForSnapshot = (snapshot: IQuerySnapshotClient) => {

            try {

                const consistency = this.toConsistency(snapshot);
                const batchID = batchIDs[consistency];

                this.handleDocMetaSnapshot(snapshot, docMetaSnapshotEventListener, batchID);

                batchIDs[consistency]++;

            } catch (e) {
                console.error("Could not handle snapshot: ", e);
                errorListener(e);
            }

        };

        const onSnapshotError = (err: Error) => {
            console.error("Could not handle snapshot: ", err);
            errorListener(err);
        };

        // Try to get the FIRST snapshot from the cache if possible and then
        // continue after that working with server snapshots and updated
        // data

        try {

            // TODO: technically we also, do NOT need to do this as coming from
            // cache I think is the default, but we should verify.

            const stopwatch = Stopwatches.create();
            const cachedSnapshot = await query.get({ source: 'cache' });

            // TODO: this takes a LONG time to resolve from cache!  Almost 2s

            console.log("Initial cached snapshot duration: " + stopwatch.stop());

            onNextForSnapshot(cachedSnapshot);

        } catch (e) {
            // no cached snapshot is available and that's ok.
        }

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

        const firestore = this.firestore!;

        console.log("delete: ", docMetaFileRef);

        if (docMetaFileRef.docFile && docMetaFileRef.docFile.name) {

            // the PDF/PHZ data file should be added as a stash file via
            // writeFile so it also needs to be removed.
            await this.deleteFile(Backend.STASH, docMetaFileRef.docFile);

        }

        const id = FirebaseDatastores.computeDocMetaID(docMetaFileRef.fingerprint, this.uid);

        const docInfoRef = firestore
            .collection(DatastoreCollection.DOC_INFO)
            .doc(id);

        const docMetaRef = firestore!
            .collection(DatastoreCollection.DOC_META)
            .doc(id);

        try {

            this.handleDatastoreMutations(docMetaRef, datastoreMutation, 'delete');

            const commitPromise = Promise.all([
                this.waitForCommit(docMetaRef),
                this.waitForCommit(docInfoRef)
            ]);

            const batch = firestore.batch();

            batch.delete(docInfoRef);
            batch.delete(docMetaRef);

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
    public async getDocMeta(fingerprint: string, opts: GetDocMetaOpts = {}): Promise<string | null> {

        const id = FirebaseDatastores.computeDocMetaID(fingerprint, this.uid);

        return await this.getDocMetaDirectly(id, opts);

    }

    public async getDocMetaSnapshot(opts: DocMetaSnapshotOpts<string>): Promise<DocMetaSnapshotResult> {

        const firestore = this.firestore!;

        const {fingerprint} = opts;

        const id = FirebaseDatastores.computeDocMetaID(fingerprint, this.uid);

        const ref = firestore
            .collection(DatastoreCollection.DOC_META)
            .doc(id);

        let unsubscriber: SnapshotUnsubscriber = NULL_FUNCTION;

        const onNext = (snapshot: IDocumentSnapshotClient) => {

            // WARNING: do not use cache for any meaningful use because the cache
            // doesn't mean 'local' as something can be written and we receive a
            // snapshot for it but it is actually 'local' and not from the cache.
            // hasPendingWrites is better for this.
            const source = snapshot.metadata.fromCache ? 'cache' : 'server';
            const hasPendingWrites = snapshot.metadata.hasPendingWrites;

            console.log(`DocMeta snapshot source=${source}, hasPendingWrites: ${hasPendingWrites}`);

            const recordHolder = <RecordHolder<DocMetaHolder> | undefined> snapshot.data();

            opts.onSnapshot({
                exists: snapshot.exists,
                data: recordHolder?.value?.value,
                hasPendingWrites,
                source,
                unsubscriber
            });

        };

        const onError = (err: Error) => {
            if (opts.onError) {
                opts.onError({err, unsubscriber});
            }
        };

        unsubscriber = ref.onSnapshot({includeMetadataChanges: true}, snapshot => onNext(snapshot), err => onError(err));

        return {unsubscriber};

    }

    /**
     * Get the DocMeta if from the raw docID encoded into the users account.
     */
    public async getDocMetaDirectly(id: string,
                                    opts: GetDocMetaOpts = {}): Promise<string | null> {

        return FirebaseDatastores.getDocMeta(this.firestore!, id, {
            preferredSource: opts.preferredSource || this.preferredSource()
        })

    }



    /**
     * We have to keep track of pending file writes because it's possible that
     * two systems race and attempt to write the same file at once.
     *
     * TODO: We should probably abort this in the future if the hashcodes for
     * the documents we're trying to write are present but not identical or the
     * visibility settings are different.  Either that or stack them so that
     * the second (with different settings) is performed after the first.
     */
    private pendingFileWrites: {[key: string]: Latch<DocFileMeta>} = {};

    public async writeFile(backend: Backend,
                           ref: FileRef,
                           data: BinaryFileData,
                           opts: WriteFileOpts = new DefaultWriteFileOpts()): Promise<DocFileMeta> {

        // TODO: the latch handling, file writing, and progress notification
        // should all be decoupled into their own functions.

        log.debug(`writeFile: ${backend}: `, ref);

        const storagePath = FirebaseDatastores.computeStoragePath(backend, ref, this.uid);
        const pendingFileWriteKey = storagePath.path;

        let latch = this.pendingFileWrites[pendingFileWriteKey];

        if (latch) {
            console.warn("Write already pending.  Going to return latch.");
            return this.pendingFileWrites[pendingFileWriteKey].get();
        }

        latch = this.pendingFileWrites[pendingFileWriteKey] = new Latch();

        try {

            const visibility = opts.visibility || Visibility.PRIVATE;

            const storage = this.storage!;

            const fileRef = storage.ref().child(storagePath.path);

            if (!isPresent(data)) {

                if (opts.updateMeta) {

                    const meta: FileMeta = { visibility };

                    // https://firebase.google.com/docs/storage/web/file-metadata
                    //
                    // Only the properties specified in the metadata are updated,
                    // all others are left unmodified.

                    await fileRef.updateMetadata(meta);

                    console.log("File metadata updated with: ", meta);

                    return this.getFile(backend, ref);

                } else {
                    // when the caller specifies null they mean that there's a
                    // metadata update which needs to be applied.
                    throw new Error("No data present");
                }

            }

            if (await this.containsFile(backend, ref)) {
                // the file is already in the datastore so don't attempt to
                // overwrite it for now.  The files are immutable and we don't
                // accept overwrites.
                return this.getFile(backend, ref);
            }

            let uploadTask: firebase.storage.UploadTask;

            const uid = this.uid;

            // stick the uid into the metadata which we use for authorization of the
            // blob when not public.
            const meta = { uid, visibility };

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

                    // This only happens in the desktop app so we can read file URLs
                    // to blobs and otherwise it converts URLs to files.
                    const fileHandle = <FileHandle> data;

                    const fileURL = FilePaths.toURL(fileHandle.path);
                    const blob = await URLs.toBlob(fileURL);
                    uploadTask = fileRef.put(blob, metadata);

                } else {
                    uploadTask = fileRef.put(Uint8Array.from(<Buffer> data), metadata);
                }

            }

            // TODO: we can get progress from the uploadTask here.

            const started = Date.now();

            const task = ProgressTracker.createNonce();

            // TODO: create an index of pending progress messages and show the
            // OLDEST on in the progress bar.. but add like a 5 minute timeout in
            // case it's not updated.   Each progress message MUST have a 'created'
            // timestamp from now on so we can GC them and or ignore them if they're
            // never used again

            const progressID = 'firebase-upload-' + STORAGE_UPLOAD_ID++;

            const controller: WriteController = {
                pause: () => uploadTask.pause(),
                resume: () => uploadTask.resume(),
                cancel: () => uploadTask.cancel()
            };

            if (opts.onController) {
                opts.onController(controller);
            }

            uploadTask.on('state_changed', (snapshotData: any) => {

                const snapshot: firebase.storage.UploadTaskSnapshot = snapshotData;

                const now = Date.now();
                const duration = now - started;

                const percentage = Percentages.calculate(snapshot.bytesTransferred, snapshot.totalBytes);
                console.log('Upload is ' + percentage + '% done');

                const progress: ProgressMessage = {
                    id: progressID,
                    task,
                    completed: snapshot.bytesTransferred,
                    total: snapshot.totalBytes,
                    duration,
                    progress: <Percentage> percentage,
                    timestamp: Date.now(),
                    name: `${backend}/${ref.name}`
                };

                ProgressMessages.broadcast(progress);

                if (opts.progressListener) {

                    // if the write operation has a progress listener then increment
                    // the listener properly.

                    const writeFileProgress: WriteFileProgress = {
                        ref: {backend, ...ref},
                        ...progress,
                        value: progress.progress,
                        type: 'determinate'
                    }

                    opts.progressListener(writeFileProgress);

                }

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


            // TODO: we can use bytesTransferred to keep track of accounting
            const {downloadURL, bytesTransferred} = uploadTaskSnapshot;

            const result: DocFileMeta = {
                backend,
                ref,
                url: downloadURL!
            };

            latch.resolve(result);

            // now we have to clean up after our latch.
            delete this.pendingFileWrites[pendingFileWriteKey];

            return result;

        } catch (e) {
            latch.reject(e);
            throw e;
        }

    }

    // private createFileMetaID(backend: Backend, ref: FileRef) {
    //     const storagePath = FirebaseDatastores.computeStoragePath(backend, ref);
    //     return Hashcodes.create(storagePath.path);
    // }

    public getFile(backend: Backend,
                   ref: FileRef,
                   opts: GetFileOpts = {}): DocFileMeta {

        Datastores.assertNetworkLayer(this, opts.networkLayer);

        return FirebaseDatastores.getFile(this.uid, backend, ref, opts);

    }

    public async containsFile(backend: Backend, ref: FileRef): Promise<boolean> {
        return FirebaseDatastores.containsFile(this.uid, backend, ref)
    }

    public async deleteFile(backend: Backend, ref: FileRef): Promise<void> {

        log.debug("deleteFile: ", backend, ref);

        try {

            const storage = this.storage!;

            const storagePath = FirebaseDatastores.computeStoragePath(backend, ref, this.uid);

            const fileRef = storage.ref().child(storagePath.path);
            await fileRef.delete();

        } catch (e) {

            if ((e as any).code === "storage/object-not-found") {
                // this is acceptable for now as we want deletes to be
                // idempotent
                return;
            }

            // some other type of exception ias occurred
            throw e;

        }

    }

    public async write(fingerprint: string,
                       data: string,
                       docInfo: IDocInfo,
                       opts: WriteOpts = new DefaultWriteOpts()) {

        const firestore = this.firestore!;

        await this.handleWriteFile(opts);

        const datastoreMutation = opts.datastoreMutation || new DefaultDatastoreMutation();

        const id = FirebaseDatastores.computeDocMetaID(fingerprint, this.uid);

        /**
         * Create our two main doc refs.
         */
        const createDocRefs = () => {

            const docMetaRef = firestore
                .collection(DatastoreCollection.DOC_META)
                .doc(id);

            const docInfoRef = firestore
                .collection(DatastoreCollection.DOC_INFO)
                .doc(id);

            return [docMetaRef, docInfoRef];

        }

        try {

            docInfo = Object.assign({}, Dictionaries.onlyDefinedProperties(docInfo));

            const createRecordPermission = async (): Promise<RecordPermission> => {

                const docPermission = await DocPermissionCollection.get(firestore, id);

                if (docPermission) {
                    return {
                        visibility: docPermission.visibility,
                        groups: docPermission.groups
                    };
                }

                return {
                    visibility: docInfo.visibility || Visibility.PRIVATE
                };

            };

            const recordPermission
                = Dictionaries.onlyDefinedProperties(await createRecordPermission());

            const batch = firestore.batch();

            const dataLen = data.length;

            console.log(`Write of doc with id ${id}, and data length ${dataLen} and permission: `, recordPermission);

            const [docMetaRef, docInfoRef] = createDocRefs();

            batch.set(docMetaRef, this.createRecordHolderForDocMeta(docInfo, data, recordPermission));
            batch.set(docInfoRef, this.createRecordHolderForDocInfo(docInfo, recordPermission));

            await batch.commit();

            /**
             * This will verify that the data we have is written to the server
             * and not just the local cache.
             */
            const waitForCommit = async () => {

                // TODO: this might add some EXTRA latency though because (I
                // think) it's going to wait for another server read.  Ideally
                // what would happen is that we could listen to the batch
                // directly to avoid this.

                const [docMetaRef, docInfoRef] = createDocRefs();

                this.handleDatastoreMutations(docMetaRef, datastoreMutation, 'write');

                const commitPromise = Promise.all([
                    this.waitForCommit(docMetaRef),
                    this.waitForCommit(docInfoRef)
                ]);

                log.debug("write: Waiting for commit promise...");
                await commitPromise;
                log.debug("write: Waiting for commit promise...done");

            }

            if (opts.consistency === 'committed') {
                console.log("write: Waiting for commit...");
                // normally we would NOT want to wait because this will just
                // slow down our writes and going into the cache is ok for most
                // operations.
                await waitForCommit();
                console.log("write: Waiting for commit...done");
            }

        } finally {
            // noop for now
        }

    }

    public async overview(): Promise<DatastoreOverview | undefined> {

        const docMetaRefs = await this.getDocMetaRefs();
        const user = await FirebaseBrowser.currentUserAsync();

        return {
            nrDocs: docMetaRefs.length,
            created: user!.metadata.creationTime
        };

    }

    public capabilities(): DatastoreCapabilities {

        return {
            networkLayers: NetworkLayers.WEB,
            permission: {mode: 'rw'},
            snapshots: true
        };

    }

    /**
     * Create the document that we will store in for the DocMeta
     */
    private createRecordHolderForDocMeta(docInfo: IDocInfo,
                                         docMeta: string,
                                         opts: WriteOpts = new DefaultWriteOpts()) {

        const visibility = opts.visibility || Visibility.PRIVATE;

        const uid = this.uid;

        const id = FirebaseDatastores.computeDocMetaID(docInfo.fingerprint, uid);

        const docMetaHolder: DocMetaHolder = {
            docInfo,
            value: docMeta
        };

        const recordHolder: RecordHolder<DocMetaHolder> = {
            uid,
            id,
            visibility,
            groups: opts.groups || null,
            value: docMetaHolder
        };

        return recordHolder;

    }

    private createRecordHolderForDocInfo(docInfo: IDocInfo,
                                         opts: WriteOpts = new DefaultWriteOpts()) {

        const visibility = opts.visibility || Visibility.PRIVATE;

        const uid = this.uid;
        const id = FirebaseDatastores.computeDocMetaID(docInfo.fingerprint, uid);

        const recordHolder: RecordHolder<IDocInfo> = {
            uid,
            id,
            visibility,
            groups: opts.groups || null,
            value: docInfo
        };

        return recordHolder;

    }

    public async getDocMetaRefs(): Promise<ReadonlyArray<DocMetaRef>> {

        const firestore = this.firestore!;

        const uid = this.uid;

        const snapshot = await firestore
            .collection(DatastoreCollection.DOC_META)
            .where('uid', '==', uid)
            .get();

        if (snapshot.empty) {
            return [];
        }

        const result: DocMetaRef[] = [];

        for (const doc of snapshot.docs) {

            const recordHolder = <RecordHolder<DocMetaHolder>> doc.data();

            const fingerprint = recordHolder.value.docInfo.fingerprint;

            if (recordHolder.value.value) {
                result.push({
                    fingerprint,
                    docMetaProvider: () => Promise.resolve(DocMetas.deserialize(recordHolder.value.value, fingerprint))
                });
            }

        }

        return result;

    }

    /**
     * Wait for the record to be fully committed to the remote datastore - not
     * just written to the local cache.
     */
    private waitForCommit(ref: IDocumentReferenceClient): Promise<void> {

        return new Promise(resolve => {

            const unsubscribeToSnapshot = ref.onSnapshot({includeMetadataChanges: true}, snapshot => {

                if (!snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites) {
                    unsubscribeToSnapshot();
                    resolve();
                }

            }, ERR_HANDLER);

        });

    }

    private handleDatastoreMutations(ref: IDocumentReferenceClient,
                                     datastoreMutation: DatastoreMutation<boolean>,
                                     op: 'write' | 'delete') {

        const unsubscribeToSnapshot = ref.onSnapshot({includeMetadataChanges: true}, snapshot => {

            if (snapshot.metadata.fromCache && snapshot.metadata.hasPendingWrites) {
                datastoreMutation.written.resolve(true);
                log.debug(`Got written mutation with op: ${op}`, ref);
            }

            if (!snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites) {

                // it's been committed remotely which also implies it was
                // written locally so resolve that as well. We might not always
                // get the locally written callback and I think this happens
                // when the cache entry can't be updated due to it already being
                // pending.

                datastoreMutation.written.resolve(true);
                datastoreMutation.committed.resolve(true);
                log.debug(`Got committed mutation with op: ${op}`, ref);

                // not interested in snapshots from this document any more.
                unsubscribeToSnapshot();

            }

        }, ERR_HANDLER);

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
    private handleDocMetaSnapshot(snapshot: IQuerySnapshotClient,
                                  docMetaSnapshotEventListener: DocMetaSnapshotEventListener,
                                  batchID: number) {

        type DocMetaData = string | null;

        const docMetaMutationFromRecord = (record: RecordHolder<DocMetaHolder>,
                                           mutationType: MutationType = 'created',
                                           fromCache: boolean,
                                           hasPendingWrites: boolean) => {

            const id = record.id;

            const docInfo = record.value.docInfo;

            const dataProvider = async (): Promise<DocMetaData> => {
                return record.value.value;
            };

            const docMetaProvider = AsyncProviders.memoize(async () => {

                if (mutationType === 'deleted') {
                    throw new Error("Unable to read data when mutationType is 'deleted'");
                }

                const data = await dataProvider();

                if (! data) {
                    console.warn("No data for fingerprint from dataProvider: " + docInfo.fingerprint);
                    return undefined;
                }

                const docMetaID = FirebaseDatastores.computeDocMetaID(docInfo.fingerprint, this.uid);
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
                mutationType,
                fromCache,
                hasPendingWrites
            };

            return docMetaMutation;

        };

        const toDocMetaMutationFromDocChange = (docChange: IDocumentChangeClient) => {
            const record = <RecordHolder<DocMetaHolder>> docChange.doc.data();
            const fromCache = docChange.doc.metadata.fromCache;
            const hasPendingWrites = docChange.doc.metadata.hasPendingWrites;
            return docMetaMutationFromRecord(record, toMutationType(docChange.type), fromCache, hasPendingWrites);

        };

        const consistency = snapshot.metadata.fromCache ? 'written' : 'committed';

        const docChanges = snapshot.docChanges();

        const progressTracker = new ProgressTracker({total: docChanges.length, id: 'firebase-snapshot'});

        const docChangeDocMetaMutations = docChanges.map(current => toDocMetaMutationFromDocChange(current));

        const docMetaMutations = [...docChangeDocMetaMutations];

        docMetaSnapshotEventListener({
            datastore: this.id,
            consistency,
            progress: progressTracker.terminate(),
            docMetaMutations,
            batch: {
                id: batchID,
                terminated: true,
            }
        }).catch(err => console.error("Unable to dispatch event listener: ", err));

        log.debug("onSnapshot... done");

    }

    private toConsistency(snapshot: IQuerySnapshotClient): DatastoreConsistency {
        return snapshot.metadata.fromCache ? 'written' : 'committed';
    }

    public addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void {

        const listener = (event: DocMetaSnapshotEvent) => {

            docMetaSnapshotEventListener(event)
                .catch(err => console.error("Could not handle snapshot: ", err));

        }

        this.docMetaSnapshotEventDispatcher.addEventListener(event => listener(event));
    }

    private preferredSource(): FirestoreSource {
        // we always use default now because 'get' operations fail when the
        // source is the cache.  It's a BAD API...
        return 'default';
    }

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

interface GetDocMetaOpts {

    readonly preferredSource?: FirestoreSource;

}

const ERR_HANDLER = (err: Error) => console.error("Could not create snapshot for account: ", err);
