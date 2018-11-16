import {Datastore, FileMeta, InitResult, SynchronizingDatastore, DocMutationType} from './Datastore';
import {Directories} from './Directories';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {DeleteResult} from './Datastore';
import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {DocInfo} from '../metadata/DocInfo';
import {DatastoreMutation, DefaultDatastoreMutation} from './DatastoreMutation';
import {DatastoreMutations} from './DatastoreMutations';
import {UUID} from '../metadata/UUID';
import {Datastores} from './Datastores';
import {DocMeta} from '../metadata/DocMeta';
import {UUIDs} from '../metadata/UUIDs';
import {DocMetas} from '../metadata/DocMetas';
import {Logger} from "../logger/Logger";

const log = Logger.create();

/**
 * A CloudAwareDatastore allows us to have one datastore with a local copy and
 * remote datastore backing them.  Reads are resolved via the local data store
 * and writes are resolved to both the remote and local concurrently.
 * The reverse is true too. If we startup and there is an excess file in the
 * remote, it's copied local.
 */
export class CloudAwareDatastore implements Datastore {

    public readonly stashDir: string;

    public readonly logsDir: string;

    public readonly directories: Directories;

    private readonly local: Datastore;

    private readonly remote: SynchronizingDatastore;

    private readonly docComparisonIndex = new DocComparisonIndex();

    constructor(local: Datastore, remote: SynchronizingDatastore) {
        this.local = local;
        this.remote = remote;
        this.stashDir = local.stashDir;
        this.logsDir = local.logsDir;
        this.directories = local.directories;
    }

    public async init(): Promise<InitResult> {

        // add the event listeners to the remote BEFORE we init... we might get
        // two docs so we need to validate with the docComparisonIndex while
        // loading to avoid double writes.

        this.remote.addDocReplicationEventListener(docReplicationEvent => {

            // TODO once this fails we need to make sure to tell the user and
            // right now we don't really have an event stream for this.
            this.onRemoteDocMutation(docReplicationEvent.docMeta, docReplicationEvent.mutationType)
                .catch( err => log.error("Unable to handle doc replication event: ", err));

        });

        await Promise.all([this.remote.init(), this.local.init()]);

        // Now sync the local with the remote pulling in any documents we need.

        // FIXME: I need to consider using a snapshot listener for this as it
        // would be faster as QUERIES go to the DB first but snapshots can come
        // out of cache first...
        //
        // FIXME: I think we're going to get a replication event on startup
        // which is *kind* of what we want even though it's a pre-existing
        // document.  We might need to have the concept of pre-and post init
        // replication docs....

        Datastores.getDocMetas(this.remote, (docMeta: DocMeta) =>  {
            this.onRemoteDocInit(docMeta);
        });


        // TODO:  the rest will catch up from replication as they are changes on
        // the remote end...

        return {};

    }

    public async stop() {
        await Promise.all([this.remote.stop(), this.local.stop()]);
    }

    public async contains(fingerprint: string): Promise<boolean> {
        return this.local.contains(fingerprint);
    }

    public async getDocMeta(fingerprint: string): Promise<string | null> {
        return this.local.getDocMeta(fingerprint);
    }

    public async writeFile(backend: Backend,
                           name: string,
                           data: Buffer | string, meta: FileMeta = {}): Promise<DatastoreFile> {

        // for this to work we have to use fierbase snapshot QuerySnapshot and
        // look at docChanges and wait for the document we requested...

        await this.remote.writeFile(backend, name, data, meta);

        // TODO: can't we just wait until the event is fired when it's pulled
        // down as part of the normal snapshot mechanism.?  That might be best
        // as we would be adding it twice.
        return this.local.writeFile(backend, name, data, meta);

    }

    public async getFile(backend: Backend, name: string): Promise<Optional<DatastoreFile>> {
        return this.local.getFile(backend, name);
    }

    public containsFile(backend: Backend, name: string): Promise<boolean> {
        return this.local.containsFile(backend, name);
    }

    public deleteFile(backend: Backend, name: string): Promise<void> {
        return this.local.deleteFile(backend, name);
    }


