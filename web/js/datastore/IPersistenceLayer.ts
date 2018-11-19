import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {DeleteResult, FileRef} from './Datastore';
import {DocMeta} from '../metadata/DocMeta';
import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {FileMeta} from './Datastore';
import {DocInfo} from '../metadata/DocInfo';
import {FileHandle} from '../util/Files';
import {DatastoreMutation} from './DatastoreMutation';

export interface IPersistenceLayer {

    readonly stashDir: string;

    readonly logsDir: string;

    init(): Promise<void>;

    stop(): Promise<void>;

    /**
     * Return true if the DiskDatastore contains a document for the given
     * fingerprint.
     */
    contains(fingerprint: string): Promise<boolean>;

    getDocMeta(fingerprint: string): Promise<DocMeta | undefined>;

    getDocMetaFiles(): Promise<DocMetaRef[]>;

    /**
     * Delete a file from PersistenceLayer.
     */
    delete(docMetaFileRef: DocMetaFileRef, datastoreMutation?: DatastoreMutation<boolean>): Promise<DeleteResult>;

    writeDocMeta(docMeta: DocMeta, datastoreMutation?: DatastoreMutation<DocInfo>): Promise<DocInfo>;

    /**
     * Return the DocInfo written. The DocInfo may be updated on commit
     * including updating lastUpdated, etc.
     */
    write(fingerprint: string, docMeta: DocMeta, datastoreMutation?: DatastoreMutation<DocInfo>): Promise<DocInfo>;

    writeFile(backend: Backend,
              ref: FileRef,
              data: FileHandle | Buffer | string,
              meta?: FileMeta): Promise<DatastoreFile>;

    getFile(backend: Backend, ref: FileRef): Promise<Optional<DatastoreFile>>;

    containsFile(backend: Backend, ref: FileRef): Promise<boolean>;

}
