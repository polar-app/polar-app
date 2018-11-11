// A datastore that supports ledgers and checkpoints.
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {DeleteResult} from './DiskDatastore';
import {Directories} from './Directories';
import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {IDocInfo} from '../metadata/DocInfo';
import {FileRef} from '../util/Files';
import {Latch} from '../util/Latch';
import {Simulate} from 'react-dom/test-utils';
import input = Simulate.input;
import {isPresent} from '../Preconditions';

export interface Datastore {

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
    init(): Promise<any>;

    /**
     * Return true if the DiskDatastore contains a document for the given
     * fingerprint.
     */
    contains(fingerprint: string): Promise<boolean>;

    delete(docMetaFileRef: DocMetaFileRef): Promise<Readonly<DeleteResult>>;

    /**
     * Add file data to the datastore.  This is used for binary data or other
     * data types that need to be stored. This is primarily designed for video,
     * audio, and documents like PDF, ePub, etc.
     */
    addFile(backend: Backend,
            name: string,
            data: FileRef | Buffer | string,
            meta?: FileMeta): Promise<DatastoreFile>;

    getFile(backend: Backend, name: string): Promise<Optional<DatastoreFile>>;

    containsFile(backend: Backend, name: string): Promise<boolean>;

    deleteFile(backend: Backend, name: string): Promise<void>;

    /**
     * Get the data for the DocMeta object we currently in the datastore for
     * this given fingerprint or null if it does not exist.
     * @return {string} A JSON string representing the DocMeta which is decoded
     * by the PersistenceLayer.
     */
    getDocMeta(fingerprint: string): Promise<string | null>;

    /**
     * Write the datastore to disk.
     *
     * @param fingerprint The fingerprint of the data we should be working with.
     * @param data The RAW data to decode by the PersistenceLayer
     * @param docInfo The DocInfo for this document that we're writing
     */
    sync(fingerprint: string, data: any, docInfo: IDocInfo, datastoreMutation?: DatastoreMutation<boolean>): Promise<void>;

    /**
     * Return an array of DocMetaFiles currently in the repository.
     */
    getDocMetaFiles(): Promise<DocMetaRef[]>;

}

// noinspection TsLint
export type FileMeta = {[key: string]: string};

/**
 * The result of a Datastore mutation including latches for whether the result
 * was full written or not.
 */
export interface DatastoreMutation<T> {

    /**
     * The mutation was written but still pending.  This happens when we're
     * writing to a WAL or a local vs cloud environment where the write may need
     * to be written to a cloud provider.
     */
    readonly written: Latch<T>;

    /**
     * The mutation was fully commmited and can not be lost.
     */
    readonly committed: Latch<T>;

    /**
     * Pipe the resolve and reject status of the latches to the target.
     */
    pipe<V>(converter: (input: T) => V, target: DatastoreMutation<V>): void;

    /**
     * Handle input from a promise that resolves both latches.
     */
    handle<V>(promise: Promise<V>, converter: (input: V) => T): void;

}

abstract class AbstractDatastoreMutation<T> implements DatastoreMutation<T> {

    public abstract readonly written: Latch<T>;
    public abstract readonly committed: Latch<T>;

    /**
     * Pipe the resolve and reject status of the latches to the target.
     */
    public pipe<V>(converter: (input: T) => V, target: DatastoreMutation<V>): void {

        this.pipeLatch(this.written, target.written, converter);
        this.pipeLatch(this.committed, target.committed, converter);

    }

    public handle<V>(promise: Promise<V>, converter: (input: V) => T): void {

        promise.then((result) => {
            this.written.resolve(converter(result));
            this.committed.resolve(converter(result));
        }).catch(err => {
            this.written.reject(err);
            this.committed.reject(err);
        });

    }

    private pipeLatch<V>(source: Latch<T>,
                         target: Latch<V>,
                         converter: (input: T) => V): void {

        source.get()
            .then((value: T) => target.resolve(converter(value)))
            .catch(err => target.reject(err));

    }

}

/**
 * Fully commited ahead of time and with a given value. This is used for the
 * disk datastore
 */
export class DefaultDatastoreMutation<T> extends AbstractDatastoreMutation<T> {

    public readonly written = new Latch<T>();

    public readonly committed = new Latch<T>();

}

/**
 *
 */
export class CommittedDatastoreMutation<T> extends AbstractDatastoreMutation<T> {

    public readonly written = new Latch<T>();

    public readonly committed = new Latch<T>();

    constructor(value: T) {
        super();
        this.written.resolve(value);
        this.committed.resolve(value);
    }

}

/**
 * The writes written and committed mutations complete together as a batch.
 */
export class BatchDatastoreMutation<T> extends AbstractDatastoreMutation<T> {

    public readonly written: Latch<T>;

    public readonly committed: Latch<T>;

    constructor(dm0: DatastoreMutation<T>, dm1: DatastoreMutation<T>, target: DatastoreMutation<T> ) {
        super();

        this.written = target.written;
        this.committed = target.committed;

        this.batched(dm0.written.get(), dm1.written.get(), this.written);
        this.batched(dm0.committed.get(), dm1.committed.get(), this.committed);

    }

    private batched(promise0: Promise<T>, promise1: Promise<T>, latch: Latch<T>): void {

        const batch = Promise.all([promise0, promise1]);

        batch.then((result) => {
            latch.resolve(result[0]);
        }).catch(err => {
            latch.reject(err);
        });

    }

}

export class DatastoreMutations {

    public static batched<T>(dm0: DatastoreMutation<T>, dm1: DatastoreMutation<T>, target: DatastoreMutation<T> ) {

        this.batchPromises(dm0.written.get(), dm1.written.get(), target.written);
        this.batchPromises(dm0.committed.get(), dm1.committed.get(), target.committed);

    }

    private static batchPromises<T>(promise0: Promise<T>, promise1: Promise<T>, latch: Latch<T>): void {

        const batch = Promise.all([promise0, promise1]);

        batch.then((result) => {
            latch.resolve(result[0]);
        }).catch(err => {
            latch.reject(err);
        });

    }

}
