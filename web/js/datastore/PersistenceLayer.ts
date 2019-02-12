import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {DeleteResult, DocMetaSnapshotEvent, FileRef,
        DocMetaSnapshotEventListener, SnapshotResult, ErrorListener,
        DatastoreID,
    Datastore} from './Datastore';
import {DocMeta} from '../metadata/DocMeta';
import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {FileMeta} from './Datastore';
import {DocInfo} from '../metadata/DocInfo';
import {FileHandle} from '../util/Files';
import {DatastoreMutation} from './DatastoreMutation';
import {NULL_FUNCTION} from '../util/Functions';

export interface PersistenceLayer {

    readonly id: PersistenceLayerID;

    /**
     * The underlying datastore backing this persistence layer.
     */
    readonly datastore: Datastore;

    init(errorListener?: ErrorListener): Promise<void>;

    stop(): Promise<void>;

    /**
     * Return true if the DiskDatastore contains a document for the given
     * fingerprint.
     */
    contains(fingerprint: string): Promise<boolean>;

    getDocMeta(fingerprint: string): Promise<DocMeta | undefined>;

    getDocMetaRefs(): Promise<DocMetaRef[]>;

    /**
     * Get a current snapshot of the internal state of the Datastore by
     * receiving DocMetaSnapshotEvent on the initial state.
     */
    snapshot(listener: DocMetaSnapshotEventListener, errorListener?: ErrorListener): Promise<SnapshotResult>;

    createBackup(): Promise<void>;

    /**
     * Delete a file from PersistenceLayer.
     */
    delete(docMetaFileRef: DocMetaFileRef, datastoreMutation?: DatastoreMutation<boolean>): Promise<DeleteResult>;

    writeDocMeta(docMeta: DocMeta, datastoreMutation?: DatastoreMutation<DocInfo>): Promise<DocInfo>;

    /**
     * Make sure the docs with the given fingerprints are synchronized with
     * this datastore. Only implemented in cloud datastores.
     */
    synchronizeDocs(...docMetaRefs: DocMetaRef[]): Promise<void>;

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

    addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void;

    deactivate(): Promise<void>;

}

export type PersistenceLayerID = string;

