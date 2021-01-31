// A datastore that supports ledgers and checkpoints.
import {DocMetaFileRef, DocMetaFileRefs, DocMetaRef} from './DocMetaRef';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DocFileMeta} from 'polar-shared/src/datastore/DocFileMeta';
import {FileHandle, FileHandles} from 'polar-shared/src/util/Files';
import {DatastoreMutation, DefaultDatastoreMutation} from './DatastoreMutation';
import {
    DeterminateProgress,
    IndeterminateProgress,
    Progress,
} from 'polar-shared/src/util/ProgressTracker';
import {AsyncProvider} from 'polar-shared/src/util/Providers';
import {UUID} from 'polar-shared/src/metadata/UUID';
import {AsyncWorkQueues} from 'polar-shared/src/util/AsyncWorkQueues';
import {DocMetas} from '../metadata/DocMetas';
import {DatastoreMutations} from './DatastoreMutations';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {
    InterceptedPersistentPrefs,
    InterceptedPersistentPrefsFactory,
    IPersistentPrefs
} from '../util/prefs/Prefs';
import {isPresent} from 'polar-shared/src/Preconditions';
import {Either} from '../util/Either';
import {BackendFileRefs} from './BackendFileRefs';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";
import {Visibility} from "polar-shared/src/datastore/Visibility";
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {IDStr, PathStr, URLStr} from "polar-shared/src/util/Strings";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {SimpleReactor} from "../reactor/SimpleReactor";
import {
    OnErrorCallback,
    SnapshotUnsubscriber
} from 'polar-shared/src/util/Snapshots';
import {
    NetworkLayer,
    ReadableBinaryDatastore
} from "polar-shared/src/datastore/IDatastore";

export type DocMetaSnapshotSource = 'default' | 'server' | 'cache';

export interface DocMetaSnapshot<T> {

    /**
     * True if the document exists.  This can be used to detect if it was
     * removed or deleted after the fact but also to avoid confusing with
     * storing an 'undefined' value
     */
    readonly exists: boolean;

    /**
     * The data for the snapshot.
     */
    readonly data: T | undefined;

    readonly hasPendingWrites: boolean;

    /**
     * Where this data was loaded from
     */
    readonly source: 'server' | 'cache';

    readonly unsubscriber: SnapshotUnsubscriber;

}

export interface DocMetaSnapshotError {

    readonly err: Error;

    readonly unsubscriber: SnapshotUnsubscriber;

}


export interface DocMetaSnapshotOpts<T> {

    /**
     * The fingerprint of the document we want to fetch.
     */
    readonly fingerprint: IDStr;

    /**
     * Called for each document update.  The value (as a string) of the DocMeta
     * or undefined if the document is not in the datastore.
     */
    readonly onSnapshot: (snapshot: DocMetaSnapshot<T>) => void;

    /**
     * Called on any error on updates when fetching snapshots.
     */
    readonly onError?: (err: DocMetaSnapshotError) => void;

    /**
     * The source of the snapshot, when applicable.  Can be server or cache
     * for firebase and cloud so that we can fetch from a specific source if we
     * want.  The default is to fetch from cache to begin.
     */
    readonly source?: DocMetaSnapshotSource;

}

export interface DocMetaSnapshotResult {
    readonly unsubscriber: SnapshotUnsubscriber;
}

export interface Datastore extends BinaryDatastore, WritableDatastore {

    /**
     * The id of this datastore.
     */
    readonly id: DatastoreID;

    /**
     * Init the datastore, potentially reading files of disk, the network, etc.
     */
    init(errorListener?: ErrorListener, opts?: DatastoreInitOpts): Promise<InitResult>;

    stop(): Promise<void>;

    /**
     * Return true if the DiskDatastore contains a document for the given
     * fingerprint.
     */
    contains(fingerprint: string): Promise<boolean>;

    /**
     * Get the data for the DocMeta object we currently in the datastore for
     * this given fingerprint or null if it does not exist.
     * @return {string} A JSON string representing the DocMeta which is decoded
     * by the PersistenceLayer.
     */
    getDocMeta(fingerprint: string): Promise<string | null>;

