// A datastore that supports ledgers and checkpoints.
export abstract class Datastore {

    /**
     * Init the datastore, potentially reading files of disk, the network, etc.
     */
    async abstract init(): Promise<any>;

    /**
     * Get the data for the DocMeta object we currently in the datastore for
     * this given fingerprint or null if it does not exist.

     * @return {string} A JSON string representing the DocMeta which is decoded
     * by the PersistenceLayer.
     */
    abstract async getDocMeta(fingerprint: string): Promise<string | null>;

    /**
     * Write the datastore to disk.
     *
     * @param fingerprint The fingerprint of the data we should be working with.
     * @param data The RAW data to decode by the PersistenceLayer
     */
    abstract async sync(fingerprint: string, data: any): Promise<void>;

}