    public async delete(docMetaFileRef: DocMetaFileRef,
                        datastoreMutation: DatastoreMutation<boolean> = new DefaultDatastoreMutation()):
        Promise<Readonly<CloudAwareDeleteResult>> {

        DatastoreMutations.executeBatchedWrite(datastoreMutation,
                                               async (remoteCoordinator) => {
                                                   this.remote.delete(docMetaFileRef, remoteCoordinator);
                                               },
                                               async (localCoordinator) => {
                                                   this.local.delete(docMetaFileRef, localCoordinator);
                                               });

        // TODO: return the result of the local and remote operations.
        return {};

    }



    public async write(fingerprint: string,
                       data: string,
                       docInfo: DocInfo,
                       datastoreMutation: DatastoreMutation<boolean> = new DefaultDatastoreMutation()): Promise<void> {

        // TODO: return the result of the local and remote operations instead of
        // just void.

        try {

            return DatastoreMutations.executeBatchedWrite(datastoreMutation,
                                                          (remoteCoordinator) =>
                                                              this.remote.write(fingerprint, data, docInfo, remoteCoordinator),
                                                          (localCoordinator) =>
                                                              this.local.write(fingerprint, data, docInfo, localCoordinator));

        } finally {

            this.docComparisonIndex.putDocInfo(docInfo);

        }

    }

    public async getDocMetaFiles(): Promise<DocMetaRef[]> {

        // TODO: where do we get this from? local or remote?
        // TODO: implement a method to ensure the datastore is up to date...

        throw new Error("Not implemented");

    }

    /**
     * Called on init() for every doc in the remote repo.  We then see if we have
     * loaded it locally and update it if it's stale.
     */
    private onRemoteDocInit(docMeta: DocMeta) {

        const docComparison = this.docComparisonIndex.get(docMeta.docInfo.fingerprint);

        if (! docComparison) {
            this.onRemoteDocMutation(docMeta, 'added');
        }

        if (docComparison && UUIDs.compare(docComparison.uuid, docMeta.docInfo.uuid) > 0) {
            this.onRemoteDocMutation(docMeta, 'modified');
        }

    }

    // a document has been updated on the remote and we need to update it
    // locally.
    private async onRemoteDocMutation(docMeta: DocMeta, mutationType: DocMutationType) {

        if (mutationType === 'added' || mutationType === 'modified') {

            try {

                const data = DocMetas.serialize(docMeta);
                await this.local.write(docMeta.docInfo.fingerprint, data, docMeta.docInfo);

                // FIXME: we have to fire event listeners so the doc repo discovers
                // this new document...

            } finally {
                this.docComparisonIndex.putDocMeta(docMeta);
            }

        } else {

            await this.local.delete({
                fingerprint: docMeta.docInfo.fingerprint,
                filename: docMeta.docInfo.filename,
                docInfo: docMeta.docInfo
            });

        }

    }

}

export interface CloudAwareDeleteResult extends DeleteResult {

}

/**
 * The DocComparisonIndex allows us to detect which documents are local already
 * so that when we receive document from the cloud datastore we can decide
 * that we do not need to replicate it locally.
 */
export class DocComparisonIndex {

    private readonly backing: {[fingerprint: string]: DocUUID} = {};

    public get(fingerprint: string): DocUUID | undefined {
        return this.backing[fingerprint];
    }

    public remove(fingerprint: string) {
        delete this.backing[fingerprint];
    }

    public putDocMeta(docMeta: DocMeta) {

        this.backing[docMeta.docInfo.fingerprint] = {
            fingerprint: docMeta.docInfo.fingerprint,
            uuid: docMeta.docInfo.uuid
        };

    }

    public putDocInfo(docInfo: DocInfo) {

        this.backing[docInfo.fingerprint] = {
            fingerprint: docInfo.fingerprint,
            uuid: docInfo.uuid
        };

    }

}

/**
 * Represents a doc and its UUID.  The UUID is optional though as older docs
 * may not have a doc but in practice almost all docs will have a UUID.
 */
export interface DocUUID {
    fingerprint: string;
    uuid?: UUID;
}