    /**
     * Get DocMeta from this datastore and send snapshots when we have updates over time.
     */
    getDocMetaSnapshot(opts: DocMetaSnapshotOpts<string>): Promise<DocMetaSnapshotResult>;

    /**
     * Return an array of {DocMetaRef}s currently in the repository.
     */
    getDocMetaRefs(): Promise<ReadonlyArray<DocMetaRef>>;

    /**
     * Get a current snapshot of the internal state of the Datastore by
     * receiving DocMetaSnapshotEvent on the initial state.
     */
    snapshot(docMetaSnapshotEventListener: DocMetaSnapshotEventListener,
             errorListener?: ErrorListener): Promise<SnapshotResult>;

    /**
     * An event listener to listen to the datastore while operating on both
     * the underlying datastores to discover when documents are discovered
     * without having to re-read the datastore after it's been initialized.
     */
    addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void;

    /**
     * Deactivate using this datastore. For most datastores this is not used
     * but for cloud sources this would logout and perform other tasks.
     */
    deactivate(): Promise<void>;

    /**
     * Get an overview of the datastore including the time it was created as
     * well as other stats including the number of docs.
     */
    overview(): Promise<DatastoreOverview | undefined>;

    capabilities(): DatastoreCapabilities;

}

// writable, readonly , ro vs rw... readonly is better BUT that's reserved by
// typescript

export type Mode = 'rw' | 'ro';

export interface DatastorePermission {

    /**
     * The high level permissions mode for this datastore. Applied to ALL
     * access to the store not on a file by file basis.
     */
    readonly mode: Mode;

}

export interface DatastoreCapabilities {

    /**
     * Provides callers with the available network layers for this datastore.
     */
    readonly networkLayers: ReadonlySet<NetworkLayer>;

    readonly permission: DatastorePermission;

    /**
     * True if this datastore supports snapshots.
     */
    readonly snapshots?: true;

}

export interface DatastoreInfo {

    /**
     * The time the datastore was created.
     */
    readonly created: ISODateTimeString;

}

export interface DatastoreOverview {

    /**
     * The time the datastore was created.  Right now we don't always know
     * when the datastore was created due to adding this feature later (storing
     * the creation time) later.
     */
    readonly created?: ISODateTimeString;

    /**
     * The number of documents in the datastore.
     */
    readonly nrDocs: number;

}

export abstract class AbstractDatastore {

    protected datastoreMutations: DatastoreMutations;

    protected constructor() {
        this.datastoreMutations = DatastoreMutations.create('written');

    }

    public abstract getDocMeta(fingerprint: string): Promise<string | null>;

    /**
     * Default implementation provides no updates.  Used by default with
     * DiskDatastore, MemoryDatastore, etc.
     */
    public async getDocMetaSnapshot(opts: DocMetaSnapshotOpts<string>): Promise<DocMetaSnapshotResult> {

        const unsubscriber = NULL_FUNCTION;

        try {

            const data = await this.getDocMeta(opts.fingerprint);

            opts.onSnapshot({
                exists: true,
                data: data || undefined,
                hasPendingWrites: false,
                source: 'server',
                unsubscriber
            });

        } catch (e) {

            if (opts.onError) {
                opts.onError(e);
            }

        }

        return {
            unsubscriber
        };

    }

    public async writeDocMeta(docMeta: IDocMeta,
                              datastoreMutation: DatastoreMutation<IDocInfo> = new DefaultDatastoreMutation()): Promise<IDocInfo> {

        const data = DocMetas.serialize(docMeta, "");
        const docInfo = docMeta.docInfo;

        const syncMutation = new DefaultDatastoreMutation<boolean>();
        DatastoreMutations.pipe(syncMutation, datastoreMutation, () => docInfo);

        await this.write(docMeta.docInfo.fingerprint, data, docInfo, {datastoreMutation: syncMutation});
        return docInfo;

    }

    public abstract writeFile(backend: Backend,
                              ref: FileRef,
                              data: BinaryFileData,
                              opts?: WriteFileOpts): Promise<DocFileMeta>;

    /**
     * Handle the file write if specify as a dependency within write()
     */
    protected async handleWriteFile(opts?: WriteOpts) {

        if (! opts) {
            return;
        }

        if (opts.writeFile) {
            const writeFileOpts: WriteFileOpts = {progressListener: opts.progressListener, onController: opts.onController};
            await this.writeFile(opts.writeFile.backend, opts.writeFile, opts.writeFile.data, writeFileOpts);
        }

    }

