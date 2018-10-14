// A datastore that supports ledgers and checkpoints.
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {DeleteResult} from './DiskDatastore';
import {Directories} from './Directories';
import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';

export interface Datastore {

    readonly stashDir: string;

    readonly filesDir: string;

    readonly logsDir: string;

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
    addFile(backend: Backend, name: string, data: Buffer | string, meta: FileMeta): Promise<DatastoreFile>;

    getFile(backend: Backend, name: string): Promise<Optional<DatastoreFile>>;

    containsFile(backend: Backend, name: string): Promise<boolean>;

    /**
     * Get the data for the DocMeta object we currently in the datastore for
     * this given fingerprint or null if it does not exist.
     * @return {string} A JSON string representing the DocMeta which is decoded
     * by the PersistenceLayer.
     */
    getDocMeta(fingerprint: string): Promise<string | null>;

    // delete(fingerprint: string): Promise<void>;

    /**
     * Write the datastore to disk.
     *
     * @param fingerprint The fingerprint of the data we should be working with.
     * @param data The RAW data to decode by the PersistenceLayer
     */
    sync(fingerprint: string, data: any): Promise<void>;

    /**
     * Return an array of DocMetaFiles currently in the repository.
     */
    getDocMetaFiles(): Promise<DocMetaRef[]>;

}

// noinspection TsLint
export type FileMeta = {[key: string]: string};
