import {
    Datastore, FileMeta, InitResult, SynchronizingDatastore,
    MutationType, FileRef, DocMetaMutation, DocMetaSnapshotEvent,
    DocMetaSnapshotEventListener, SnapshotResult, SyncDocs, SyncDocMap,
    ErrorListener, DocMetaSnapshotEvents, SyncDocMaps, SynchronizationEvent,
    FileSynchronizationEvent, FileSynchronizationEventListener,
    SynchronizationEventListener,
    AbstractDatastore} from './Datastore';
import {Directories} from './Directories';
import {DocMetaFileRef, DocMetaFileRefs, DocMetaRef} from './DocMetaRef';
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
import {DocMetaComparisonIndex} from './DocMetaComparisonIndex';
import {PersistenceLayers, SyncOrigin} from './PersistenceLayers';
import {DocMetaSnapshotEventListeners, EventDeduplicator} from './DocMetaSnapshotEventListeners';
import {Latch} from '../util/Latch';
import {ASYNC_NULL_FUNCTION, NULL_FUNCTION} from '../util/Functions';
import {isUpperCase} from 'tslint/lib/utils';
import {IEventDispatcher, SimpleReactor} from '../reactor/SimpleReactor';
import {Preconditions} from '../Preconditions';
import {AsyncFunction} from '../util/AsyncWorkQueue';
import * as firebase from '../firestore/lib/firebase';
import {Dictionaries} from '../util/Dictionaries';

const log = Logger.create();

export interface CloudAwareDeleteResult extends DeleteResult {

}

/**
 * A CloudAwareDatastore allows us to have one datastore with a local copy and
 * remote datastore backing them.  Reads are resolved via the local data store
 * and writes are resolved to both the remote and local concurrently.
 * The reverse is true too. If we startup and there is an excess file in the
 * remote, it's copied local.
 */
export class CloudAwareDatastore extends AbstractDatastore implements Datastore, SynchronizingDatastore {

    // allows us to keep track of the snapshot id so that when we report errors
    // we can know which snapshot failed.
    private static SNAPSHOT_ID = 0;

    public readonly id = 'cloud-aware';

    public readonly stashDir: string;

    public readonly logsDir: string;

    public readonly directories: Directories;

    public readonly local: Datastore;

    public readonly cloud: Datastore;

    private readonly fileSynchronizationEventDispatcher: IEventDispatcher<FileSynchronizationEvent> = new SimpleReactor();

    private readonly synchronizationEventDispatcher: IEventDispatcher<SynchronizationEvent> = new SimpleReactor();

    private readonly docMetaSnapshotEventDispatcher: IEventDispatcher<DocMetaSnapshotEvent> = new SimpleReactor();

    private readonly docMetaComparisonIndex = new DocMetaComparisonIndex();

    private primarySnapshot?: SnapshotResult;

    public shutdownHook: AsyncFunction = ASYNC_NULL_FUNCTION;

    constructor(local: Datastore, cloud: Datastore) {
        super();
        this.local = local;
        this.cloud = cloud;
        this.stashDir = local.stashDir;
        this.logsDir = local.logsDir;
        this.directories = local.directories;
    }

    public async init(errorListener: ErrorListener = NULL_FUNCTION): Promise<InitResult> {

        await Promise.all([this.cloud.init(errorListener), this.local.init(errorListener)]);

        const snapshotListener = (event: DocMetaSnapshotEvent) => this.docMetaSnapshotEventDispatcher.dispatchEvent(event);

        this.primarySnapshot = await this.snapshot(snapshotListener, errorListener);

        return {};

    }

    public async stop() {

        // TODO: all snapshots that have been handed out should be stopped...

        // we have to have the shutdown run BEFORE we actually shut down or we
        // might be weird and unusual behavior.
        await this.shutdownHook();

        if (this.primarySnapshot && this.primarySnapshot.unsubscribe) {
            this.primarySnapshot.unsubscribe();
        }

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
                           data: Buffer | string,
                           meta: FileMeta = {}): Promise<DatastoreFile> {

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

        datastoreMutation.written.get()
            .then(() => {

                this.docMetaComparisonIndex.remove(docMetaFileRef.fingerprint);

            });

        await DatastoreMutations.executeBatchedWrite(datastoreMutation,
                                                     async (remoteCoordinator) => {
                                                         await this.cloud.delete(docMetaFileRef, remoteCoordinator);
                                                     },
                                                     async (localCoordinator) => {
                                                         await this.local.delete(docMetaFileRef, localCoordinator);
                                                     });

        return {};

    }