    public abstract write(fingerprint: string,
                          data: any,
                          docInfo: IDocInfo,
                          opts?: WriteOpts): Promise<void>;

    public async synchronizeDocs(...docMetaRefs: DocMetaRef[]): Promise<void> {
        // noop
    }

    public async deactivate() {
        // noop
    }

    public async createBackup(): Promise<void> {

        // only supported with the disk datastore.
        // TODO (webapp) I think this needs to be enabled for Firebase?
        // throw new Error("Not supported with this datatore");

    }

}


export interface WriteOptsBase<T> {

    readonly consistency?: DatastoreConsistency;

    readonly datastoreMutation?: DatastoreMutation<T>;

    /**
     * Also write a file (PDF, PHZ) with the DocMeta data so that it's atomic
     * and that the operations are ordered properly.
     */
    readonly writeFile?: BackendFileRefData;

    readonly visibility?: Visibility;

    readonly groups?: ReadonlyArray<GroupIDStr>;

    /**
     * Specify a progress listener so that when you're writing a file you can
     * keep track of the progress
     */
    readonly progressListener?: WriteFileProgressListener;

    readonly onController?: (controller: WriteController) => void;

}


export interface WriteOpts extends WriteOptsBase<boolean> {

}

interface WritableDatastore {

    /**
     * Delete the DocMeta file and the underlying doc from the stash.  Deletes
     * MUST be idempotent.
     *
     */
    delete(docMetaFileRef: DocMetaFileRef, datastoreMutation?: DatastoreMutation<boolean>): Promise<Readonly<DeleteResult>>;

    writeDocMeta(docMeta: IDocMeta, datastoreMutation?: DatastoreMutation<IDocInfo>): Promise<IDocInfo>;

    /**
     * Write the datastore to disk.  Writes should be idempotent.
     *
     * @param fingerprint The fingerprint of the data we should be working with.
     * @param data The RAW data to decode by the PersistenceLayer
     * @param docInfo The DocInfo for this document that we're writing
     * @param opts The opts to use when writing the file.
     */
    write(fingerprint: string,
          data: string,
          docInfo: IDocInfo,
          opts?: WriteOpts): Promise<void>;

    /**
     * Make sure the docs with the given fingerprints are synchronized with
     * this datastore. Only implemented in cloud datastores.
     */
    synchronizeDocs(...docMetaRefs: DocMetaRef[]): Promise<void>;

    createBackup(): Promise<void>;

}

/**
 * A datastore that support storage of binary data (images, videos, PDFs, etc).
 */
export interface BinaryDatastore extends ReadableBinaryDatastore, WritableBinaryDatastore {

}

export interface WritableBinaryDatastore {

    /**
     * Add file data to the datastore.  This is used for binary data or other
     * data types that need to be stored. This is primarily designed for video,
     * audio, and documents like PDF, ePub, etc.
     */
    writeFile(backend: Backend,
              ref: FileRef,
              data: BinaryFileData,
              opts?: WriteFileOpts): Promise<DocFileMeta>;

    deleteFile(backend: Backend, ref: FileRef): Promise<void>;

}

export interface BaseWriteFileProgress {
    readonly ref: BackendFileRef;
}

export interface WriteFileProgressDeterminate extends DeterminateProgress, BaseWriteFileProgress {
}
export interface WriteFileProgressIndeterminate extends IndeterminateProgress, BaseWriteFileProgress {
}

export type WriteFileProgress = WriteFileProgressDeterminate | WriteFileProgressIndeterminate;

export type WriteFileProgressListener = (progress: WriteFileProgress) => void;

export interface WriteController {

    /**
     * Pauses a running task. Has no effect on a paused or failed task.
     * @return True if the pause had an effect.
     */
    readonly pause: () => boolean;

    /**
     * Resume a running task. Has no effect on a paused or failed task.
     * @return True if the pause had an effect.
     */
    readonly resume: () => boolean;

