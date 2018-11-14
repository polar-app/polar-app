// A datastore that supports ledgers and checkpoints.
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {DeleteResult} from './Datastore';
import {Directories} from './Directories';
import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {IDocInfo} from '../metadata/DocInfo';
import {FileDeleted, FileRef} from '../util/Files';
import {Latch} from '../util/Latch';
import {Simulate} from 'react-dom/test-utils';
import input = Simulate.input;
import {isPresent} from '../Preconditions';
import {DatastoreMutation} from './DatastoreMutation';
import {DocMeta} from '../metadata/DocMeta';

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
    init(): Promise<InitResult>;

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
     * Return an array of DocMetaFiles currently in the repository.
     */
    getDocMetaFiles(): Promise<DocMetaRef[]>;

}

interface WritableDatastore {

    /**
     * Delete a document from the datastore.  Deletes should be idempotent.
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

    containsFile(backend: Backend, name: string): Promise<boolean>;
    getFile(backend: Backend, name: string): Promise<Optional<DatastoreFile>>;

}

interface WritableBinaryDatastore {

    /**
     * Add file data to the datastore.  This is used for binary data or other
     * data types that need to be stored. This is primarily designed for video,
     * audio, and documents like PDF, ePub, etc.
     */
    writeFile(backend: Backend,
              name: string,
              data: FileRef | Buffer | string,
              meta?: FileMeta): Promise<DatastoreFile>;

    deleteFile(backend: Backend, name: string): Promise<void>;

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
export interface SynchronizingDatastore {

    addBinaryMutationEventListener(listener: (binaryMutationEvent: BinaryMutationEvent) => void): void;

    addDocMutationEventListener(listener: (docMutationEvent: DocMutationEvent) => void): void;

    addDocReplicationEventListener(listener: (docReplicationEvent: DocReplicationEvent) => void): void;

}

/**
 * Mutations on binary files.
 */
export interface BinaryMutationEvent {

    backend: Backend;

    name: string;

    mutationType: MutationType;

}

/**
 * A DocMutation is any mutation that happens in the remote datastore including
 * local mutations.
 */
export interface DocMutationEvent {

    docInfo: IDocInfo;

    mutationType: MutationType;

}

/**
 * ReplicationEvents are distinct changes to the remote Firestore entry that
 * aren't from events happening locally. These are triggered after init().
 * Local mutations to the datastore do not trigger ReplicationEvents
 */
export interface DocReplicationEvent {

    docInfo: IDocInfo;

    mutationType: MutationType;

}

type MutationType = 'added' | 'modified' |'removed';

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
 * per document it enters the repository. Once on startup if it's already present
 * and then again if it's replicated from the cloud.
 */
export type InitDocMetaEventListener = (initDocMetaEvent: InitDocMetaEvent) => void;

export interface InitDocMetaEvent {
    docMeta: DocMeta;
}

