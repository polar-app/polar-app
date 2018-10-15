import {Datastore, FileMeta} from './Datastore';
import {Logger} from '../logger/Logger';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {Directories} from './Directories';

import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {DeleteResult} from './DiskDatastore';

const log = Logger.create();

export class FirebaseDatastore implements Datastore {

    public readonly stashDir: string;

    public readonly logsDir: string;

    public readonly directories: Directories;

    constructor() {

        this.directories = new Directories();

        // the path to the stash directory
        this.stashDir = this.directories.stashDir;
        this.logsDir = this.directories.logsDir;

    }

    public async init() {
        throw new Error("Not implemented");
    }

    /**
     * Return true if the DiskDatastore contains a document for the given
     * fingerprint
     */
    public async contains(fingerprint: string): Promise<boolean> {
        throw new Error("Not implemented");
    }

    /**
     * Delete the DocMeta file and the underlying doc from the stash.
     *
     */
    public async delete(docMetaFileRef: DocMetaFileRef): Promise<Readonly<DeleteResult>> {
        throw new Error("Not implemented");
    }

    /**
     * Get the DocMeta object we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    public async getDocMeta(fingerprint: string): Promise<string | null> {
        throw new Error("Not implemented");
    }


    public async addFile(backend: Backend, name: string, data: Buffer | string, meta: FileMeta = {}): Promise<DatastoreFile> {
        throw new Error("Not implemented");
    }

    public async getFile(backend: Backend, name: string): Promise<Optional<DatastoreFile>> {
        throw new Error("Not implemented");
    }

    public containsFile(backend: Backend, name: string): Promise<boolean> {
        throw new Error("Not implemented");
    }

    /**
     * Write the datastore to disk.
     */
    public async sync(fingerprint: string, data: string) {


    }

    public async getDocMetaFiles(): Promise<DocMetaRef[]> {
        throw new Error("Not implemented");
    }

}
