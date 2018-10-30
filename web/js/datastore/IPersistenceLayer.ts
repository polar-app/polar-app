import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {DeleteResult} from './DiskDatastore';
import {DocMeta} from '../metadata/DocMeta';
import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {FileMeta} from './Datastore';
import {DocInfo} from '../metadata/DocInfo';

export interface IPersistenceLayer {

    readonly stashDir: string;

    readonly logsDir: string;

    init(): Promise<void>;

    /**
     * Return true if the DiskDatastore contains a document for the given
     * fingerprint.
     */
    contains(fingerprint: string): Promise<boolean>;

    /**
     * Delete a file from PersistenceLayer.
     *
     * @param docMetaFileRef The file to delete.
     */
    delete(docMetaFileRef: DocMetaFileRef): Promise<DeleteResult>;

    getDocMeta(fingerprint: string): Promise<DocMeta | undefined>;

    syncDocMeta(docMeta: DocMeta): Promise<DocInfo>;

    /**
     * Return the DocInfo written. The DocInfo may be updated on commit including
     * updating lastUpdated, etc.
     *
     */
    sync(fingerprint: string, docMeta: DocMeta): Promise<DocInfo>;

    getDocMetaFiles(): Promise<DocMetaRef[]>;

    // TODO:
    // get an overview of documents in teh repository
    // overview(): Promise<DatastoreOverview>;

    addFile(backend: Backend, name: string, data: NodeJS.ReadableStream | Buffer | string, meta?: FileMeta): Promise<DatastoreFile>;

    getFile(backend: Backend, name: string): Promise<Optional<DatastoreFile>>;

    containsFile(backend: Backend, name: string): Promise<boolean>;

}
