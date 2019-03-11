import {PersistenceLayer} from "./PersistenceLayer";
import {NULL_FUNCTION, ASYNC_NULL_FUNCTION} from "../util/Functions";
import {Percentages} from '../util/Percentages';
import {Backend} from './Backend';
import {Blobs} from "../util/Blobs";
import {ArrayBuffers} from "../util/ArrayBuffers";
import {AsyncFunction, AsyncWorkQueue} from '../util/AsyncWorkQueue';
import {DocMetaFileRefs, DocMetaRef} from "./DocMetaRef";
import {Datastore, DocMetaMutation, DocMetaSnapshotEvent, DocMetaSnapshotEventListener, FileRef, MutationType, SyncDoc, SyncDocMap, SyncDocs} from './Datastore';
import {UUIDs} from '../metadata/UUIDs';
import {ProgressTracker, Progress, ProgressListener} from '../util/ProgressTracker';
import {DocMetas} from '../metadata/DocMetas';
import {DefaultPersistenceLayer} from './DefaultPersistenceLayer';
import {Provider, AsyncProviders} from '../util/Providers';
import {DocMeta} from '../metadata/DocMeta';
import {IDocInfo} from '../metadata/DocInfo';
import {Dictionaries} from '../util/Dictionaries';
import {isPresent} from "../Preconditions";
import {Optional} from "../util/ts/Optional";
import {DocFileMeta} from "./DocFileMeta";
import {URLs} from "../util/URLs";
import {Logger} from "../logger/Logger";

const log = Logger.create();

export class PersistenceLayers {

    public static toPersistenceLayer(input: Datastore ): PersistenceLayer {
        return new DefaultPersistenceLayer(input);
    }

    public static async toSyncDocMap(datastore: Datastore,
                                     progressStateListener: ProgressListener = NULL_FUNCTION) {

        const docMetaFiles = await datastore.getDocMetaRefs();

        return this.toSyncDocMapFromDocs(datastore, docMetaFiles, progressStateListener);

    }

    public static async toSyncDocMapFromDocs(datastore: Datastore,
                                             docMetaRefs: DocMetaRef[],
                                             progressStateListener: ProgressListener = NULL_FUNCTION) {

        const syncDocsMap: SyncDocMap = {};

        const work: AsyncFunction[] = [];
        const asyncWorkQueue = new AsyncWorkQueue(work);

        const progressTracker = new ProgressTracker(docMetaRefs.length,
                                                    `datastore:${datastore.id}#toSyncDocMapFromDocs`);

        for (const docMetaRef of docMetaRefs) {

            work.push(async () => {

                let docMeta: DocMeta | undefined = docMetaRef.docMeta;

                if (! docMeta) {

                    const data = await datastore.getDocMeta(docMetaRef.fingerprint);

                    if (isPresent(data)) {
                        docMeta = DocMetas.deserialize(data!, docMetaRef.fingerprint);
                    }

                }

                if (isPresent(docMeta)) {

                    syncDocsMap[docMetaRef.fingerprint] = SyncDocs.fromDocInfo(docMeta!.docInfo, 'created');

                    progressStateListener(progressTracker.peek());

                } else {
                    // there is no doc for this fingerprint.
                }

            });

        }

        await asyncWorkQueue.execute();

        progressStateListener(progressTracker.terminate());

        return syncDocsMap;

    }

    /**
     * Merge both origins so that they contains the same documents. Older
     * documents are upgraded to the latest version and missing documents are
     * copied.  At the end both origins will have the union of both sets.
     */
    public static async merge(syncOrigin0: SyncOrigin,
                              syncOrigin1: SyncOrigin,
                              listener: DocMetaSnapshotEventListener = ASYNC_NULL_FUNCTION) {

        await this.transfer(syncOrigin0, syncOrigin1, listener);

        // now transfer the other way...

        await this.transfer(syncOrigin1, syncOrigin0, listener);

    }

    /**
     * Make sure the latest version of the files are in both origins.
     */
    public static async synchronizeOrigins(localSyncOrigin: SyncOrigin,
                                           cloudSyncOrigin: SyncOrigin,
                                           listener: DocMetaSnapshotEventListener = ASYNC_NULL_FUNCTION): Promise<void> {

        log.notice("Transferring from local -> cloud...");
        const localToCloud = await PersistenceLayers.transfer(localSyncOrigin, cloudSyncOrigin, listener, 'local-to-cloud');
        log.notice("Transferring from local -> cloud...done", localToCloud);

        log.notice("Transferring from cloud -> local...");
        const cloudToLocal = await PersistenceLayers.transfer(cloudSyncOrigin, localSyncOrigin, listener, 'cloud-to-local');
        log.notice("Transferring from cloud -> local...done", cloudToLocal);

    }

