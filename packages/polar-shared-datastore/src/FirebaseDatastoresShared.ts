import {IDStr, UserIDStr} from "polar-shared/src/util/Strings";
import {RecordHolder} from "polar-shared/src/metadata/RecordHolder";
import {DocMetaHolder} from "polar-shared/src/metadata/DocMetaHolder";
import {isPresent} from 'polar-shared/src/Preconditions';
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {DatastoreMutation} from "polar-shared/src/datastore/DatastoreMutation";
import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";
import {Visibility} from "polar-shared/src/datastore/Visibility";
import {FileHandle} from "polar-shared/src/util/Files";
import {DeterminateProgress, IndeterminateProgress} from "polar-shared/src/util/ProgressTracker";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {RecordPermission} from "polar-shared/src/metadata/RecordPermission";
import {FirebaseDatastores} from "polar-shared/src/datastore/FirebaseDatastores";
import {IDocumentReference, IDocumentReferenceClient} from "polar-firestore-like/src/IDocumentReference";
import {ErrorType} from "polar-shared/src/util/Errors";
import {DocPermissionCollection} from "polar-bookshelf/web/js/datastore/sharing/db/DocPermissionCollection";

/**
 * Provides for a generic writer that can commit records to Firebase (frontend or backend)
 */
export namespace FirebaseDatastoresShared {

    export interface WriteFileProgressDeterminate extends DeterminateProgress, BaseWriteFileProgress {
    }
    export interface WriteFileProgressIndeterminate extends IndeterminateProgress, BaseWriteFileProgress {
    }

    export interface BaseWriteFileProgress {
        readonly ref: BackendFileRef;
    }

    export interface WriteController {

        /**
         * Pauses a running task. Has no effect on a paused or failed task.
         * @return True if the pause had an effect.
         */
        readonly pause: () => boolean;

        /**
         * Resume a running task. Has no effect on a paused or failed task.
         * @return True if the pause had an effect.
         */
        readonly resume: () => boolean;

        /**
         * Cancels a running task. Has no effect on a complete or failed task.
         * @return True if the cancel had an effect.
         */
        readonly cancel: () => boolean;

    }

    export type WriteFileProgress = WriteFileProgressDeterminate | WriteFileProgressIndeterminate;

    export type BinaryFileData = FileHandle | Buffer | string | Blob | NodeJS.ReadableStream;

    export type WriteFileProgressListener = (progress: WriteFileProgress) => void;

    export interface BackendFileRefData extends BackendFileRef {
        readonly data: BinaryFileData;
    }

    /**
     * The consistency of the underlying data, whether it's written or committed.
     *
     * 'written' means that it was written to a WAL or a local cache but may not
     * be fully committed to a cloud store, to all replicas of a database, etc.
     *
     * 'committed' means that it's fully committed and consistent with the current
     * state of a database system.  A read that is 'committed' means it is fully
     * up to date.
     */
    export type DatastoreConsistency = 'written' | 'committed';

    export enum DatastoreCollection {

        DOC_INFO = "doc_info",

        DOC_META = "doc_meta",

    }

    export type FirestoreSource = 'default' | 'server' | 'cache';

    export interface GetDocMetaOpts {

        readonly preferredSource?: FirestoreSource;

    }

    /**
     * Return true if the DiskDatastore contains a document for the given
     * fingerprint
     */
    export async function contains(firestore: IFirestore<unknown>, fingerprint: string): Promise<boolean> {

        // TODO: this isn't particularly efficient now but I don't think we're
        // actually using contains() for anything and we might want to remove
        // it since it's not very efficient if we just call getDocMeta anyway.
        const docMeta = await getDocMeta(firestore, fingerprint);

        return docMeta !== null;

    }