    /**
     * Cancels a running task. Has no effect on a complete or failed task.
     * @return True if the cancel had an effect.
     */
    readonly cancel: () => boolean;

}

export interface WriteFileOpts {

    /**
     * @deprecated we no longer support arbitrary file metadata.
     */
    readonly meta?: FileMeta;

    /**
     * Set the file visibility.  Default is private.
     */
    readonly visibility?: Visibility;

    /**
     * Only update metadata.  Don't actually write data.
     */
    readonly updateMeta?: boolean;

    readonly datastoreMutation?: DatastoreMutation<boolean>;

    /**
     * Specify a progress listener so that when you're writing a file you can
     * keep track of the progress
     */
    readonly progressListener?: WriteFileProgressListener;

    readonly onController?: (controller: WriteController) => void;

}

export class DefaultWriteFileOpts implements WriteFileOpts {
    public readonly meta: FileMeta = {};
    public readonly visibility = Visibility.PRIVATE;
}

export interface WritableBinaryMetaDatastore {
    // writeFileMeta(backend: Backend, ref: FileRef, docFileMeta: DocFileMeta): Promise<void>;
}

export namespace sources {

    export interface FileSource {
        readonly file: PathStr;
    }

    export interface BufferSource {
        readonly buffer: Buffer;
    }

    export interface StrSource {
        readonly str: string;
    }

    export interface BlobSource {
        readonly blob: Blob;
    }

    export interface StreamSource {
        readonly stream: NodeJS.ReadableStream;
    }

    /**
     * Just a pointer to a URL that can be fetched (possibly remotely)
     */
    export interface URLSource {
        readonly url: URLStr;
    }

    export type DataSourceLiteral = FileSource | BufferSource | StrSource | BlobSource | StreamSource | URLSource;

    /**
     * Allows us to pass a function that then returns the DataSrc to handle.
     */
    export type DataSourceLiteralFactory = () => Promise<DataSourceLiteral>;

    export type DataSource = DataSourceLiteral | DataSourceLiteralFactory;

    export class DataSources {

        public static async toLiteral(source: DataSource): Promise<DataSourceLiteral> {

            if (typeof source === 'function') {
                return source();
            }

            // we're already a literal now so just return that.
            return source;

        }

    }

}

export type BinaryFileData = FileHandle | Buffer | string | Blob | NodeJS.ReadableStream;

export type BinaryFileDataType = 'file-handle' | 'buffer' | 'string' | 'blob' | 'readable-stream';

export class BinaryFileDatas {

   public static toType(data: BinaryFileData): BinaryFileDataType {

        if (typeof data === 'string') {
            return 'string';
        } else if (data instanceof Buffer) {
            return 'buffer';
        } else if (data instanceof Blob) {
            return 'blob';
        } else if (FileHandles.isFileHandle(data)) {
            return 'file-handle';
        } else {
            return 'readable-stream';
        }

    }

}

export function isBinaryFileData(data: any): boolean {

    if (! isPresent(data)) {
        return false;
    }

    if (typeof data === 'string') {
        return true;
    }

    if (data instanceof Buffer) {
        return true;
    }

    if (data instanceof Blob) {
        return true;
    }

    if (isPresent(data.path)) {
        // if it seems like a FileHandle then use it as it will be supported
        return true;
    }

    return false;

}

export interface BackendFileRefData extends BackendFileRef {
    readonly data: BinaryFileData;
}

// noinspection TsLint
/**
 * Arbitrary settings for files specific to each storage layer.  Firebase uses
 * visibility and uid.
 */
export interface FileMeta {

    // TODO: I should also include the StorageSettings from Firebase here to
    // give it a set of standardized fields like contentType as screenshots
    // needs to be added with a file type.
    [key: string]: string;

}

/**
 *
 * A datastore that provides events about changes being made to the datastore.
 *
 * This includes the granularity we need for replicating the data to a local
 * datastore by fetching the data and writing it back out on the mutation.
 */
export interface SynchronizingDatastore extends Datastore {

    /**
     * Listens for mutations to binaries.
     */
    addFileSynchronizationEventListener(fileSynchronizationEventListener: FileSynchronizationEventListener): void;

