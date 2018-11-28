import {PersistenceLayer} from "./PersistenceLayer";
import {NULL_FUNCTION} from "../util/Functions";
import {Percentages} from '../util/Percentages';
import {Backend} from './Backend';
import {Blobs} from "../util/Blobs";
import {ArrayBuffers} from "../util/ArrayBuffers";
import {AsyncFunction, AsyncWorkQueue} from '../util/AsyncWorkQueue';
import {DocMetaFileRefs, DocMetaRef} from "./DocMetaRef";
import {Datastore, DocMetaMutation, DocMetaSnapshotEvent, DocMetaSnapshotEventListener, FileRef, MutationType, SyncDoc, SyncDocMap} from './Datastore';
import {UUIDs} from '../metadata/UUIDs';
import {ProgressTracker, ProgressState} from '../util/ProgressTracker';
import {DocMetas} from '../metadata/DocMetas';
import {DefaultPersistenceLayer} from './DefaultPersistenceLayer';
import {Provider, AsyncProviders} from '../util/Providers';
import {DocMeta} from '../metadata/DocMeta';
import {IDocInfo} from '../metadata/DocInfo';
import {Dictionaries} from '../util/Dictionaries';
import {isPresent} from "../Preconditions";

export class PersistenceLayers {

    public static toPersistenceLayer(input: Datastore ): PersistenceLayer {
        return new DefaultPersistenceLayer(input);
    }

    /**
     * Synchronize the source with the target so that we know they are both in
     * sync.
     */
    public static async synchronize(source: PersistenceLayer,
                                    target: PersistenceLayer,
                                    listener: DocMetaSnapshotEventListener = NULL_FUNCTION): Promise<TransferResult> {

        // FIXME: this should be a synchronization event listener...

        const result: TransferResult = {
            mutations: {
                fingerprints: [],
                files: []
            },
            conflicts: {
                fingerprints: [],
                files: []
            }
        };

        async function handleStashFile(fileRef: FileRef) {

            if (! target.containsFile(Backend.STASH, fileRef)) {

                const optionalFile = await source.getFile(Backend.STASH, fileRef);

                if (optionalFile.isPresent()) {
                    const file = optionalFile.get();
                    const response = await fetch(file.url);
                    const blob = await response.blob();
                    const arrayBuffer = await Blobs.toArrayBuffer(blob);
                    const buffer = ArrayBuffers.toBuffer(arrayBuffer);

                    await target.writeFile(file.backend, fileRef, buffer, file.meta);

                    result.mutations.files.push(fileRef);
                }

            }

        }

        async function handleDocMetaFile(docMetaFile: DocMetaRef) {

            // console.log("Working with fingerprint: " +
            // docMetaFile.fingerprint);

            const docMeta = await source.getDocMeta(docMetaFile.fingerprint);

            if (! docMeta) {
                return;
            }

            const docFile: FileRef = {
                name: docMeta.docInfo.filename!,
                hashcode: docMeta.docInfo.hashcode
            };

            // TODO: we're going to need some type of method to get all the
            // files backing a DocMeta file when we start to use attachments
            // like screenshots.

            if (docFile.name) {
                // TODO: if we use the second queue it still locks up.
                // await docFileAsyncWorkQueue.enqueue(async () =>
                // handleStashFile(docFile));
                await handleStashFile(docFile);
            }

            const targetContainsDocMeta: boolean = await target.contains(docMetaFile.fingerprint);

            let doWriteDocMeta: boolean = ! targetContainsDocMeta;

            if (targetContainsDocMeta) {

                const targetDocMeta = await target.getDocMeta(docMetaFile.fingerprint);

                if (targetDocMeta) {

                    // FIXME: if the comparison is zero then technically we
                    // have a conflict which we need to surface to the user.
                    doWriteDocMeta = UUIDs.isUpdated(targetDocMeta.docInfo.uuid, docMeta.docInfo.uuid);

                }

            }

            if (doWriteDocMeta) {
                result.mutations.fingerprints.push(docMetaFile.fingerprint);
                await target.writeDocMeta(docMeta);
            }

            const progress = progressTracker.incr();

            const docMetaSnapshotEvent: DocMetaSnapshotEvent = {
                datastore: source.datastore.id,
                progress,

                // this should be committed as we're starting with the source
                // which we think should be at the commmitted level to start
                // with

                consistency: 'committed',
                docMetaMutations: [
                    {
                        fingerprint: docMeta.docInfo.fingerprint,
                        docMetaProvider: AsyncProviders.of(docMeta),
                        docInfoProvider: AsyncProviders.of(docMeta.docInfo),
                        docMetaFileRefProvider: AsyncProviders.of(DocMetaFileRefs.createFromDocInfo(docMeta.docInfo)),
                        mutationType: 'created'
                    }
                ]
            };

            listener(docMetaSnapshotEvent);

        }

        const docMetaFiles = await source.getDocMetaFiles();

        const progressTracker = new ProgressTracker(docMetaFiles.length);

        const docFileAsyncWorkQueue = new AsyncWorkQueue([]);
        const docMetaAsyncWorkQueue = new AsyncWorkQueue([]);

        // build a work queue of async functions out of the docMetaFiles.
        docMetaFiles.forEach(docMetaFile =>
                                 docMetaAsyncWorkQueue.enqueue( async () => handleDocMetaFile(docMetaFile)));

        const docFileExecutionPromise = docFileAsyncWorkQueue.execute();
        const docMetaExecutionPromise = docMetaAsyncWorkQueue.execute();

        await Promise.all([docFileExecutionPromise, docMetaExecutionPromise]);

        return result;

    }