    /**
     * Get the DocMeta if from the raw docID encoded into the users account.
     */
    export async function getDocMeta(firestore: IFirestore<unknown>,
                                     id: IDStr,
                                     opts: GetDocMetaOpts = {}): Promise<string | null> {

        const ref = firestore
            .collection(DatastoreCollection.DOC_META)
            .doc(id);

        const createSnapshot = async () => {

            // TODO: lift this out into its own method.

            const preferredSource = opts.preferredSource;

            if (preferredSource === 'cache') {

                // Firebase supports three cache strategies.  The first
                // (default) is server with fall back to cache but what we
                // need is the reverse.  We need cache but server refresh to
                // pull the up-to-date copy.
                //
                // What we now do is we get two promises, then return the
                // first that works or throw an error if both fail.
                //
                // In this situation we ALWAYs go to the server though
                // because we need to get the up-to-date copy to refresh
                // BUT we can get the initial version FASTER since we
                // can resolve it from cache.

                console.log("getDocMeta: cache+server");

                // TODO: this will NOT work because 'cache' will throw an
                // exception if it is not in the cache! but this mode isn't used
                // anymore since we're 100% on Firebase now.
                const cachePromise = ref.get({ source: 'cache' });
                const serverPromise = ref.get({ source: 'server' });

                const cacheResult = await cachePromise;

                if (cacheResult.exists) {
                    return cacheResult;
                }

                return await serverPromise;

            } else if (isPresent(opts.preferredSource)) {
                console.log("getDocMeta: " + opts.preferredSource);
                return await ref.get({ source: opts.preferredSource });
            } else {
                // now revert to checking the server, then cache if we're
                // offline.
                console.log("getDocMeta: standard" );
                return await ref.get();
            }

        };

        const snapshot = await createSnapshot();

        const recordHolder = <RecordHolder<DocMetaHolder> | undefined> snapshot.data();

        if (! recordHolder) {
            console.warn("Could not get docMeta with id: " + id);
            return null;
        }

        return recordHolder.value.value;

    }

    export interface WriteOptsBase<T> {

        readonly consistency?: DatastoreConsistency;

        readonly datastoreMutation?: DatastoreMutation<T>;

        /**
         * Also write a file (PDF, PHZ) with the DocMeta data so that it's atomic
         * and that the operations are ordered properly.
         */
        readonly writeFile?: BackendFileRefData;

        readonly visibility?: Visibility;

        readonly groups?: ReadonlyArray<IDStr>;

        /**
         * Specify a progress listener so that when you're writing a file you can
         * keep track of the progress
         */
        readonly progressListener?: WriteFileProgressListener;

        readonly onController?: (controller: WriteController) => void;

    }


    export interface WriteOpts extends WriteOptsBase<boolean> {
    }

    export class DefaultWriteOpts implements WriteOpts {
        public readonly consistency = 'written';
        public readonly visibility = Visibility.PRIVATE;
    }

    // return a tuple of docMetaRef, docInfoRef
    export type WriteResult<SM = unknown> = Readonly<[
        IDocumentReference<SM>,
        IDocumentReference<SM>
    ]>

    export async function write<SM = unknown>(firestore: IFirestore<SM>,
                                              uid: UserIDStr,
                                              fingerprint: string,
                                              data: string,
                                              docInfo: IDocInfo,
                                              opts: WriteOpts = new DefaultWriteOpts()): Promise<WriteResult<SM>> {


        await handleWriteFile(opts);

        const id = FirebaseDatastores.computeDocMetaID(fingerprint, uid);

        /**
         * Create our two main doc refs.
         */
        const createDocRefs = () => {

            const docMetaRef = firestore
                .collection(DatastoreCollection.DOC_META)
                .doc(id);

            const docInfoRef = firestore
                .collection(DatastoreCollection.DOC_INFO)
                .doc(id);

            return [docMetaRef, docInfoRef];

        }

        try {

            docInfo = Object.assign({}, Dictionaries.onlyDefinedProperties(docInfo));

            const createRecordPermission = async (): Promise<RecordPermission> => {

                const docPermission = await DocPermissionCollection.get(firestore, id);

                if (docPermission) {
                    return {
                        visibility: docPermission.visibility,
                    };
                }

                return {
                    visibility: docInfo.visibility || Visibility.PRIVATE
                };

            };

            const recordPermission
                = Dictionaries.onlyDefinedProperties(await createRecordPermission());

            const batch = firestore.batch();

            const dataLen = data.length;

            console.log(`Write of doc with id ${id}, and data length ${dataLen} and permission: `, recordPermission);

            const [docMetaRef, docInfoRef] = createDocRefs();

            batch.set(docMetaRef, createRecordHolderForDocMeta(docInfo, data, recordPermission));
            batch.set(docInfoRef, createRecordHolderForDocInfo(docInfo, recordPermission));

            await batch.commit();

            return [docMetaRef, docInfoRef]

        } finally {
            // noop for now
        }

    }