    /**
     * Listens only for new synchronized documents and ignores existing
     * documents.  This allows us to find replicated documents as they
     * change.
     */
    addSynchronizationEventListener(synchronizationEventListener: SynchronizationEventListener): void;

    // /**
    //  * Mark that we've properly transferred the disk datastore into the cloud
    //  * datastore and now the cloud datastore is the primary source.
    //  *
    //  */
    // markMerged(transferred: boolean): Promise<void>;

}

export interface SynchronizationEvent extends DocMetaSnapshotEvent {

    /**
     * The destination of the data in this synchronization event.  When the
     * dest is 'local' we're copying from the cloud to local and when it's
     * 'cloud' then we're copying from the local to the cloud.
     */
    readonly dest: DatastoreID;

}

export type SynchronizationEventListener = (synchronizationEvent: SynchronizationEvent) => void;

/**
 * Mutations on binary files.
 */
export interface FileSynchronizationEvent {

    readonly backend: Backend;

    readonly name: string;

    readonly mutationType: MutationType;

}

export type FileSynchronizationEventListener = (fileSynchronizationEvent: FileSynchronizationEvent) => void;

/**
 * Call the listener for every DocMetaSnapshotEvent and await its results.  It's
 * VERY important to await the results here!
 */
export type DocMetaSnapshotEventListener = (docMetaSnapshotEvent: DocMetaSnapshotEvent) => Promise<void>;

export type ErrorListener = (err: Error) => void;

/**
 * A DocMetaSnapshotEvent is a snapshot of the Datastore based on the current
 * state as well as future snapshots as the remote store changes.  This includes
 * DocMeta mutations which also include a MutationType for whether the document
 * was created, updated, or deleted.
 *
 * Note that a snapshot event can have zero or more docMetaMutations.  We will
 * generate zero DocMetaMutations when we're updating progress.
 */
export interface DocMetaSnapshotEvent {

    readonly datastore: DatastoreID;

    readonly progress: Readonly<SnapshotProgress>;

    readonly consistency: DatastoreConsistency;

    /**
     * An array of mutations that have been applied.  We return as an array to
     * enable performance updates via batching.
     */
    readonly docMetaMutations: ReadonlyArray<DocMetaMutation>;

    readonly batch?: DocMetaSnapshotBatch;

}

export class DocMetaSnapshotEvents {

    public static format(ev: DocMetaSnapshotEvent) {

        let batch = "NO BATCH";

        if (ev.batch) {
            batch = `(id: ${ev.batch!.id}, terminated: ${ev.batch!.terminated})`;
        }

        const progress = ev.progress.progress;
        const nrMutations = ev.docMetaMutations.length;

        return `${ev.datastore} ${progress}% (consistency: ${ev.consistency}, nr mutations: ${nrMutations}, batch: ${batch})`;

    }

    public static async toDocInfos(docMetaSnapshotEvent: DocMetaSnapshotEvent):
        Promise<ReadonlyArray<IDocInfo>> {

        return AsyncWorkQueues
            .awaitAsyncFunctions(docMetaSnapshotEvent.docMetaMutations.map(current => current.docInfoProvider));

    }

    public static async toSyncDocs(docMetaSnapshotEvent: DocMetaSnapshotEvent):
        Promise<ReadonlyArray<SyncDoc>> {

        const typedAsyncFunctions = docMetaSnapshotEvent.docMetaMutations.map(docMetaMutation => {
            return async () => {
                const docInfo = await docMetaMutation.docInfoProvider();
                return SyncDocs.fromDocInfo(docInfo, docMetaMutation.mutationType);
            };
        });

        return await AsyncWorkQueues.awaitAsyncFunctions(typedAsyncFunctions);

    }

}

/**
 * Represents data around a specific batch of DocMetaMutations so that we know
 * when we have a first consistent snapshot.  This way we can get streaming
 * events but know when part of the stream has terminated.
 *
 * The batch is only present (usually) on first level datastores not aggregate
 * datastores which might be merging streams.
 */
export interface DocMetaSnapshotBatch {

    /**
     * The ID of this batch. The first batch at a given consistency level is a
     * complete snapshot of the underlying datastore and all docs.  You MAY not
     * receive a batch with consistency 'written' and only receive one for
     * 'committed' so you should focus on committed. Batches after the first are
     * differential and only represent updates.
     */
    readonly id: number;

