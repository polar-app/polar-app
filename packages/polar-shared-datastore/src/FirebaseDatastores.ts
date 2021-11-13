import {IDStr, UserIDStr} from "polar-shared/src/util/Strings";
import {RecordHolder} from "polar-shared/src/metadata/RecordHolder";
import {DocMetaHolder} from "polar-shared/src/metadata/DocMetaHolder";
import {isPresent} from 'polar-shared/src/Preconditions';
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {DatastoreMutation} from "polar-shared/src/datastore/DatastoreMutation";
import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";
import {Visibility} from "polar-shared/src/datastore/Visibility";
import {FileHandle, FileHandles} from "polar-shared/src/util/Files";
import {
    DeterminateProgress,
    IndeterminateProgress,
    Percentage,
    ProgressTracker
} from "polar-shared/src/util/ProgressTracker";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {RecordPermission} from "polar-shared/src/metadata/RecordPermission";
import {IDocumentReference, IDocumentReferenceClient} from "polar-firestore-like/src/IDocumentReference";
import {ErrorType} from "polar-shared/src/util/Errors";
// import {DocPermissionCollection} from "polar-bookshelf/web/js/datastore/sharing/db/DocPermissionCollection";
import {Backend} from "polar-shared/src/datastore/Backend";
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {Optional} from "polar-shared/src/util/ts/Optional";
import {DownloadURLs} from "./DownloadURLs";
import {DocFileMeta} from "polar-shared/src/datastore/DocFileMeta";
import {GetFileOpts} from "polar-shared/src/datastore/IDatastore";
import {ProgressMessage} from "polar-bookshelf/web/js/ui/progress_bar/ProgressMessage";
import {ProgressMessages} from "polar-bookshelf/web/js/ui/progress_bar/ProgressMessages";
import {Percentages} from "polar-shared/src/util/Percentages";

export interface StoragePath {
    readonly path: string;
    readonly settings?: StorageSettings;
}

export interface StorageSettings {
    readonly cacheControl: string;
    readonly contentType: string;
}

/**
 * A specific type of document ID derived from the fingerprint and only
 * available within Firebase.
 */
export type FirebaseDocMetaID = string;

export namespace FirebaseDatastores {

    export function computeStoragePath(backend: Backend,
                                       fileRef: FileRef,
                                       uid: UserIDStr): StoragePath {

        const ext = FilePaths.toExtension(fileRef.name);

        const suffix = ext.map(value => {

            if (!value.startsWith('.')) {
                // if the suffix doesn't begin with a '.' then add it.
                value = '.' + value;
            }

            return value;

        })
            .getOrElse('');

        const settings = computeStorageSettings(ext).getOrUndefined();

        let key: any;

        if (fileRef.hashcode) {

            key = {

                // We include the uid of the user to avoid the issue of user
                // conflicting on files and the ability to share them per file.
                // The cloud storage costs for raw binary files are
                // inconsequential so have one file per user.

                uid,
                backend,
                alg: fileRef.hashcode.alg,
                enc: fileRef.hashcode.enc,
                data: fileRef.hashcode.data,
                suffix

            };

        } else {

            // Build a unique name from the filename and the UUID of the user.
            // this shouldn't actually be used except in the cases of VERY old
            // datastores.
            //
            key = {
                uid,
                filename: fileRef.name
            };

        }

        const id = Hashcodes.createID(key, 40);

        const path = `${backend}/${id}${suffix}`;

        return {path, settings};

    }

