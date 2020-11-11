"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultWriteOpts = exports.DownloadURLs = exports.DatastoreCollection = exports.FirebaseDatastore = void 0;
const Datastore_1 = require("./Datastore");
const Logger_1 = require("polar-shared/src/logger/Logger");
const DocMetaRef_1 = require("./DocMetaRef");
const Backend_1 = require("polar-shared/src/datastore/Backend");
const Firestore_1 = require("../firebase/Firestore");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const firebase = __importStar(require("firebase/app"));
require("firebase/storage");
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
const DatastoreMutation_1 = require("./DatastoreMutation");
const Functions_1 = require("polar-shared/src/util/Functions");
const DocMetas_1 = require("../metadata/DocMetas");
const Percentages_1 = require("polar-shared/src/util/Percentages");
const ProgressTracker_1 = require("polar-shared/src/util/ProgressTracker");
const Providers_1 = require("polar-shared/src/util/Providers");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const Files_1 = require("polar-shared/src/util/Files");
const Firebase_1 = require("../firebase/Firebase");
const SimpleReactor_1 = require("../reactor/SimpleReactor");
const ProgressMessages_1 = require("../ui/progress_bar/ProgressMessages");
const Stopwatches_1 = require("polar-shared/src/util/Stopwatches");
const URLs_1 = require("polar-shared/src/util/URLs");
const Datastores_1 = require("./Datastores");
const FirebaseDatastores_1 = require("./FirebaseDatastores");
const DocPermissions_1 = require("./sharing/db/DocPermissions");
const Visibility_1 = require("polar-shared/src/datastore/Visibility");
const Latch_1 = require("polar-shared/src/util/Latch");
const FirebaseDatastorePrefs_1 = require("./firebase/FirebaseDatastorePrefs");
const Prefs_1 = require("../util/prefs/Prefs");
const IDatastore_1 = require("polar-shared/src/datastore/IDatastore");
const log = Logger_1.Logger.create();
let STORAGE_UPLOAD_ID = 0;
class FirebaseDatastore extends Datastore_1.AbstractDatastore {
    constructor() {
        super();
        this.id = 'firebase';
        this.initialized = false;
        this.docMetaSnapshotEventDispatcher = new SimpleReactor_1.SimpleReactor();
        this.prefs = new FirebaseDatastorePrefs_1.FirebaseDatastorePrefs();
        this.pendingFileWrites = {};
    }
    init(errorListener = Functions_1.NULL_FUNCTION, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.initialized) {
                return {};
            }
            log.notice("Initializing FirebaseDatastore...");
            this.app = firebase.app();
            this.firestore = yield Firestore_1.Firestore.getInstance();
            this.storage = firebase.storage();
            yield FirebaseDatastores_1.FirebaseDatastores.init();
            yield this.prefs.init();
            if (opts.noInitialSnapshot) {
                log.debug("Skipping initial snapshot");
            }
            else {
                log.debug("Performing initial snapshot");
                const snapshotListener = (event) => __awaiter(this, void 0, void 0, function* () { return this.docMetaSnapshotEventDispatcher.dispatchEvent(event); });
                this.primarySnapshot = yield this.snapshot(snapshotListener, errorListener);
            }
            this.initialized = true;
            log.notice("Initializing FirebaseDatastore...done");
            return {};
        });
    }
    snapshot(docMetaSnapshotEventListener, errorListener = Functions_1.NULL_FUNCTION) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = FirebaseDatastores_1.FirebaseDatastores.getUserID();
            const query = this.firestore
                .collection(DatastoreCollection.DOC_INFO)
                .where('uid', '==', uid);
            const batchIDs = {
                written: 0,
                committed: 0
            };
            const onNextForSnapshot = (snapshot) => {
                try {
                    const consistency = this.toConsistency(snapshot);
                    const batchID = batchIDs[consistency];
                    this.handleDocInfoSnapshot(snapshot, docMetaSnapshotEventListener, batchID);
                    batchIDs[consistency]++;
                }
                catch (e) {
                    log.error("Could not handle snapshot: ", e);
                    errorListener(e);
                }
            };
            const onSnapshotError = (err) => {
                log.error("Could not handle snapshot: ", err);
                errorListener(err);
            };
            try {
                const stopwatch = Stopwatches_1.Stopwatches.create();
                const cachedSnapshot = yield query.get({ source: 'cache' });
                console.log("Initial cached snapshot duration: " + stopwatch.stop());
                onNextForSnapshot(cachedSnapshot);
            }
            catch (e) {
            }
            const unsubscribe = query.onSnapshot({ includeMetadataChanges: true }, onNextForSnapshot, onSnapshotError);
            return {
                unsubscribe
            };
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.primarySnapshot && this.primarySnapshot.unsubscribe) {
                this.primarySnapshot.unsubscribe();
            }
        });
    }
    contains(fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            const docMeta = yield this.getDocMeta(fingerprint);
            return docMeta !== null;
        });
    }
    delete(docMetaFileRef, datastoreMutation = new DatastoreMutation_1.DefaultDatastoreMutation()) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info("delete: ", docMetaFileRef);
            if (docMetaFileRef.docFile && docMetaFileRef.docFile.name) {
                yield this.deleteFile(Backend_1.Backend.STASH, docMetaFileRef.docFile);
            }
            const id = FirebaseDatastores_1.FirebaseDatastores.computeDocMetaID(docMetaFileRef.fingerprint);
            const docInfoRef = this.firestore
                .collection(DatastoreCollection.DOC_INFO)
                .doc(id);
            const docMetaRef = this.firestore
                .collection(DatastoreCollection.DOC_META)
                .doc(id);
            try {
                this.handleDatastoreMutations(docMetaRef, datastoreMutation, 'delete');
                const commitPromise = Promise.all([
                    this.waitForCommit(docMetaRef),
                    this.waitForCommit(docInfoRef)
                ]);
                const batch = this.firestore.batch();
                batch.delete(docInfoRef);
                batch.delete(docMetaRef);
                yield batch.commit();
                yield commitPromise;
                return {};
            }
            finally {
            }
        });
    }
    getDocMeta(fingerprint, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = FirebaseDatastores_1.FirebaseDatastores.computeDocMetaID(fingerprint);
            return yield this.getDocMetaDirectly(id, opts);
        });
    }
    getDocMetaSnapshot(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fingerprint } = opts;
            const id = FirebaseDatastores_1.FirebaseDatastores.computeDocMetaID(fingerprint);
            const ref = this.firestore
                .collection(DatastoreCollection.DOC_META)
                .doc(id);
            let unsubscriber = Functions_1.NULL_FUNCTION;
            const onNext = (snapshot) => {
                var _a;
                const source = snapshot.metadata.fromCache ? 'cache' : 'server';
                const hasPendingWrites = snapshot.metadata.hasPendingWrites;
                console.log(`DocMeta snapshot source=${source}, hasPendingWrites: ${hasPendingWrites}`);
                const recordHolder = snapshot.data();
                opts.onSnapshot({
                    exists: snapshot.exists,
                    data: (_a = recordHolder === null || recordHolder === void 0 ? void 0 : recordHolder.value) === null || _a === void 0 ? void 0 : _a.value,
                    hasPendingWrites,
                    source,
                    unsubscriber
                });
            };
            const onError = (err) => {
                if (opts.onError) {
                    opts.onError({ err, unsubscriber });
                }
            };
            unsubscriber = ref.onSnapshot({ includeMetadataChanges: true }, snapshot => onNext(snapshot), err => onError(err));
            return { unsubscriber };
        });
    }
    getDocMetaDirectly(id, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = this.firestore
                .collection(DatastoreCollection.DOC_META)
                .doc(id);
            const createSnapshot = () => __awaiter(this, void 0, void 0, function* () {
                const preferredSource = opts.preferredSource || this.preferredSource();
                if (preferredSource === 'cache') {
                    console.log("getDocMeta: cache+server");
                    const cachePromise = ref.get({ source: 'cache' });
                    const serverPromise = ref.get({ source: 'server' });
                    const cacheResult = yield cachePromise;
                    if (cacheResult.exists) {
                        return cacheResult;
                    }
                    return yield serverPromise;
                }
                else if (Preconditions_1.isPresent(opts.preferredSource)) {
                    console.log("getDocMeta: " + opts.preferredSource);
                    return yield ref.get({ source: opts.preferredSource });
                }
                else {
                    console.log("getDocMeta: standard");
                    return yield ref.get();
                }
            });
            const snapshot = yield createSnapshot();
            const recordHolder = snapshot.data();
            if (!recordHolder) {
                log.warn("Could not get docMeta with id: " + id);
                return null;
            }
            return recordHolder.value.value;
        });
    }
    writeFile(backend, ref, data, opts = new Datastore_1.DefaultWriteFileOpts()) {
        return __awaiter(this, void 0, void 0, function* () {
            log.debug(`writeFile: ${backend}: `, ref);
            const storagePath = FirebaseDatastores_1.FirebaseDatastores.computeStoragePath(backend, ref);
            const pendingFileWriteKey = storagePath.path;
            let latch = this.pendingFileWrites[pendingFileWriteKey];
            if (latch) {
                log.warn("Write already pending.  Going to return latch.");
                return this.pendingFileWrites[pendingFileWriteKey].get();
            }
            latch = this.pendingFileWrites[pendingFileWriteKey] = new Latch_1.Latch();
            try {
                const visibility = opts.visibility || Visibility_1.Visibility.PRIVATE;
                const storage = this.storage;
                const fileRef = storage.ref().child(storagePath.path);
                if (!Preconditions_1.isPresent(data)) {
                    if (opts.updateMeta) {
                        const meta = { visibility };
                        yield fileRef.updateMetadata(meta);
                        log.info("File metadata updated with: ", meta);
                        return this.getFile(backend, ref);
                    }
                    else {
                        throw new Error("No data present");
                    }
                }
                if (yield this.containsFile(backend, ref)) {
                    return this.getFile(backend, ref);
                }
                let uploadTask;
                const uid = FirebaseDatastores_1.FirebaseDatastores.getUserID();
                const meta = { uid, visibility };
                const metadata = { customMetadata: meta };
                if (storagePath.settings) {
                    metadata.contentType = storagePath.settings.contentType;
                    metadata.cacheControl = storagePath.settings.cacheControl;
                }
                if (typeof data === 'string') {
                    uploadTask = fileRef.putString(data, 'raw', metadata);
                }
                else if (data instanceof Blob) {
                    uploadTask = fileRef.put(data, metadata);
                }
                else {
                    if (Files_1.FileHandles.isFileHandle(data)) {
                        const fileHandle = data;
                        const fileURL = FilePaths_1.FilePaths.toURL(fileHandle.path);
                        const blob = yield URLs_1.URLs.toBlob(fileURL);
                        uploadTask = fileRef.put(blob, metadata);
                    }
                    else {
                        uploadTask = fileRef.put(Uint8Array.from(data), metadata);
                    }
                }
                const started = Date.now();
                const task = ProgressTracker_1.ProgressTracker.createNonce();
                const progressID = 'firebase-upload-' + STORAGE_UPLOAD_ID++;
                const controller = {
                    pause: () => uploadTask.pause(),
                    resume: () => uploadTask.resume(),
                    cancel: () => uploadTask.cancel()
                };
                if (opts.onController) {
                    opts.onController(controller);
                }
                uploadTask.on('state_changed', (snapshotData) => {
                    const snapshot = snapshotData;
                    const now = Date.now();
                    const duration = now - started;
                    const percentage = Percentages_1.Percentages.calculate(snapshot.bytesTransferred, snapshot.totalBytes);
                    log.notice('Upload is ' + percentage + '% done');
                    const progress = {
                        id: progressID,
                        task,
                        completed: snapshot.bytesTransferred,
                        total: snapshot.totalBytes,
                        duration,
                        progress: percentage,
                        timestamp: Date.now(),
                        name: `${backend}/${ref.name}`
                    };
                    ProgressMessages_1.ProgressMessages.broadcast(progress);
                    if (opts.progressListener) {
                        const writeFileProgress = Object.assign(Object.assign({ ref: Object.assign({ backend }, ref) }, progress), { value: progress.progress, type: 'determinate' });
                        opts.progressListener(writeFileProgress);
                    }
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED:
                            break;
                        case firebase.storage.TaskState.RUNNING:
                            break;
                    }
                });
                const uploadTaskSnapshot = yield uploadTask;
                const { downloadURL, bytesTransferred } = uploadTaskSnapshot;
                const result = {
                    backend,
                    ref,
                    url: downloadURL
                };
                latch.resolve(result);
                delete this.pendingFileWrites[pendingFileWriteKey];
                return result;
            }
            catch (e) {
                latch.reject(e);
                throw e;
            }
        });
    }
    createFileMetaID(backend, ref) {
        const storagePath = FirebaseDatastores_1.FirebaseDatastores.computeStoragePath(backend, ref);
        return Hashcodes_1.Hashcodes.create(storagePath.path);
    }
    getFile(backend, ref, opts = {}) {
        Datastores_1.Datastores.assertNetworkLayer(this, opts.networkLayer);
        log.debug("getFile");
        const storage = this.storage;
        const storagePath = FirebaseDatastores_1.FirebaseDatastores.computeStoragePath(backend, ref);
        const storageRef = storage.ref().child(storagePath.path);
        const downloadURL = DownloadURLs.computeDownloadURL(backend, ref, storagePath, storageRef, opts);
        const url = this.wrappedDownloadURL(downloadURL);
        return { backend, ref, url };
    }
    wrappedDownloadURL(url) {
        return url;
    }
    containsFile(backend, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            const storagePath = FirebaseDatastores_1.FirebaseDatastores.computeStoragePath(backend, ref);
            const storage = this.storage;
            const storageRef = storage.ref().child(storagePath.path);
            const downloadURL = DownloadURLs.computeDownloadURL(backend, ref, storagePath, storageRef, {});
            return DownloadURLs.checkExistence(downloadURL);
        });
    }
    deleteFile(backend, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            log.debug("deleteFile: ", backend, ref);
            try {
                const storage = this.storage;
                const storagePath = FirebaseDatastores_1.FirebaseDatastores.computeStoragePath(backend, ref);
                const fileRef = storage.ref().child(storagePath.path);
                yield fileRef.delete();
            }
            catch (e) {
                if (e.code === "storage/object-not-found") {
                    return;
                }
                throw e;
            }
        });
    }
    write(fingerprint, data, docInfo, opts = new DefaultWriteOpts()) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handleWriteFile(opts);
            const datastoreMutation = opts.datastoreMutation || new DatastoreMutation_1.DefaultDatastoreMutation();
            const id = FirebaseDatastores_1.FirebaseDatastores.computeDocMetaID(fingerprint);
            const createDocRefs = () => {
                const docMetaRef = this.firestore
                    .collection(DatastoreCollection.DOC_META)
                    .doc(id);
                const docInfoRef = this.firestore
                    .collection(DatastoreCollection.DOC_INFO)
                    .doc(id);
                return [docMetaRef, docInfoRef];
            };
            try {
                docInfo = Object.assign({}, Dictionaries_1.Dictionaries.onlyDefinedProperties(docInfo));
                const createRecordPermission = () => __awaiter(this, void 0, void 0, function* () {
                    const docPermission = yield DocPermissions_1.DocPermissions.get(id);
                    if (docPermission) {
                        return {
                            visibility: docPermission.visibility,
                            groups: docPermission.groups
                        };
                    }
                    return {
                        visibility: docInfo.visibility || Visibility_1.Visibility.PRIVATE
                    };
                });
                const recordPermission = Dictionaries_1.Dictionaries.onlyDefinedProperties(yield createRecordPermission());
                const batch = this.firestore.batch();
                const dataLen = data.length;
                log.notice(`Write of doc with id ${id}, and data length ${dataLen} and permission: `, recordPermission);
                const [docMetaRef, docInfoRef] = createDocRefs();
                batch.set(docMetaRef, this.createRecordHolderForDocMeta(docInfo, data, recordPermission));
                batch.set(docInfoRef, this.createRecordHolderForDocInfo(docInfo, recordPermission));
                yield batch.commit();
                const waitForCommit = () => __awaiter(this, void 0, void 0, function* () {
                    const [docMetaRef, docInfoRef] = createDocRefs();
                    this.handleDatastoreMutations(docMetaRef, datastoreMutation, 'write');
                    const commitPromise = Promise.all([
                        this.waitForCommit(docMetaRef),
                        this.waitForCommit(docInfoRef)
                    ]);
                    log.debug("write: Waiting for commit promise...");
                    yield commitPromise;
                    log.debug("write: Waiting for commit promise...done");
                });
                if (opts.consistency === 'committed') {
                    console.log("write: Waiting for commit...");
                    yield waitForCommit();
                    console.log("write: Waiting for commit...done");
                }
            }
            finally {
            }
        });
    }
    overview() {
        return __awaiter(this, void 0, void 0, function* () {
            const docMetaRefs = yield this.getDocMetaRefs();
            const user = Firebase_1.Firebase.currentUser();
            return {
                nrDocs: docMetaRefs.length,
                created: user.metadata.creationTime
            };
        });
    }
    capabilities() {
        return {
            networkLayers: IDatastore_1.NetworkLayers.WEB,
            permission: { mode: 'rw' },
            snapshots: true
        };
    }
    getPrefs() {
        const onCommit = (persistentPrefs) => __awaiter(this, void 0, void 0, function* () {
            this.prefs.update(persistentPrefs.toPrefDict());
        });
        class PrefsProviderImpl extends Datastore_1.AbstractPrefsProvider {
            constructor(prefs) {
                super();
                this.prefs = prefs;
            }
            get() {
                return this.prefs;
            }
            register(onNext, onError) {
                const createSnapshotListener = () => {
                    const onNextUserPref = (data) => {
                        const prefs = FirebaseDatastorePrefs_1.FirebaseDatastorePrefs.toPersistentPrefs(data);
                        onNext(prefs);
                    };
                    return this.prefs.onSnapshot(onNextUserPref, onError);
                };
                return createSnapshotListener();
            }
        }
        const prefsProviderImpl = new PrefsProviderImpl(this.prefs);
        return new Prefs_1.InterceptedPrefsProvider(prefsProviderImpl, onCommit);
    }
    createRecordHolderForDocMeta(docInfo, docMeta, opts = new DefaultWriteOpts()) {
        const visibility = opts.visibility || Visibility_1.Visibility.PRIVATE;
        const uid = FirebaseDatastores_1.FirebaseDatastores.getUserID();
        const id = FirebaseDatastores_1.FirebaseDatastores.computeDocMetaID(docInfo.fingerprint, uid);
        const docMetaHolder = {
            docInfo,
            value: docMeta
        };
        const recordHolder = {
            uid,
            id,
            visibility,
            groups: opts.groups || null,
            value: docMetaHolder
        };
        return recordHolder;
    }
    createRecordHolderForDocInfo(docInfo, opts = new DefaultWriteOpts()) {
        const visibility = opts.visibility || Visibility_1.Visibility.PRIVATE;
        const uid = FirebaseDatastores_1.FirebaseDatastores.getUserID();
        const id = FirebaseDatastores_1.FirebaseDatastores.computeDocMetaID(docInfo.fingerprint, uid);
        const recordHolder = {
            uid,
            id,
            visibility,
            groups: opts.groups || null,
            value: docInfo
        };
        return recordHolder;
    }
    getDocMetaRefs() {
        return __awaiter(this, void 0, void 0, function* () {
            Preconditions_1.Preconditions.assertPresent(this.firestore, 'firestore');
            const uid = FirebaseDatastores_1.FirebaseDatastores.getUserID();
            const snapshot = yield this.firestore
                .collection(DatastoreCollection.DOC_META)
                .where('uid', '==', uid)
                .get();
            if (snapshot.empty) {
                return [];
            }
            const result = [];
            for (const doc of snapshot.docs) {
                const recordHolder = doc.data();
                const fingerprint = recordHolder.value.docInfo.fingerprint;
                if (recordHolder.value.value) {
                    result.push({
                        fingerprint,
                        docMetaProvider: () => Promise.resolve(DocMetas_1.DocMetas.deserialize(recordHolder.value.value, fingerprint))
                    });
                }
            }
            return result;
        });
    }
    waitForCommit(ref) {
        return new Promise(resolve => {
            const unsubscribeToSnapshot = ref.onSnapshot({ includeMetadataChanges: true }, snapshot => {
                if (!snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites) {
                    unsubscribeToSnapshot();
                    resolve();
                }
            }, ERR_HANDLER);
        });
    }
    handleDatastoreMutations(ref, datastoreMutation, op) {
        const unsubscribeToSnapshot = ref.onSnapshot({ includeMetadataChanges: true }, snapshot => {
            if (snapshot.metadata.fromCache && snapshot.metadata.hasPendingWrites) {
                datastoreMutation.written.resolve(true);
                log.debug(`Got written mutation with op: ${op}`, ref);
            }
            if (!snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites) {
                datastoreMutation.written.resolve(true);
                datastoreMutation.committed.resolve(true);
                log.debug(`Got committed mutation with op: ${op}`, ref);
                unsubscribeToSnapshot();
            }
        }, ERR_HANDLER);
    }
    handleDocInfoSnapshot(snapshot, docMetaSnapshotEventListener, batchID) {
        log.debug("onSnapshot... ");
        const datastore = this;
        class DefaultDocMetaLookup {
            constructor(cache) {
                this.cache = cache;
            }
            get(fingerprint) {
                return __awaiter(this, void 0, void 0, function* () {
                    const result = this.cache[fingerprint];
                    if (Preconditions_1.isPresent(result)) {
                        return result;
                    }
                    log.warn("No entry for fingerprint (fetching directly from server): " + fingerprint);
                    return yield datastore.getDocMeta(fingerprint);
                });
            }
        }
        const createDocMetaLookup = (useCache) => __awaiter(this, void 0, void 0, function* () {
            const uid = FirebaseDatastores_1.FirebaseDatastores.getUserID();
            const query = this.firestore
                .collection(DatastoreCollection.DOC_META)
                .where('uid', '==', uid);
            const source = useCache ? 'cache' : 'server';
            const stopwatch = Stopwatches_1.Stopwatches.create();
            const snapshot = yield query.get({ source });
            log.info("DocMeta lookup snapshot duration: ", stopwatch.stop());
            const docChanges = snapshot.docChanges();
            const cache = {};
            for (const docChange of docChanges) {
                const record = docChange.doc.data();
                const fingerprint = record.value.docInfo.fingerprint;
                const data = record.value.value;
                cache[fingerprint] = data;
            }
            return new DefaultDocMetaLookup(cache);
        });
        const docMetaLookupProvider = Providers_1.AsyncProviders.memoize(() => createDocMetaLookup(snapshot.metadata.fromCache));
        const docMetaMutationFromRecord = (record, mutationType = 'created') => {
            const id = record.id;
            const docInfo = record.value;
            const dataProvider = () => __awaiter(this, void 0, void 0, function* () {
                const docMetaLookup = yield docMetaLookupProvider();
                return docMetaLookup.get(docInfo.fingerprint);
            });
            const docMetaProvider = Providers_1.AsyncProviders.memoize(() => __awaiter(this, void 0, void 0, function* () {
                if (mutationType === 'deleted') {
                    throw new Error("Unable to read data when mutationType is 'deleted'");
                }
                const data = yield dataProvider();
                if (!data) {
                    console.warn("No data for fingerprint: " + docInfo.fingerprint);
                    return undefined;
                }
                const docMetaID = FirebaseDatastores_1.FirebaseDatastores.computeDocMetaID(docInfo.fingerprint);
                Preconditions_1.Preconditions.assertPresent(data, `No data for docMeta with fingerprint: ${docInfo.fingerprint}, docMetaID: ${docMetaID}`);
                return DocMetas_1.DocMetas.deserialize(data, docInfo.fingerprint);
            }));
            const docMetaMutation = {
                id,
                fingerprint: docInfo.fingerprint,
                dataProvider,
                docMetaProvider,
                docInfoProvider: Providers_1.AsyncProviders.of(docInfo),
                docMetaFileRefProvider: Providers_1.AsyncProviders.of(DocMetaRef_1.DocMetaFileRefs.createFromDocInfo(docInfo)),
                mutationType
            };
            return docMetaMutation;
        };
        const toDocMetaMutationFromDocChange = (docChange) => {
            const record = docChange.doc.data();
            return docMetaMutationFromRecord(record, toMutationType(docChange.type));
        };
        const consistency = snapshot.metadata.fromCache ? 'written' : 'committed';
        const docChanges = snapshot.docChanges();
        const progressTracker = new ProgressTracker_1.ProgressTracker({ total: docChanges.length, id: 'firebase-snapshot' });
        const docChangeDocMetaMutations = docChanges.map(current => toDocMetaMutationFromDocChange(current));
        const docMetaMutations = [...docChangeDocMetaMutations];
        docMetaSnapshotEventListener({
            datastore: this.id,
            consistency,
            progress: progressTracker.terminate(),
            docMetaMutations,
            batch: {
                id: batchID,
                terminated: true,
            }
        }).catch(err => log.error("Unable to dispatch event listener: ", err));
        log.debug("onSnapshot... done");
    }
    toConsistency(snapshot) {
        return snapshot.metadata.fromCache ? 'written' : 'committed';
    }
    addDocMetaSnapshotEventListener(docMetaSnapshotEventListener) {
        this.docMetaSnapshotEventDispatcher.addEventListener(docMetaSnapshotEventListener);
    }
    preferredSource() {
        return 'default';
    }
}
exports.FirebaseDatastore = FirebaseDatastore;
var DatastoreCollection;
(function (DatastoreCollection) {
    DatastoreCollection["DOC_INFO"] = "doc_info";
    DatastoreCollection["DOC_META"] = "doc_meta";
})(DatastoreCollection = exports.DatastoreCollection || (exports.DatastoreCollection = {}));
function toMutationType(docChangeType) {
    switch (docChangeType) {
        case 'added':
            return 'created';
        case 'modified':
            return 'updated';
        case 'removed':
            return 'deleted';
    }
}
class DownloadURLs {
    static checkExistence(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield URLs_1.URLs.existsWithGETUsingRange(url);
        });
    }
    static computeDownloadURL(backend, ref, storagePath, storageRef, opts) {
        return this.computeDownloadURLDirectly(backend, ref, storagePath, opts);
    }
    static computeDownloadURLWithStorageRef(storageRef) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield storageRef.getDownloadURL();
            }
            catch (e) {
                if (e.code === "storage/object-not-found") {
                    return undefined;
                }
                throw e;
            }
        });
    }
    static computeDownloadURLDirectly(backend, ref, storagePath, opts) {
        const toPath = () => {
            if (backend === Backend_1.Backend.PUBLIC) {
                return `${backend}/${ref.name}`;
            }
            else {
                return storagePath.path;
            }
        };
        const toURL = () => {
            const path = toPath();
            const project = process.env.POLAR_TEST_PROJECT || "polar-32b0f";
            return `https://storage.googleapis.com/${project}.appspot.com/${path}`;
        };
        return toURL();
    }
}
exports.DownloadURLs = DownloadURLs;
class DefaultWriteOpts {
    constructor() {
        this.consistency = 'written';
        this.visibility = Visibility_1.Visibility.PRIVATE;
    }
}
exports.DefaultWriteOpts = DefaultWriteOpts;
const ERR_HANDLER = (err) => log.error("Could not create snapshot for account: ", err);
//# sourceMappingURL=FirebaseDatastore.js.map