    /**
     * True if we've received all the events in this batch and this is the last
     * event you will see with the same batch ID.
     */
    readonly terminated: boolean;

}

/**
 * The consistency of the underlying data, whether it's written or committed.
 *
 * 'written' means that it was written to a WAL or a local cache but may not
 * be fully committed to a cloud store, to all replicas of a database, etc.
 *
 * 'committed' means that it's fully committed and consistent with the current
 * state of a database system.  A read that is 'committed' means it is fully
 * up to date.
 *
 */
export type DatastoreConsistency = 'written' | 'committed';

export interface SnapshotProgress extends Readonly<Progress> {

}

/**
 * A minimal DocMetaMutation that only has the fields we need.
 */
export interface MinimalDocMetaMutation {

    readonly fingerprint: string;

    readonly mutationType: MutationType;

    readonly docMetaProvider: AsyncProvider<IDocMeta | undefined>;

    readonly docInfoProvider: AsyncProvider<IDocInfo>;

    readonly fromCache: boolean;

    readonly hasPendingWrites: boolean;

}

/**
 * Only use one provider, either dataProvider, docMetaProvider, or
 * docInfoProvider, whichever is the most efficient and only read once ideally.
 */
export interface DocMetaMutation extends MinimalDocMetaMutation {

    readonly docMetaFileRefProvider: AsyncProvider<DocMetaFileRef>;

    /**
     * Get access to the underlying data of the DocMeta to enable us to
     * read/write directly to the Datastore without mutating anything.
     */
    readonly dataProvider: AsyncProvider<string | null>;

}

export type MutationType = 'created' | 'updated' |'deleted';

/**
 * The result of an init operation which could be different form each datastore.
 */
export interface InitResult {

}


/**
 * The result of a delete() operation.
 */
export interface DeleteResult {

}

/**
 * Listens to documents in the local repository on load.  We receive one event
 * per document it enters the repository. Once on startup if it's already
 * present and then again if it's replicated from the cloud.
 */
export type InitDocMetaEventListener = (initDocMetaEvent: InitDocMetaEvent) => void;

export interface InitDocMetaEvent {
    readonly docMeta: IDocMeta;
}

/**
 * If the `init` method is given an InitLoadListener the init function gives the
 * caller a copy of every DocMeta in the datastore on init.  This can be help
 * full in general to load a UI or data into memory but since internally the
 * datastore might ALSO be loading the docMeta for internal operations
 * (consistency, snapshots, etc) then we can surface this data to the user
 * without doing a double init.
 */
export type InitLoadListener = (docMeta: IDocMeta) => void;

/**
 * The result of a snapshot call with an optional unsubscribe callback.
 */
export interface SnapshotResult {

    /**
     * An optional unsubscribe
     */
    readonly unsubscribe?: SnapshotUnsubscriber;

}

export interface SyncDocMap {
    [fingerprint: string]: SyncDoc;

}

export class SyncDocMaps {

    public static putAll(syncDocMap: SyncDocMap, syncDocs: ReadonlyArray<SyncDoc>): void {

        for (const syncDoc of syncDocs) {
            syncDocMap[syncDoc.fingerprint] = syncDoc;
        }

    }

    public static fromArray(syncDocs: ReadonlyArray<SyncDoc>): SyncDocMap {

        const result: SyncDocMap = {};

        for (const syncDoc of syncDocs) {
            result[syncDoc.fingerprint] = syncDoc;
        }

        return result;

    }

}

/**
 * A lightweight doc reference to sync between two datasources.  A SyncDoc is a
 * flighweight and should be kept minimally compact to save space.
 */
export interface SyncDoc {

    readonly fingerprint: string;

    readonly mutationType: MutationType;

    /**
     * While the UUID is optional in practice it's required and all docs should
     * have a UUID.
     */
    readonly uuid?: UUID;

    /**
     * The title of the doc from the DocInfo for debug purposes.
     */
    readonly title: string;

    /**
     * The binary files reference by this doc.
     */
    readonly files: ReadonlyArray<SyncFile>;

    readonly docMetaFileRef: DocMetaFileRef;
}

/**
 * A lightweight reference to a binary file attached to a SyncDoc.
 */
