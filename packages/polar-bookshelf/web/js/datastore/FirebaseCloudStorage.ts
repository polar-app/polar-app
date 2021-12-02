import React from "react";
import {DocFileMeta} from "polar-shared/src/datastore/DocFileMeta";
import {FileHandles} from 'polar-shared/src/util/Files';
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {Visibility} from "polar-shared/src/datastore/Visibility";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {URLs} from "polar-shared/src/util/URLs";
import {GetFileOpts} from "polar-shared/src/datastore/IDatastore";
import {Percentages} from "polar-shared/src/util/Percentages";
import {ProgressMessage} from "../ui/progress_bar/ProgressMessage";
import firebase from "firebase/app"
import "firebase/storage";
import {Backend} from "polar-shared/src/datastore/Backend";
import {Percentage, ProgressTracker} from "polar-shared/src/util/ProgressTracker";
import {useUserInfoContext} from "../apps/repository/auth_handler/UserInfoProvider";
import {FirebaseDatastores} from "polar-shared-datastore/src/FirebaseDatastores";
import {DownloadURLs} from "polar-shared-datastore/src/DownloadURLs";
import WriteFileProgress = FirebaseDatastores.WriteFileProgress;
import BinaryFileData = FirebaseDatastores.BinaryFileData;
import WriteController = FirebaseDatastores.WriteController;
import WriteFileOpts = FirebaseDatastores.WriteFileOpts;
import DefaultWriteFileOpts = FirebaseDatastores.DefaultWriteFileOpts;

type ProgressTrackerManagerListener<T> = (data: T) => void;

export class ProgressTrackerManager<T = Percentage> {
    public readonly progressListener: ProgressTrackerManagerListener<T>;

    // eslint-disable-next-line functional/prefer-readonly-type
    private progressCallbacks: ProgressTrackerManagerListener<T>[] = [];

    constructor() {
        this.progressListener = (progress) =>
            this.progressCallbacks.forEach(cb => cb(progress));
    }

    addListener(cb: ProgressTrackerManagerListener<T>) {
        this.progressCallbacks.push(cb);
    }

    removeListener(cb: ProgressTrackerManagerListener<T>) {
        this.progressCallbacks = this.progressCallbacks.filter(callback => callback !== cb);
    }
}


export class CloudStorage {
    // eslint-disable-next-line functional/prefer-readonly-type
    private readonly pendingWrites: Map<string, Promise<DocFileMeta>> = new Map();
    private readonly uid: string;
    private readonly storage: firebase.storage.Storage = firebase.storage();

    constructor(uid: string) {
        this.uid = uid;
    }

    async containsFile(backend: Backend, ref: FileRef): Promise<boolean> {

        const storagePath = FirebaseDatastores.computeStoragePath(backend, ref, this.uid);

        const storage = this.storage;
        const storageRef = storage.ref().child(storagePath.path);

        const downloadURL =
            DownloadURLs.computeDownloadURL(backend, ref, storagePath, {});

        return DownloadURLs.checkExistence(downloadURL);

    }

    getFile(backend: Backend,
            ref: FileRef,
            opts: GetFileOpts = {}): DocFileMeta {

        const storage = this.storage;

        const storagePath = FirebaseDatastores.computeStoragePath(backend, ref, this.uid);

        const storageRef = storage.ref().child(storagePath.path);

        const downloadURL =
            DownloadURLs.computeDownloadURL(backend, ref, storagePath, opts);

        return { backend, ref, url: downloadURL };

    }

    async writeFile(backend: Backend,
                    ref: FileRef,
                    data?: BinaryFileData,
                    opts: WriteFileOpts = new DefaultWriteFileOpts()): Promise<DocFileMeta> {

        const storagePath = FirebaseDatastores.computeStoragePath(backend, ref, this.uid);
        const pendingWriteKey = storagePath.path;

        const latch = this.pendingWrites.get(pendingWriteKey);

        if (latch) {
            return latch;
        }

        try {

            const visibility = opts.visibility || Visibility.PRIVATE;

            const storage = this.storage;

            const fileRef = storage.ref().child(storagePath.path);

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
                    const fileHandle = data;

                    const fileURL = FilePaths.toURL(fileHandle.path);
                    const blob = await URLs.toBlob(fileURL);
                    uploadTask = fileRef.put(blob, metadata);

                } else {
                    uploadTask = fileRef.put(Uint8Array.from(data as Buffer), metadata);
                }

            }

            const controller: WriteController = {
                pause: () => uploadTask.pause(),
                resume: () => uploadTask.resume(),
                cancel: () => uploadTask.cancel()
            };

            if (opts.onController) {
                opts.onController(controller);
            }

            const started = Date.now();

            const task = ProgressTracker.createNonce();

            return new Promise((resolve, reject) => {
                const stateHandler = (snapshot: firebase.storage.UploadTaskSnapshot) => {
                    const now = Date.now();
                    const duration = now - started;

                    const percentage = Percentages.calculate(snapshot.bytesTransferred, snapshot.totalBytes);

                    const progress: ProgressMessage = {
                        id: pendingWriteKey,
                        task,
                        completed: snapshot.bytesTransferred,
                        total: snapshot.totalBytes,
                        duration,
                        progress: percentage as Percentage,
                        timestamp: Date.now(),
                        name: `${backend}/${ref.name}`
                    };

                    if (opts.progressListener) {

                        // if the write operation has a progress listener then increment
                        // the listener properly.

                        const writeFileProgress: WriteFileProgress = {
                            ref: {backend, ...ref},
                            ...progress,
                            value: progress.progress,
                            type: 'determinate'
                        };

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

                };

                const errorHandler = (error: firebase.storage.FirebaseStorageError) => {
                    reject(error);
                    this.pendingWrites.delete(pendingWriteKey);
                };

                const completeHandler = () => {
                    this.pendingWrites.delete(pendingWriteKey);
                    uploadTask.snapshot.ref.getDownloadURL()
                        .then((url) => resolve({url, ref, backend}))
                        .catch(reject);
                };

                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, stateHandler, errorHandler, completeHandler);
            });

        } catch (e) {
            this.pendingWrites.delete(pendingWriteKey);
            throw e;
        }

    }
}

export const useFirebaseCloudStorage = () => {
    const userInfo = useUserInfoContext();
    const uid = userInfo?.userInfo?.uid;

    if (! uid) {
        throw new Error('useFirebaseCloudStorage only works for logged in users.');
    }

    const cloudStorage = React.useMemo(() => new CloudStorage(uid), [uid]);

    return cloudStorage;
};