    /**
     * Arbitrary settings for files specific to each storage layer.  Firebase uses
     * visibility and uid.
     */
    export interface FileMeta {

        // TODO: I should also include the StorageSettings from Firebase here to
        // give it a set of standardized fields like contentType as screenshots
        // needs to be added with a file type.
        [key: string]: string;

    }

    export interface WriteFileOpts {

        /**
         * @deprecated we no longer support arbitrary file metadata.
         */
        readonly meta?: FileMeta;

        /**
         * Set the file visibility.  Default is private.
         */
        readonly visibility?: Visibility;

        /**
         * Only update metadata.  Don't actually write data.
         */
        readonly updateMeta?: boolean;

        readonly datastoreMutation?: DatastoreMutation<boolean>;

        /**
         * Specify a progress listener so that when you're writing a file you can
         * keep track of the progress
         */
        readonly progressListener?: WriteFileProgressListener;

        readonly onController?: (controller: WriteController) => void;

    }

    export class DefaultWriteFileOpts implements WriteFileOpts {
        public readonly meta: FileMeta = {};
        public readonly visibility = Visibility.PRIVATE;
    }

    /**
     * Handle the file write if specify as a dependency within write()
     */
    export async function handleWriteFile(opts?: WriteOpts) {

        if (! opts) {
            return;
        }

        if (opts.writeFile) {
            const writeFileOpts: WriteFileOpts = {progressListener: opts.progressListener, onController: opts.onController};
            await this.writeFile(opts.writeFile.backend, opts.writeFile, opts.writeFile.data, writeFileOpts);
        }

    }

    /**
     * Create the document that we will store in for the DocMeta
     */
    function createRecordHolderForDocMeta(docInfo: IDocInfo,
                                          docMeta: string,
                                          opts: WriteOpts = new DefaultWriteOpts()) {

        const visibility = opts.visibility || Visibility.PRIVATE;

        const uid = this.uid;

        const id = FirebaseDatastores.computeDocMetaID(docInfo.fingerprint, uid);

        const docMetaHolder: DocMetaHolder = {
            docInfo,
            value: docMeta
        };

        const recordHolder: RecordHolder<DocMetaHolder> = {
            uid,
            id,
            visibility,
            groups: opts.groups || null,
            value: docMetaHolder
        };

        return recordHolder;

    }

    function createRecordHolderForDocInfo(docInfo: IDocInfo,
                                          opts: WriteOpts = new DefaultWriteOpts()) {

        const visibility = opts.visibility || Visibility.PRIVATE;

        const uid = this.uid;
        const id = FirebaseDatastores.computeDocMetaID(docInfo.fingerprint, uid);

        const recordHolder: RecordHolder<IDocInfo> = {
            uid,
            id,
            visibility,
            groups: opts.groups || null,
            value: docInfo
        };

        return recordHolder;

    }


    /**
     * Wait for the record to be fully committed to the remote datastore - not
     * just written to the local cache.
     */
    export function waitForCommit(ref: IDocumentReferenceClient, onError: (err: ErrorType) => void): Promise<void> {

        return new Promise(resolve => {

            const unsubscribeToSnapshot = ref.onSnapshot({includeMetadataChanges: true}, snapshot => {

                if (!snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites) {
                    unsubscribeToSnapshot();
                    resolve();
                }

            }, onError);

        });

    }


}