export interface SyncFile extends BackendFileRef {

}

export class SyncDocs {

    public static fromDocInfo(docInfo: IDocInfo, mutationType: MutationType): SyncDoc {

        const files = BackendFileRefs.toBackendFileRefs(Either.ofRight(docInfo));

        return {
            fingerprint: docInfo.fingerprint,
            title: docInfo.title || 'untitled',
            docMetaFileRef: DocMetaFileRefs.createFromDocInfo(docInfo),
            mutationType,
            uuid: docInfo.uuid,
            files
        };

    }

}

export type DatastoreID = string;

export interface DatastoreInitOpts {

    readonly noInitialSnapshot?: boolean;

    /**
     * Disable sync and just start the datastore as a client for read/write.
     */
    readonly noSync?: boolean;

}

export type PersistentPrefsUpdatedCallback = (prefs: IPersistentPrefs | undefined) => void;

export interface PrefsProvider {

    /**
     * Get the users prefs.
     */
    get(): IPersistentPrefs;

    subscribe(onNext: PersistentPrefsUpdatedCallback, onError?: OnErrorCallback): SnapshotUnsubscriber;

}

export abstract class AbstractPrefsProvider implements PrefsProvider {

    protected reactor = new SimpleReactor<IPersistentPrefs | undefined>();

    public abstract get(): IPersistentPrefs;

    /**
     * Register a callback with no event listeners for platforms like Firebase that provide listening to the underlying
     * datastore.
     */
    protected register(onNext: PersistentPrefsUpdatedCallback, onError: OnErrorCallback) {
        return NULL_FUNCTION;
    }

    /**
     * Default implementation of subscribe which should be used everywhere.
     */
    public subscribe(onNext: PersistentPrefsUpdatedCallback, onError: OnErrorCallback): SnapshotUnsubscriber {

        if (! this.get) {
            throw new Error("No get method!");
        }

        const handleOnNext = (persistentPrefs: IPersistentPrefs | undefined) => {

            const interceptedPersistentPrefs = this.createInterceptedPersistentPrefs(persistentPrefs);
            onNext(interceptedPersistentPrefs);

        };

        const eventListener = (persistentPrefs: IPersistentPrefs | undefined) => handleOnNext(persistentPrefs);

        const unsubscriber = this.register(eventListener, onError);

        this.reactor.addEventListener(eventListener);

        // WARN: we used to send the current copy of the prefs but this is wrong.  This would only work for a store
        // that didn't have the concept of snapshots (like our old DiskDatastore) but with Firestore we don't have
        // any data until we receive the FIRST snapshot
        // handleOnNext(this.createInterceptedPersistentPrefs(this.get()));

        return () => {
            this.reactor.removeEventListener(eventListener);
            unsubscriber();
        };

    }

    protected createInterceptedPersistentPrefs(persistentPrefs: IPersistentPrefs | undefined): InterceptedPersistentPrefs | undefined {

        function isIntercepted(persistentPrefs: IPersistentPrefs): boolean {
            return (<any> persistentPrefs).__intercepted === true;
        }

        if (persistentPrefs) {

            if (isIntercepted(persistentPrefs)) {
                // don't double intercept...
                return <InterceptedPersistentPrefs> persistentPrefs;
            }

            const commit = async (): Promise<void> => {
                this.reactor.dispatchEvent(persistentPrefs);
                return persistentPrefs.commit();
            };

            return InterceptedPersistentPrefsFactory.create(persistentPrefs, commit);

        } else {
            return undefined;
        }

    }

}

/**
 * A prefs provider which has no update methods.
 */
export class DefaultPrefsProvider extends AbstractPrefsProvider {

    constructor(private readonly prefs: IPersistentPrefs) {
        super();
    }

    public get(): IPersistentPrefs {
        return this.createInterceptedPersistentPrefs(this.prefs)!;
    }

}


export interface DatastorePrefs {

    /**
     * The actual PersistentPrefs object that we're using.
     */
    readonly prefs: IPersistentPrefs;

    /**
     * An unsubscribe function used when onUpdated is provided for listening to new events.
     */
    readonly unsubscribe: () => void;

}

export type GroupIDStr = string;

