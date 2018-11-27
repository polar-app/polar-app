// A datastore that supports ledgers and checkpoints.
import {DocMetaFileRef, DocMetaFileRefs, DocMetaRef} from './DocMetaRef';
import {DeleteResult} from './Datastore';
import {Directories} from './Directories';
import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {DocInfo, IDocInfo} from '../metadata/DocInfo';
import {FileHandle} from '../util/Files';
import {Simulate} from 'react-dom/test-utils';
import {DatastoreMutation} from './DatastoreMutation';
import {DocMeta} from '../metadata/DocMeta';
import {Hashcode} from '../metadata/Hashcode';
import {ProgressState} from '../util/ProgressTracker';
import {AsyncProvider} from '../util/Providers';
import {UUID} from '../metadata/UUID';
import {AsyncWorkQueues} from '../util/AsyncWorkQueues';

export interface Datastore extends BinaryDatastore, WritableDatastore {

    /**
     * @Deprecated
     */
    readonly stashDir: string;

    // readonly filesDir: string;

    /**
     * @Deprecated
     */
    readonly logsDir: string;

    /**
     * @Deprecated
     */
    readonly directories: Directories;

    /**
     * Init the datastore, potentially reading files of disk, the network, etc.
     */
    init(errorListener?: ErrorListener): Promise<InitResult>;

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
     * Return an array of {DocMetaRef}s currently in the repository.
     */
    // TODO: refactor to getDocMetaRefs
    getDocMetaFiles(): Promise<DocMetaRef[]>;

    /**
     * Get a current snapshot of the internal state of the Datastore by
     * receiving DocMetaSnapshotEvent on the initial state.
     */
    snapshot(docMetaSnapshotEventListener: DocMetaSnapshotEventListener,
             errorListener?: ErrorListener): Promise<SnapshotResult>;

    // TODO: we need a new method with the following semantics:

    // - we can add it AFTER the init()
    //
    // - it starts working immediately and in offline mode and then continues
    //   to work when we get online snapshots
    //
    // - it give us FULL visibility into the lifestyle of a document including
    //   create, update, and delete.
    //
    // - this is VERY similar (but somewhat different) than the firebase
    // snapshot support

}

interface WritableDatastore {

    /**
     * Delete the DocMeta file and the underlying doc from the stash.  Deletes
     * MUST be idempotent.
     *
     */
    delete(docMetaFileRef: DocMetaFileRef, datastoreMutation?: DatastoreMutation<boolean>): Promise<Readonly<DeleteResult>>;

    /**
     * Write the datastore to disk.  Writes should be idempotent.
     *
     * @param fingerprint The fingerprint of the data we should be working with.
     * @param data The RAW data to decode by the PersistenceLayer
     * @param docInfo The DocInfo for this document that we're writing
     */
    write(fingerprint: string, data: any, docInfo: IDocInfo, datastoreMutation?: DatastoreMutation<boolean>): Promise<void>;

}

/**
 * A datastore that support storage of binary data (images, videos, PDFs, etc).
 */
interface BinaryDatastore extends ReadableBinaryDatastore, WritableBinaryDatastore {

}

interface ReadableBinaryDatastore {

    containsFile(backend: Backend, ref: FileRef): Promise<boolean>;

    getFile(backend: Backend, ref: FileRef): Promise<Optional<DatastoreFile>>;

}

interface WritableBinaryDatastore {

    /**
     * Add file data to the datastore.  This is used for binary data or other
     * data types that need to be stored. This is primarily designed for video,
     * audio, and documents like PDF, ePub, etc.
     */
    writeFile(backend: Backend,
              ref: FileRef,
              data: FileHandle | Buffer | string,
              meta?: FileMeta): Promise<DatastoreFile>;

    deleteFile(backend: Backend, ref: FileRef): Promise<void>;

}

export interface FileRef {

    readonly name: string;

    /**
     * The hashcode for the content.  For now the hashcode is STRONGLY preferred
     * but not required.
     */
    readonly hashcode?: Hashcode;

}