    public async write(fingerprint: string,
                       data: string,
                       docInfo: DocInfo,
                       datastoreMutation: DatastoreMutation<boolean> = new DefaultDatastoreMutation()): Promise<void> {

        datastoreMutation
            .written.get().then(() => {

            this.docMetaComparisonIndex.updateUsingDocInfo(docInfo);

        });

        return DatastoreMutations.executeBatchedWrite(datastoreMutation,
                                                      async (remoteCoordinator) => {
                                                          await this.cloud.write(fingerprint, data, docInfo, remoteCoordinator);
                                                      },
                                                      async (localCoordinator) => {
                                                          await this.local.write(fingerprint, data, docInfo, localCoordinator);
                                                      });

    }

    public async getDocMetaFiles(): Promise<DocMetaRef[]> {
        return this.local.getDocMetaFiles();
    }

    public async snapshot(docMetaSnapshotEventListener: DocMetaSnapshotEventListener,
                          errorListener: ErrorListener = NULL_FUNCTION): Promise<SnapshotResult> {

        const isPrimarySnapshot: boolean = this.primarySnapshot === undefined;

        const snapshotID = CloudAwareDatastore.SNAPSHOT_ID++;

        const deduplicatedListener = DocMetaSnapshotEventListeners.createDeduplicatedListener(docMetaSnapshotEvent => {
            docMetaSnapshotEventListener(docMetaSnapshotEvent);
        });

        class InitialSnapshotLatch {

            public readonly syncDocMap: SyncDocMap = {};
            public readonly latch = new Latch<boolean>();
            public readonly id: string;

            private hasInitialTerminatedBatch: boolean = false;

            private pending: number = 0;

            constructor(id: string) {
                this.id = id;
            }

            private async handle(docMetaSnapshotEvent: DocMetaSnapshotEvent) {

                console.log("FIXME: handling InitialSnapshotLatch event for: " + this.id, docMetaSnapshotEvent);

                try {

                    if (this.hasInitialTerminatedBatch) {
                        return;
                    }

                    if (! docMetaSnapshotEvent.batch || docMetaSnapshotEvent.batch.id !== 0) {
                        return;
                    }

                    ++this.pending;

                    const syncDocs = await DocMetaSnapshotEvents.toSyncDocs(docMetaSnapshotEvent);
                    SyncDocMaps.putAll(this.syncDocMap, syncDocs);

                    if (docMetaSnapshotEvent.consistency === 'committed' &&
                        docMetaSnapshotEvent.batch!.terminated) {

                        const nrDocs = Dictionaries.size(this.syncDocMap);

                        console.log(`FIXME: InitialSnapshotLatch ${this.id} has nrDocs ${nrDocs} and resolved with: ` +
                                        DocMetaSnapshotEvents.format(docMetaSnapshotEvent));

                        this.hasInitialTerminatedBatch = true;

                    }

                } finally {

                    --this.pending;

                    if (this.pending === 0) {
                        this.latch.resolve(true);
                    }

                }

            }

            private onSnapshot(docMetaSnapshotEvent: DocMetaSnapshotEvent) {

                console.log("FIXME: within onSnapshot for: " + this.id);

                this.handle(docMetaSnapshotEvent)
                    .catch(err => {
                        log.error(`Unable to handle event for snapshot: ${snapshotID}`, err);
                        errorListener(err);
                    });

            }

            public createSnapshot(datastore: Datastore) {

                // FIXME: this is the bug... the LAST snapshot event is given to
                // us as a single event which does not await the previous
                // events... so what happens is that we get the last event
                // immediately except none of the other events have been
                // consumed yet as they are being awaited...

                return datastore.snapshot(docMetaSnapshotEvent => {

                    console.log("FIXME: within raw handler for: " + this.id);

                    // always forward to the synchronizing listener
                    synchronizingListener(docMetaSnapshotEvent);

                    if (! initialSyncCompleted) {
                        this.onSnapshot(docMetaSnapshotEvent);
                    }

                }, errorListener);

            }

        }

        let initialSyncCompleted: boolean = false;

        // The way this algorithm works is that we load the local store first
        // and on the first snapshot we keep an index of the fingerprint to
        // UUID... then we wait until we can get the similar index from the
        // 'committed' version of the cloud datastore, then we perform a
        // synchronize based on this metadata... at which point we synchronize
        // both datasources.

        const localInitialSnapshotLatch = new InitialSnapshotLatch('local');
        const cloudInitialSnapshotLatch = new InitialSnapshotLatch('cloud');

        // FIXME: is it possible to get a double write if I call writeDocMeta
        // to the main store and is it writtne a second time when we get the
        // event from the remote instance?  I think we might have to have a
        // 'written' event go through first from the write() method and sent
        // to all outstanding listeners first.

        // FIXME: if the DiskDatastore and other datastores emit events in
        // THEIR snapshots directly then I think we do not need to do anything
        // special.

        const synchronizingEventDeduplicator: EventDeduplicator
            = DocMetaSnapshotEventListeners.createDeduplicatedListener(docMetaSnapshotEvent => {

            const handleSnapshotSync = async () => {

                if (docMetaSnapshotEvent.consistency !== 'committed') {
                    return;
                }

                // FIXME: I think ONE update is sending over ALL the updates and
                // we should only care about the docChanges... ...

                for (const docMetaMutation of docMetaSnapshotEvent.docMetaMutations) {

                    // FIXME FIXME FIXME: no binary files are being transferred
                    // here... Just DocMeta...  Maybe use the same code that
                    // synchronize is using...

                    if (docMetaMutation.mutationType === 'created' || docMetaMutation.mutationType === 'updated') {
                        const data = await docMetaMutation.dataProvider();
                        const docInfo = await docMetaMutation.docInfoProvider();
                        Preconditions.assertPresent(data, "No data in replication listener: ");

                        console.log("FIXME666: doing write now!!!");
                        await this.local.write(docMetaMutation.fingerprint, data, docInfo);
                    }

                    if (docMetaMutation.mutationType === 'deleted') {
                        const docMetaFileRef = await docMetaMutation.docMetaFileRefProvider();
                        await this.local.delete(docMetaFileRef);
                    }

                }

                this.synchronizationEventDispatcher.dispatchEvent({
                    ...docMetaSnapshotEvent,
                    dest: 'local'
                });

            };

            const handleEvent = async () => {

                try {

                    if (initialSyncCompleted && isPrimarySnapshot) {
                        await handleSnapshotSync();
                    }

                } finally {
                    // need to pass on these events after the replication.
                    docMetaSnapshotEventListener(docMetaSnapshotEvent);
                }

            };

            handleEvent()
                .catch(err => {
                    log.error(`Unable to handle synchronizing snapshot ${snapshotID}`, err);
                    errorListener(err);
                });

        }, this.docMetaComparisonIndex);

        const synchronizingListener = synchronizingEventDeduplicator.listener;

        const localSnapshotResultPromise = localInitialSnapshotLatch.createSnapshot(this.local);
        await localInitialSnapshotLatch.latch.get();

        const cloudSnapshotResultPromise = cloudInitialSnapshotLatch.createSnapshot(this.cloud);
        await cloudInitialSnapshotLatch.latch.get();

        const localSyncOrigin: SyncOrigin = {
            datastore: this.local,
            syncDocMap: localInitialSnapshotLatch.syncDocMap
        };

        const cloudSyncOrigin: SyncOrigin = {
            datastore: this.cloud,
            syncDocMap: cloudInitialSnapshotLatch.syncDocMap
        };

        // FIXME: sometimes we statup and we have a broken SyncDocMap in the
        // cloud origin for some reason.

        if (isPrimarySnapshot) {

            log.info("Transferring from local -> cloud...");
            await PersistenceLayers.transfer(localSyncOrigin, cloudSyncOrigin, deduplicatedListener.listener, 'local-to-cloud');
            log.info("Transferring from local -> cloud...done");

            log.info("Transferring from cloud -> local...");
            await PersistenceLayers.transfer(cloudSyncOrigin, localSyncOrigin, deduplicatedListener.listener, 'cloud-to-local');
            log.info("Transferring from cloud -> local...done");

        }

        initialSyncCompleted = true;

        await localSnapshotResultPromise;
        const cloudSnapshotResult = await cloudSnapshotResultPromise;

        return {
            unsubscribe: cloudSnapshotResult.unsubscribe
        };

    }

    public addFileSynchronizationEventListener(eventListener: FileSynchronizationEventListener): void {
        this.fileSynchronizationEventDispatcher.addEventListener(eventListener);
    }

    public addSynchronizationEventListener(eventListener: SynchronizationEventListener): void {
        this.synchronizationEventDispatcher.addEventListener(eventListener);
    }

    public addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void {
        this.docMetaSnapshotEventDispatcher.addEventListener(docMetaSnapshotEventListener);
    }

    public async deactivate() {
        await firebase.auth().signOut();
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
