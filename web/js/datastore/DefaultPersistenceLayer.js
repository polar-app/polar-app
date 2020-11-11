"use strict";
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
exports.DefaultPersistenceLayer = void 0;
const DocMeta_1 = require("../metadata/DocMeta");
const DocMetas_1 = require("../metadata/DocMetas");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
const PersistenceLayer_1 = require("./PersistenceLayer");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Reducers_1 = require("polar-shared/src/util/Reducers");
const DatastoreMutation_1 = require("./DatastoreMutation");
const DatastoreMutations_1 = require("./DatastoreMutations");
const UUIDs_1 = require("../metadata/UUIDs");
const Functions_1 = require("polar-shared/src/util/Functions");
const DocMetaTags_1 = require("../metadata/DocMetaTags");
const UserTagsDB_1 = require("./UserTagsDB");
const Latch_1 = require("polar-shared/src/util/Latch");
const Analytics_1 = require("../analytics/Analytics");
const log = Logger_1.Logger.create();
class DefaultPersistenceLayer extends PersistenceLayer_1.AbstractPersistenceLayer {
    constructor(datastore) {
        super();
        this.id = 'default';
        this.initLatch = new Latch_1.Latch();
        this.datastore = datastore;
        this.datastoreMutations = DatastoreMutations_1.DatastoreMutations.create('written');
    }
    init(errorListener = Functions_1.NULL_FUNCTION, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.doInitDatastore(errorListener, opts);
            yield this.doInitUserTagsDB();
        });
    }
    doInitDatastore(errorListener, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.datastore.init(errorListener, opts);
                this.initLatch.resolve(true);
            }
            catch (e) {
                this.initLatch.reject(e);
            }
        });
    }
    doInitUserTagsDB() {
        return __awaiter(this, void 0, void 0, function* () {
            const prefsProvider = this.datastore.getPrefs();
            this.userTagsDB = new UserTagsDB_1.UserTagsDB(prefsProvider.get());
            this.userTagsDB.init();
            log.notice("UserTagsDB now has N record: ", this.userTagsDB.tags().length);
        });
    }
    doInitUserTagsLegacyData() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const MIGRATED_KEY = 'has-user-tags-migrated';
            const markMigrationCompleted = () => __awaiter(this, void 0, void 0, function* () {
                const prefs = this.datastore.getPrefs();
                const persistentPrefs = prefs.get();
                persistentPrefs.set(MIGRATED_KEY, 'true');
                yield persistentPrefs.commit();
            });
            const hasMigrated = () => {
                const prefs = this.datastore.getPrefs();
                const persistentPrefs = prefs.get();
                const value = persistentPrefs.get(MIGRATED_KEY).getOrElse('false');
                return value === 'true';
            };
            if (yield hasMigrated()) {
                log.notice("Already migrated legacy tags to UserTagsDB.");
                return;
            }
            const onFail = (err) => {
                log.error("Couldn't init legacy user tags: ", err);
            };
            const doCommitUserTagsDB = () => __awaiter(this, void 0, void 0, function* () {
                var _b;
                yield ((_b = this.userTagsDB) === null || _b === void 0 ? void 0 : _b.commit());
            });
            const doAnalytics = () => {
                Analytics_1.Analytics.event2('datastore-user-tags-migrated');
            };
            const onSuccess = () => __awaiter(this, void 0, void 0, function* () {
                yield doCommitUserTagsDB();
                yield markMigrationCompleted();
                doAnalytics();
            });
            log.info("Performing init of userTags");
            try {
                const docMetaRefs = yield this.getDocMetaRefs();
                if (docMetaRefs.length === 0) {
                    return;
                }
                for (const docMetaRef of docMetaRefs) {
                    const docMetaProvider = docMetaRef.docMetaProvider;
                    const docMeta = yield docMetaProvider();
                    const docInfo = docMeta.docInfo;
                    const tags = Object.values(docInfo.tags || {});
                    for (const tag of tags) {
                        (_a = this.userTagsDB) === null || _a === void 0 ? void 0 : _a.registerWhenAbsent(tag.label);
                    }
                }
                yield onSuccess();
            }
            catch (e) {
                onFail(e);
            }
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.datastore.stop();
        });
    }
    contains(fingerprint) {
        return this.datastore.contains(fingerprint);
    }
    delete(docMetaFileRef, datastoreMutation = new DatastoreMutation_1.DefaultDatastoreMutation()) {
        return this.datastore.delete(docMetaFileRef, datastoreMutation);
    }
    getDocMeta(fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.datastore.getDocMeta(fingerprint);
            return this.toDocMeta(fingerprint, data);
        });
    }
    getDocMetaSnapshot(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.datastore.getDocMetaSnapshot(Object.assign(Object.assign({}, opts), { onSnapshot: (snapshot => {
                    const data = this.toDocMeta(opts.fingerprint, snapshot.data);
                    opts.onSnapshot(Object.assign(Object.assign({}, snapshot), { data }));
                }) }));
        });
    }
    toDocMeta(fingerprint, data) {
        if (!Preconditions_1.isPresent(data)) {
            return undefined;
        }
        if (!(typeof data === "string")) {
            throw new Error("Expected string and received: " + typeof data);
        }
        const docMeta = DocMetas_1.DocMetas.deserialize(data, fingerprint);
        return docMeta;
    }
    writeDocMeta(docMeta, datastoreMutation) {
        return __awaiter(this, void 0, void 0, function* () {
            Preconditions_1.Preconditions.assertPresent(docMeta, "No docMeta");
            Preconditions_1.Preconditions.assertPresent(docMeta.docInfo, "No docInfo on docMeta");
            Preconditions_1.Preconditions.assertPresent(docMeta.docInfo.fingerprint, "No fingerprint on docInfo");
            docMeta.docInfo.uuid = UUIDs_1.UUIDs.create();
            yield this.writeDocMetaTags(docMeta);
            return this.write(docMeta.docInfo.fingerprint, docMeta, { datastoreMutation });
        });
    }
    writeDocMetaTags(docMeta) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tags = DocMetaTags_1.DocMetaTags.toTags(docMeta);
                for (const tag of tags) {
                    (_a = this.userTagsDB) === null || _a === void 0 ? void 0 : _a.registerWhenAbsent(tag);
                }
                yield ((_b = this.userTagsDB) === null || _b === void 0 ? void 0 : _b.commit());
                log.debug("Wrote tags to TagsDB: ", tags);
            }
            catch (e) {
                log.error("Failed to write docMeta tags: ", e);
            }
        });
    }
    write(fingerprint, docMeta, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const datastoreMutation = opts.datastoreMutation || new DatastoreMutation_1.DefaultDatastoreMutation();
            Preconditions_1.Preconditions.assertPresent(fingerprint, "fingerprint");
            Preconditions_1.Preconditions.assertPresent(docMeta, "docMeta");
            if (!(docMeta instanceof DocMeta_1.DocMeta)) {
                const msg = "Can not sync anything other than DocMeta";
                log.warn(msg + ': ', docMeta);
                throw new Error(msg);
            }
            docMeta = Dictionaries_1.Dictionaries.copyOf(docMeta);
            docMeta.docInfo.lastUpdated = ISODateTimeStrings_1.ISODateTimeStrings.create();
            docMeta.docInfo.nrComments = Object.values(docMeta.pageMetas)
                .map(current => Dictionaries_1.Dictionaries.countOf(current.comments))
                .reduce(Reducers_1.Reducers.SUM, 0);
            docMeta.docInfo.nrNotes = Object.values(docMeta.pageMetas)
                .map(current => Dictionaries_1.Dictionaries.countOf(current.notes))
                .reduce(Reducers_1.Reducers.SUM, 0);
            docMeta.docInfo.nrFlashcards = Object.values(docMeta.pageMetas)
                .map(current => Dictionaries_1.Dictionaries.countOf(current.flashcards))
                .reduce(Reducers_1.Reducers.SUM, 0);
            docMeta.docInfo.nrTextHighlights = Object.values(docMeta.pageMetas)
                .map(current => Dictionaries_1.Dictionaries.countOf(current.textHighlights))
                .reduce(Reducers_1.Reducers.SUM, 0);
            docMeta.docInfo.nrAreaHighlights = Object.values(docMeta.pageMetas)
                .map(current => Dictionaries_1.Dictionaries.countOf(current.areaHighlights))
                .reduce(Reducers_1.Reducers.SUM, 0);
            docMeta.docInfo.nrAnnotations =
                docMeta.docInfo.nrComments +
                    docMeta.docInfo.nrNotes +
                    docMeta.docInfo.nrFlashcards +
                    docMeta.docInfo.nrTextHighlights +
                    docMeta.docInfo.nrAreaHighlights;
            if (docMeta.docInfo.added === undefined) {
                docMeta.docInfo.added = ISODateTimeStrings_1.ISODateTimeStrings.create();
            }
            docMeta.docInfo.uuid = UUIDs_1.UUIDs.create();
            log.info(`Sync of docMeta with fingerprint: ${fingerprint} and UUID: ` + docMeta.docInfo.uuid);
            const data = DocMetas_1.DocMetas.serialize(docMeta, "");
            const docInfo = Object.assign({}, docMeta.docInfo);
            const syncMutation = new DatastoreMutation_1.DefaultDatastoreMutation();
            DatastoreMutations_1.DatastoreMutations.pipe(syncMutation, datastoreMutation, () => docInfo);
            const writeOpts = Object.assign(Object.assign({}, opts), { datastoreMutation: syncMutation });
            yield this.datastore.write(fingerprint, data, docInfo, writeOpts);
            return docInfo;
        });
    }
    synchronizeDocs(...docMetaRefs) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.datastore.synchronizeDocs(...docMetaRefs);
        });
    }
    getDocMetaRefs() {
        return this.datastore.getDocMetaRefs();
    }
    snapshot(listener, errorListener = Functions_1.NULL_FUNCTION) {
        return this.datastore.snapshot(listener, errorListener);
    }
    createBackup() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.datastore.createBackup();
        });
    }
    writeFile(backend, ref, data, opts) {
        return this.datastore.writeFile(backend, ref, data, opts);
    }
    containsFile(backend, ref) {
        return this.datastore.containsFile(backend, ref);
    }
    getFile(backend, ref, opts) {
        return this.datastore.getFile(backend, ref, opts);
    }
    deleteFile(backend, ref) {
        return this.datastore.deleteFile(backend, ref);
    }
    addDocMetaSnapshotEventListener(docMetaSnapshotEventListener) {
        this.datastore.addDocMetaSnapshotEventListener(docMetaSnapshotEventListener);
    }
    overview() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.datastore.overview();
        });
    }
    capabilities() {
        return this.datastore.capabilities();
    }
    deactivate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.datastore.deactivate();
        });
    }
    getUserTagsDB() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initLatch.get();
            if (!this.userTagsDB) {
                throw new Error("No userTagsDB (initialized?)");
            }
            return this.userTagsDB;
        });
    }
}
exports.DefaultPersistenceLayer = DefaultPersistenceLayer;
//# sourceMappingURL=DefaultPersistenceLayer.js.map