// noinspection TsLint
export type FileMeta = {[key: string]: string};

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
    addBinaryMutationEventListener(listener: (binaryMutationEvent: BinaryMutationEvent) => void): void;

    /**
     * Listens to mutations of the underlying documents whether they are local
     * or synchronized from a remote store.
     */
    addDocMetaSnapshotEventListener(listener: (docMetaSnapshotEvent: DocMetaSnapshotEvent) => void): void;

    /**
     * Listens only for new synchronized documents and ignores existing
     * documents.  This allows us to find replicated documents as they
     * change.
     *
     * @param listener
     */
    addDocMetaSynchronizationEventListener(listener: (docMetaSnapshotEvent: DocMetaSnapshotEvent) => void): void;

}

/**
 * Mutations on binary files.
 */
export interface BinaryMutationEvent {

    readonly backend: Backend;

    readonly name: string;

    readonly mutationType: MutationType;

}

export type DocMetaSnapshotEventListener = (docMetaSnapshotEvent: DocMetaSnapshotEvent) => void;

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

    public static async toDocInfos(docMetaSnapshotEvent: DocMetaSnapshotEvent):
        Promise<ReadonlyArray<IDocInfo>> {

        return AsyncWorkQueues
            .awaitPromises(docMetaSnapshotEvent.docMetaMutations.map(current => current.docInfoProvider()));

    }

    public static async toSyncDocs(docMetaSnapshotEvent: DocMetaSnapshotEvent):
        Promise<ReadonlyArray<SyncDoc>> {

        const promises = docMetaSnapshotEvent.docMetaMutations.map(docMetaMutation => {
            return async () => {
                const docInfo = await docMetaMutation.docInfoProvider();
                return SyncDocs.fromDocInfo(docInfo, docMetaMutation.mutationType);
            };
        }).map(current => current());

        return await AsyncWorkQueues.awaitPromises(promises);

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
 * 'committed' means that it's fully commited and consistent with the current
 * state of a database system.  A read that is 'committed' means it is fully
 * up to date.
 *
 */
export type DatastoreConsistency = 'written' | 'committed';

export interface SnapshotProgress extends Readonly<ProgressState> {

}

export interface DocMetaMutation {

    readonly docMetaProvider: AsyncProvider<DocMeta>;
    readonly docInfoProvider: AsyncProvider<IDocInfo>;

    readonly mutationType: MutationType;

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
    readonly docMeta: DocMeta;
}

/**
 * If the `init` method is given an InitLoadListener the init function gives the
 * caller a copy of every DocMeta in the datastore on init.  This can be help
 * full in general to load a UI or data into memory but since internally the
 * datastore might ALSO be loading the docMeta for internal operations
 * (consistency, snapshots, etc) then we can surface this data to the user
 * without doing a double init.
 */
export type InitLoadListener = (docMeta: DocMeta) => void;

/**
 * The result of a snapshot call with an optional unsubscribe callback.
 */
export interface SnapshotResult {

    /**
     * An optional unsubscribe
     */
    readonly unsubscribe?: SnapshotUnsubscriber;

}

/**
 * A function for unsubscribing to future snapshot events.
 */
export type SnapshotUnsubscriber = () => void;

export interface SyncDocMap {
    [fingerprint: string]: SyncDoc;

}

export class SyncDocMaps {

    public static putAll(syncDocMap: SyncDocMap, syncDocs: ReadonlyArray<SyncDoc>): void {

        for (const syncDoc of syncDocs) {
            syncDocMap[syncDoc.fingerprint] = syncDoc;
        }

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
     * The binary files reference by this doc.
     */
    readonly files: ReadonlyArray<SyncFile>;

    readonly docMetaFileRef: DocMetaFileRef;
}

/**
 * A lightweight reference to a binary file attached to a SyncDoc.
 */
export interface SyncFile {

    readonly backend: Backend;

    readonly ref: FileRef;

}

export class SyncDocs {

    public static fromDocInfo(docInfo: IDocInfo, mutationType: MutationType): SyncDoc {

        const files: SyncFile[] = [];

        if (docInfo.filename) {

            const stashFile: SyncFile = {
                backend: Backend.STASH,
                ref: {
                    name: docInfo.filename!,
                    hashcode: docInfo.hashcode
                }
            };

            files.push(stashFile);

        }

        return {
            fingerprint: docInfo.fingerprint,
            docMetaFileRef: DocMetaFileRefs.createFromDocInfo(docInfo),
            mutationType,
            uuid: docInfo.uuid,
            files
        };

    }

}
