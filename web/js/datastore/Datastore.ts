// A datastore that supports ledgers and checkpoints.
import {DocMetaRef} from './DocMetaRef';

export interface Datastore {

    readonly stashDir: string;

    readonly logsDir: string;

    /**
     * Init the datastore, potentially reading files of disk, the network, etc.
     */
    init(): Promise<any>;

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
