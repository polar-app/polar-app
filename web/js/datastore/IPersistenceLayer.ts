import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {DeleteResult} from './DiskDatastore';
import {DocMeta} from '../metadata/DocMeta';

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

    syncDocMeta(docMeta: DocMeta): Promise<void>;

    sync(fingerprint: string, docMeta: DocMeta): Promise<void>;

    getDocMetaFiles(): Promise<DocMetaRef[]>;

    // TODO:
    // get an overview of documents in teh repository
    // overview(): Promise<DatastoreOverview>;

}