    /**
     * Synchronize the source with the target so that we know they are both in
     * sync.
     */
    public static async synchronizeFromSyncDocs(source: SyncOrigin,
                                                target: SyncOrigin,
                                                listener: DocMetaSnapshotEventListener = NULL_FUNCTION): Promise<TransferResult> {

        const result: TransferResult = {
            mutations: {
                fingerprints: [],
                files: []
            },
            conflicts: {
                fingerprints: [],
                files: []
            }
        };

        async function handleSyncFile(fileRef: FileRef) {

            if (! target.persistenceLayer.containsFile(Backend.STASH, fileRef)) {

                const optionalFile = await source.persistenceLayer.getFile(Backend.STASH, fileRef);

                if (optionalFile.isPresent()) {
                    const file = optionalFile.get();
                    const response = await fetch(file.url);
                    const blob = await response.blob();
                    const arrayBuffer = await Blobs.toArrayBuffer(blob);
                    const buffer = ArrayBuffers.toBuffer(arrayBuffer);

                    await target.persistenceLayer.writeFile(file.backend, fileRef, buffer, file.meta);

                    result.mutations.files.push(fileRef);
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

            for (const sourceSyncFile of sourceSyncDoc.files) {

                // TODO: we're going to need some type of method to get all the
                // files backing a DocMeta file when we start to use attachments
                // like screenshots.

                if (sourceSyncFile.ref.name) {
                    // TODO: if we use the second queue it still locks up.
                    // await docFileAsyncWorkQueue.enqueue(async () =>
                    // handleStashFile(docFile));
                    await handleSyncFile(sourceSyncFile.ref);
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

                result.mutations.fingerprints.push(sourceSyncDoc.fingerprint);

                const docMeta = await source.persistenceLayer.getDocMeta(sourceSyncDoc.fingerprint);
                await target.persistenceLayer.writeDocMeta(docMeta!);

            }

            const progress = progressTracker.incr();

            const docMetaSnapshotEvent: DocMetaSnapshotEvent = {
                datastore: source.persistenceLayer.datastore.id,
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

            listener(docMetaSnapshotEvent);

        }

        const progressTracker = new ProgressTracker(Dictionaries.size(source.syncDocMap));

        const docFileAsyncWorkQueue = new AsyncWorkQueue([]);
        const docMetaAsyncWorkQueue = new AsyncWorkQueue([]);

        for (const sourceSyncDoc of Object.values(source.syncDocMap)) {

            const targetSyncDoc = target.syncDocMap[sourceSyncDoc.fingerprint];

            const handler = async () => handleSyncDoc(sourceSyncDoc, targetSyncDoc);

            docMetaAsyncWorkQueue.enqueue(handler);

        }

        // build a work queue of async functions out of the docMetaFiles.

        const docFileExecutionPromise = docFileAsyncWorkQueue.execute();
        const docMetaExecutionPromise = docMetaAsyncWorkQueue.execute();

        await Promise.all([docFileExecutionPromise, docMetaExecutionPromise]);

        return result;

    }

}

export interface TransferResult {

    readonly mutations: TransferRefs;

    readonly conflicts: TransferRefs;

}

export interface TransferRefs {

    readonly fingerprints: string[];

    readonly files: FileRef[];

}

export interface SyncOrigin {

    readonly persistenceLayer: PersistenceLayer;
    readonly syncDocMap: SyncDocMap;

}