    function computeStorageSettings(optionalExt: Optional<string>): Optional<StorageSettings> {

        const PUBLIC_MAX_AGE_1WEEK = 'public,max-age=604800';

        const ext = optionalExt.getOrElse('').toLowerCase();

        if (ext === 'jpg' || ext === 'jpeg') {

            return Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'image/jpeg'
            });

        }

        if (ext === 'pdf') {

            return Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'application/pdf'
            });

        }

        if (ext === 'png') {

            return Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'image/png'
            });

        }

        if (ext === 'svg') {

            return Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'image/svg'
            });

        }

        // the fall through of cached data should work for PHZ files and other
        // types of binary data.

        return Optional.of({
            cacheControl: PUBLIC_MAX_AGE_1WEEK,
            contentType: 'application/octet-stream'
        });

    }


    // You can allow users to sign in to your app using multiple authentication
    // providers by linking auth provider credentials to an existing user account.
    // Users are identifiable by the same Firebase user ID regardless of the
    // authentication provider they used to sign in. For example, a user who signed
    // in with a password can link a Google account and sign in with either method
    // in the future. Or, an anonymous user can link a Facebook account and then,
    // later, sign in with Facebook to continue using your app.

    export function computeDocMetaID(fingerprint: string,
                                     uid: UserIDStr): FirebaseDocMetaID {

        return Hashcodes.createID(uid + ':' + fingerprint, 32);

    }


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

    /**
     * Callback for when we have a write controller.
     */
    export type OnWriteController = (controller: WriteController) => void;

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
    // eslint-disable-next-line functional/prefer-readonly-type
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

                // const docPermission = await DocPermissionCollection.get(firestore, id);
                //
                // if (docPermission) {
                //     return {
                //         visibility: docPermission.visibility,
                //     };
                // }

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

            batch.set(docMetaRef, createRecordHolderForDocMeta(uid, docInfo, data, recordPermission));
            batch.set(docInfoRef, createRecordHolderForDocInfo(uid, docInfo, recordPermission));

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

        // eslint-disable-next-line functional/prefer-readonly-type
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

        // FIXME this called writeFile in Datastore but since it was extended it
        // was actually calling the one in FirebaseDatastore

        if (! opts) {
            return;
        }

        if (opts.writeFile) {
            const writeFileOpts: WriteFileOpts = {progressListener: opts.progressListener, onController: opts.onController};
            await writeFile(opts.writeFile.backend, opts.writeFile, opts.writeFile.data, writeFileOpts);
        }

    }


    export async function writeFile(uid: UserIDStr,
                                    backend: Backend,
                                    ref: FileRef,
                                    data: BinaryFileData,
                                    opts: WriteFileOpts = new DefaultWriteFileOpts()): Promise<DocFileMeta> {

        // TODO: the latch handling, file writing, and progress notification
        // should all be decoupled into their own functions.

        console.debug(`writeFile: ${backend}: `, ref);

        const storagePath = FirebaseDatastores.computeStoragePath(backend, ref, uid);
        const pendingFileWriteKey = storagePath.path;

        try {

            const visibility = opts.visibility || Visibility.PRIVATE;

            const storage = this.storage!;

            const fileRef = storage.ref().child(storagePath.path);

            if (!isPresent(data)) {

                if (opts.updateMeta) {

                    const meta: FileMeta = { visibility };

                    // https://firebase.google.com/docs/storage/web/file-metadata
                    //
                    // Only the properties specified in the metadata are updated,
                    // all others are left unmodified.

                    await fileRef.updateMetadata(meta);

                    console.info("File metadata updated with: ", meta);

                    return this.getFile(backend, ref);

                } else {
                    // when the caller specifies null they mean that there's a
                    // metadata update which needs to be applied.
                    throw new Error("No data present");
                }

            }

            if (await this.containsFile(backend, ref)) {
                // the file is already in the datastore so don't attempt to
                // overwrite it for now.  The files are immutable and we don't
                // accept overwrites.
                return this.getFile(backend, ref);
            }

            let uploadTask: firebase.storage.UploadTask;

            const uid = this.uid;

            // stick the uid into the metadata which we use for authorization of the
            // blob when not public.
            const meta = { uid, visibility };

            const metadata: firebase.storage.UploadMetadata = { customMetadata: meta };

            if (storagePath.settings) {
                metadata.contentType = storagePath.settings.contentType;
                metadata.cacheControl = storagePath.settings.cacheControl;
            }

            if (typeof data === 'string') {
                uploadTask = fileRef.putString(data, 'raw', metadata);
            } else if (data instanceof Blob) {
                uploadTask = fileRef.put(data, metadata);
            } else {

                if (FileHandles.isFileHandle(data)) {

                    // This only happens in the desktop app so we can read file URLs
                    // to blobs and otherwise it converts URLs to files.
                    const fileHandle = <FileHandle> data;

                    const fileURL = FilePaths.toURL(fileHandle.path);
                    const blob = await URLs.toBlob(fileURL);
                    uploadTask = fileRef.put(blob, metadata);

                } else {
                    uploadTask = fileRef.put(Uint8Array.from(<Buffer> data), metadata);
                }

            }

            // TODO: we can get progress from the uploadTask here.

            const started = Date.now();

            const task = ProgressTracker.createNonce();

            // TODO: create an index of pending progress messages and show the
            // OLDEST on in the progress bar.. but add like a 5 minute timeout in
            // case it's not updated.   Each progress message MUST have a 'created'
            // timestamp from now on so we can GC them and or ignore them if they're
            // never used again

            const progressID = 'firebase-upload-' + STORAGE_UPLOAD_ID++;

            const controller: WriteController = {
                pause: () => uploadTask.pause(),
                resume: () => uploadTask.resume(),
                cancel: () => uploadTask.cancel()
            };

            if (opts.onController) {
                opts.onController(controller);
            }

            uploadTask.on('state_changed', (snapshotData: any) => {

                const snapshot: firebase.storage.UploadTaskSnapshot = snapshotData;

                const now = Date.now();
                const duration = now - started;

                const percentage = Percentages.calculate(snapshot.bytesTransferred, snapshot.totalBytes);
                console.log('Upload is ' + percentage + '% done');

                const progress: ProgressMessage = {
                    id: progressID,
                    task,
                    completed: snapshot.bytesTransferred,
                    total: snapshot.totalBytes,
                    duration,
                    progress: <Percentage> percentage,
                    timestamp: Date.now(),
                    name: `${backend}/${ref.name}`
                };

                ProgressMessages.broadcast(progress);

                if (opts.progressListener) {

                    // if the write operation has a progress listener then increment
                    // the listener properly.

                    const writeFileProgress: WriteFileProgress = {
                        ref: {backend, ...ref},
                        ...progress,
                        value: progress.progress,
                        type: 'determinate'
                    }

                    opts.progressListener(writeFileProgress);

                }

                switch (snapshot.state) {

                    case firebase.storage.TaskState.PAUSED:
                        // or 'paused'
                        // console.log('Upload is paused');
                        break;

                    case firebase.storage.TaskState.RUNNING:
                        // or 'running'
                        // console.log('Upload is running');
                        break;
                }

            });

            const uploadTaskSnapshot = await uploadTask;


            // TODO: we can use bytesTransferred to keep track of accounting
            const {downloadURL, bytesTransferred} = uploadTaskSnapshot;

            const result: DocFileMeta = {
                backend,
                ref,
                url: downloadURL!
            };

            latch.resolve(result);

            // now we have to clean up after our latch.
            delete this.pendingFileWrites[pendingFileWriteKey];

            return result;

        } catch (e) {
            throw e;
        }

    }

    export function getFile(uid: UserIDStr,
                            backend: Backend,
                            ref: FileRef,
                            opts: GetFileOpts = {}): DocFileMeta {


        console.debug("getFile");

        const storagePath = FirebaseDatastores.computeStoragePath(backend, ref, uid);

        const downloadURL =
            DownloadURLs.computeDownloadURL(backend, ref, storagePath, opts);

        return { backend, ref, url: downloadURL};

    }

    export async function containsFile(uid: UserIDStr,
                                       backend: Backend,
                                       ref: FileRef): Promise<boolean> {

        const storagePath = computeStoragePath(backend, ref, uid);

        const downloadURL =
            DownloadURLs.computeDownloadURL(backend, ref, storagePath, {});

        return DownloadURLs.checkExistence(downloadURL);

    }

    /**
     * Create the document that we will store in for the DocMeta
     */
    function createRecordHolderForDocMeta(uid: UserIDStr,
                                          docInfo: IDocInfo,
                                          docMeta: string,
                                          opts: WriteOpts = new DefaultWriteOpts()) {

        const visibility = opts.visibility || Visibility.PRIVATE;

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

    function createRecordHolderForDocInfo(uid: UserIDStr,
                                          docInfo: IDocInfo,
                                          opts: WriteOpts = new DefaultWriteOpts()) {

        const visibility = opts.visibility || Visibility.PRIVATE;

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
