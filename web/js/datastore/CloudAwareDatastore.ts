import {Datastore, FileMeta} from './Datastore';
import {Directories} from './Directories';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {DeleteResult} from './DiskDatastore';
import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {DocInfo} from '../metadata/DocInfo';
import {DefaultDatastoreMutation, DatastoreMutation} from './DatastoreMutation';
import {DatastoreMutations} from './DatastoreMutations';

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

    private readonly remote: Datastore;

    constructor(local: Datastore, remote: Datastore) {
        this.local = local;
        this.remote = remote;
        this.stashDir = local.stashDir;
        this.logsDir = local.logsDir;
        this.directories = local.directories;
    }

    public async init() {

        await Promise.all([this.remote.init(), this.local.init()]);

    }

    public async contains(fingerprint: string): Promise<boolean> {
        return this.local.contains(fingerprint);
    }

    public async delete(docMetaFileRef: DocMetaFileRef): Promise<Readonly<DeleteResult>> {
        // FIXME: don't need to wait until the remote one is complete.
        await this.remote.delete(docMetaFileRef);
        return this.local.delete(docMetaFileRef);
    }

    public async getDocMeta(fingerprint: string): Promise<string | null> {
        return this.local.getDocMeta(fingerprint);
    }

    public async addFile(backend: Backend, name: string, data: Buffer | string, meta: FileMeta = {}): Promise<DatastoreFile> {

        // for this to work we have to use fierbase snapshot QuerySnapshot and
        // look at docChanges and wait for the document we requested...

        await this.remote.addFile(backend, name, data, meta);

        // TODO: can't we just wait until the event is fired when it's pulled
        // down as part of the normal snapshot mechanism.?  That might be best
        // as we would be adding it twice.
        return this.local.addFile(backend, name, data, meta);

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

    public async sync(fingerprint: string,
                      data: string,
                      docInfo: DocInfo,
                      datastoreMutation: DatastoreMutation<boolean> = new DefaultDatastoreMutation()): Promise<void> {

        const remoteCoordinator = new DefaultDatastoreMutation<boolean>();
        const localCoordinator = new DefaultDatastoreMutation<boolean>();

        const syncPromise = this.remote.sync(fingerprint, data, docInfo, remoteCoordinator);

        remoteCoordinator.written.get()
            .then(() => {
                // once we've written to the local firestore cache, we can write
                // to the local disk store.
                this.local.sync(fingerprint, data, docInfo, localCoordinator);
             });

        DatastoreMutations.batched(remoteCoordinator, localCoordinator, datastoreMutation);

        return syncPromise;
    }

    public async getDocMetaFiles(): Promise<DocMetaRef[]> {

        throw new Error("Not implemented");

    }

    /**
     * Perform a write while coordinating the remote and local writes.
     *
     * The remote operation executes and completes written once it's written
     * locally but potentially still unsafe as it's not committed.  Once it's
     * committed locally (and safe) then we can perform the local operation
     * which is also atomic (and safe).
     *
     * Then we perform BOTH batched operations and make sure they're all both
     * written and committed before returning.
     *
     * The caller DOES NOT need to wait for the promise to complete.  It could
     * put them into queues or just look at the written and committed values
     * on the datastoreMutation as it's moving forward.  This allows us to
     * have a progress bar integrated showing that the sync operations aren't
     * completed yet.
     *
     * @param remoteCoordinator
     * @param localCoordinator
     * @param datastoreMutation
     * @param remoteSync
     * @param localSync
     */
    private async executeBatchedWrite<T>(remoteCoordinator: DatastoreMutation<T>,
                                         localCoordinator: DatastoreMutation<T>,
                                         datastoreMutation: DatastoreMutation<T>,
                                         remoteSync: () => Promise<void>,
                                         localSync: () => Promise<void>) {

        remoteSync();

        remoteCoordinator.written.get()
            .then(() => {
                localSync();
            });

        DatastoreMutations.batched(remoteCoordinator, localCoordinator, datastoreMutation);

        // only return once the remote and local promises / operations have
        // been completed...

        await datastoreMutation.committed.get();

    }

}