    /**
     * Synchronize the source with the target so that we know they are both in
     * sync.
     */
    public static async transfer(source: SyncOrigin,
                                 target: SyncOrigin,
                                 listener: DocMetaSnapshotEventListener = ASYNC_NULL_FUNCTION,
                                 id: string = 'none'): Promise<TransferResult> {

        // TODO: no errors are actually raised on the copy operations that are
        // operating in the async queue.  These need to be bubbled up.  This
        // function could just take an error listener and call back that way
        // or we could reject the promise result.

        const result = {
            docMeta: {
                total: 0,
                writes: 0
            },
            files: {
                total: 0,
                writes: 0
            }
        };

        async function handleSyncFile(syncDoc: SyncDoc, fileRef: FileRef) {

            ++result.files.total;

            if (! await target.datastore.containsFile(Backend.STASH, fileRef)) {

                let optionalFile: Optional<DocFileMeta>;

                try {
                    optionalFile = await source.datastore.getFile(Backend.STASH, fileRef);
                } catch (e) {
                    console.error(`Could not get file ${fileRef.name} for doc with fingerprint: ${syncDoc.fingerprint}`, fileRef);
                    throw e;
                }

                if (optionalFile.isPresent()) {

                    // TODO: it would be better if we could make these streams
                    // in the future to avoid reading these files into memory.
                    // Some people might have PDF files that are >100MB.

                    // TODO: I think part of this is that we can't transfer a
                    // stream to the 'remote' worker that's performing the
                    // actual writes to the DiskStore.

                    // TODO: additionally, we're going to need a way to report
                    // progress of this operation between the process
                    // boundaries. We need to have callbacks work so that we
                    // can determine the throughput of some of the larger
                    // attachments.

                    // FIXME: make this a dedicated function to transfer between
                    // do datastores... or at least a dedicated function to
                    // read it in as a buffer

                    const file = optionalFile.get();
                    const buffer = await URLs.toStream(file.url);

                    await target.datastore.writeFile(file.backend, fileRef, buffer, file.meta);

                    ++result.files.writes;

                }

            }

        }

        /**
         * Handle synchronizing the individual docs files from a reference.
         *
         * @param sourceSyncDoc The source sync doc we're trying to ensure is
         *                      in the target datastore and up to date.
         * @param [targetSyncDoc] The targetSyncDoc which may not exist yet in
         *                        target datastore.
         */
        async function handleSyncDoc(sourceSyncDoc: SyncDoc, targetSyncDoc?: SyncDoc) {

            ++result.docMeta.total;

            for (const sourceSyncFile of sourceSyncDoc.files) {

                // TODO: we're going to need some type of method to get all the
                // files backing a DocMeta file when we start to use attachments
                // like screenshots.

                if (sourceSyncFile.ref.name) {
                    // TODO: if we use the second queue it still locks up.
                    // await docFileAsyncWorkQueue.enqueue(async () =>
                    // handleStashFile(docFile));
                    await handleSyncFile(sourceSyncDoc, sourceSyncFile.ref);
                }

            }

            let doWriteDocMeta: boolean = ! targetSyncDoc;

            if (targetSyncDoc) {

                const cmp = UUIDs.compare(targetSyncDoc.uuid, sourceSyncDoc.uuid);

                // TODO: if the comparison is zero then technically we
                // have a conflict which we need to surface to the user but this
                // is insanely rare.

                doWriteDocMeta = cmp < 0;

            }

            if (doWriteDocMeta) {

                const data = await source.datastore.getDocMeta(sourceSyncDoc.fingerprint);
                await target.datastore.write(sourceSyncDoc.fingerprint, data, sourceSyncDoc.docMetaFileRef.docInfo);

                ++result.docMeta.writes;

            }

            const progress = progressTracker.incr();

            const docMetaSnapshotEvent: DocMetaSnapshotEvent = {
                datastore: source.datastore.id,
                progress,

                // this should be committed as we're starting with the source
                // which we think should be at the commmitted level to start
                // with

                consistency: 'committed',

                // TODO: we're not re-emitting the doc mutations at this stage
                // as I think this is the appropriate action since we should
                // already know that they have been present and we're just
                // emitting progress.
                docMetaMutations: [
                ]

            };

            await listener(docMetaSnapshotEvent);

        }

        const docFileAsyncWorkQueue = new AsyncWorkQueue([]);
        const docMetaAsyncWorkQueue = new AsyncWorkQueue([]);

        const sourceSyncDocs = Object.values(source.syncDocMap);

        const progressID
            = `transfer:source=${source.datastore.id},target=${target.datastore.id}`;

        const progressTracker = new ProgressTracker(sourceSyncDocs.length, progressID);

        for (const sourceSyncDoc of sourceSyncDocs) {

            const targetSyncDoc = target.syncDocMap[sourceSyncDoc.fingerprint];

            const handler = async () => {

                try {
                    await handleSyncDoc(sourceSyncDoc, targetSyncDoc);
                } catch (e) {
                    log.error("Unable to sync between source and target: ", {sourceSyncDoc, targetSyncDoc});
                }

            };

            docMetaAsyncWorkQueue.enqueue(handler);


        }

        // build a work queue of async functions out of the docMetaFiles.

        const docFileExecutionPromise = docFileAsyncWorkQueue.execute();
        const docMetaExecutionPromise = docMetaAsyncWorkQueue.execute();

        await Promise.all([docFileExecutionPromise, docMetaExecutionPromise]);

        await listener({
            datastore: source.datastore.id,
            progress: progressTracker.terminate(),
            consistency: 'committed',
            docMetaMutations: []
        });

        return result;

    }

}

export interface TransferResult {

    docMeta: TransferMetrics;

    files: TransferMetrics;

}

export interface TransferMetrics {
    total: number;
    writes: number;
}


export interface SyncOrigin {

    readonly datastore: Datastore;
    readonly syncDocMap: SyncDocMap;

}

