import {Datastore, FileMeta, InitResult, SynchronizingDatastore,
        MutationType, FileRef, DocMetaMutation, DocMetaSnapshotEvent,
        DocMetaSnapshotEventListener} from './Datastore';
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

    private readonly cloud: SynchronizingDatastore;

    private readonly docComparisonIndex = new DocComparisonIndex();

    constructor(local: Datastore, cloud: SynchronizingDatastore) {
        this.local = local;
        this.cloud = cloud;
        this.stashDir = local.stashDir;
        this.logsDir = local.logsDir;
        this.directories = local.directories;
    }

    public async init(): Promise<InitResult> {

        // add the event listeners to the remote BEFORE we init... We might get
        // two docs so we need to validate with the docComparisonIndex while
        // loading to avoid double writes.
        //
        // Initially we just get from the local cache but then we will start
        // getting documents from the datastore once it comes online.

        this.cloud.addDocMetaSynchronizationEventListener(docMetaSnapshotEvent => {

            // TODO once this fails we need to make sure to tell the user and
            // right now we don't really have an event stream for this.
            this.onRemoteDocMutations(docMetaSnapshotEvent.docMetaMutations)
                .catch( err => log.error("Unable to handle doc replication event: ", err));

        });

        await Promise.all([this.cloud.init(), this.local.init()]);

        return {};

    }

    public async stop() {
        await Promise.all([this.cloud.stop(), this.local.stop()]);
    }

    public async contains(fingerprint: string): Promise<boolean> {
        return this.local.contains(fingerprint);
    }

    public async getDocMeta(fingerprint: string): Promise<string | null> {
        return this.local.getDocMeta(fingerprint);
    }

    public async writeFile(backend: Backend,
                           ref: FileRef,
                           data: Buffer | string, meta: FileMeta = {}): Promise<DatastoreFile> {

        // for this to work we have to use fierbase snapshot QuerySnapshot and
        // look at docChanges and wait for the document we requested...

        await this.cloud.writeFile(backend, ref, data, meta);

        // TODO: can't we just wait until the event is fired when it's pulled
        // down as part of the normal snapshot mechanism.?  That might be best
        // as we would be adding it twice.
        return this.local.writeFile(backend, ref, data, meta);

    }

    public async getFile(backend: Backend, ref: FileRef): Promise<Optional<DatastoreFile>> {
        return this.local.getFile(backend, ref);
    }

    public containsFile(backend: Backend, ref: FileRef): Promise<boolean> {
        return this.local.containsFile(backend, ref);
    }

    public async deleteFile(backend: Backend, ref: FileRef): Promise<void> {

        await this.cloud.deleteFile(backend, ref);

        return this.local.deleteFile(backend, ref);

    }

    public async delete(docMetaFileRef: DocMetaFileRef,
                        datastoreMutation: DatastoreMutation<boolean> = new DefaultDatastoreMutation()):
        Promise<Readonly<CloudAwareDeleteResult>> {

        try {

            await DatastoreMutations.executeBatchedWrite(datastoreMutation,
                                                         async (remoteCoordinator) => {
                                                             this.cloud.delete(docMetaFileRef, remoteCoordinator);
                                                         },
                                                         async (localCoordinator) => {
                                                             this.local.delete(docMetaFileRef, localCoordinator);
                                                         });
        } finally {
            this.docComparisonIndex.remove(docMetaFileRef.fingerprint);
        }

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
                                                              this.cloud.write(fingerprint, data, docInfo, remoteCoordinator),
                                                          (localCoordinator) =>
                                                              this.local.write(fingerprint, data, docInfo, localCoordinator));

        } finally {

            this.docComparisonIndex.putDocInfo(docInfo);

        }

    }

    public async getDocMetaFiles(): Promise<DocMetaRef[]> {
        return this.local.getDocMetaFiles();
    }

    public async snapshot(listener: DocMetaSnapshotEventListener): Promise<void> {

        // FIXME: on the first snapshot() we need to make sure the source and
        // target are synchronized and we need to have some sort of way to get
        // events about what's happening to update the UI as remote + local
        // events will be in flight.

        return this.cloud.snapshot(listener);
    }

    /**
     * Called on init() for every doc in the remote repo.  We then see if we
     * have loaded it locally and update it if it's stale.
     */
    // private onRemoteDocInit(docMeta: DocMeta) {
    //
    //     const docComparison =
    // this.docComparisonIndex.get(docMeta.docInfo.fingerprint);  if (!
    // docComparison) { this.onRemoteDocMutation(docMeta, 'created'); }  if
    // (docComparison && UUIDs.compare(docComparison.uuid,
    // docMeta.docInfo.uuid) > 0) { this.onRemoteDocMutation(docMeta,
    // 'updated'); }  }

    private async onRemoteDocMutations(docMetaMutations: ReadonlyArray<DocMetaMutation>) {

        for (const docMetaMutation of docMetaMutations) {
            await this.onRemoteDocMutation(docMetaMutation);
        }

    }

    // a document has been updated on the remote and we need to update it
    // locally.
    private async onRemoteDocMutation(docMetaMutation: DocMetaMutation) {

        const {docMeta, mutationType} = docMetaMutation;

        if (mutationType === 'created' || mutationType === 'updated') {

            try {

                const data = DocMetas.serialize(docMeta);
                await this.local.write(docMeta.docInfo.fingerprint, data, docMeta.docInfo);

                // FIXME: we have to fire event listeners so the doc repo
                // discovers this new document...

            } finally {
                this.docComparisonIndex.putDocMeta(docMeta);
            }

        } else {

            await this.local.delete({
                fingerprint: docMeta.docInfo.fingerprint,
                docFile: {
                    name: docMeta.docInfo.filename!,
                    hashcode: docMeta.docInfo.hashcode
                },
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
