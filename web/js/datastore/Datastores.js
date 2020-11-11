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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Datastores = void 0;
const MemoryDatastore_1 = require("./MemoryDatastore");
const DiskDatastore_1 = require("./DiskDatastore");
const Logger_1 = require("polar-shared/src/logger/Logger");
const DocMetaRef_1 = require("./DocMetaRef");
const DocMetas_1 = require("../metadata/DocMetas");
const Functions_1 = require("polar-shared/src/util/Functions");
const Percentages_1 = require("polar-shared/src/util/Percentages");
const ProgressTracker_1 = require("polar-shared/src/util/ProgressTracker");
const Providers_1 = require("polar-shared/src/util/Providers");
const DefaultPersistenceLayer_1 = require("./DefaultPersistenceLayer");
const deep_equal_1 = __importDefault(require("deep-equal"));
const Preconditions_1 = require("polar-shared/src/Preconditions");
const AsyncWorkQueue_1 = require("polar-shared/src/util/AsyncWorkQueue");
const log = Logger_1.Logger.create();
const ENV_POLAR_DATASTORE = 'POLAR_DATASTORE';
class Datastores {
    static create() {
        const name = process.env[ENV_POLAR_DATASTORE];
        if (name === 'MEMORY') {
            log.info("Using memory datastore");
            return new MemoryDatastore_1.MemoryDatastore();
        }
        return new DiskDatastore_1.DiskDatastore();
    }
    static getDocMetas(datastore, listener, docMetaRefs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!docMetaRefs) {
                docMetaRefs = yield datastore.getDocMetaRefs();
            }
            for (const docMetaRef of docMetaRefs) {
                const docMetaData = yield datastore.getDocMeta(docMetaRef.fingerprint);
                if (!docMetaData) {
                    throw new Error("Could not find docMeta for fingerprint: " + docMetaRef.fingerprint);
                }
                const docMeta = DocMetas_1.DocMetas.deserialize(docMetaData, docMetaRef.fingerprint);
                listener(docMeta);
            }
        });
    }
    static createCommittedSnapshot(datastore, listener, batch) {
        return __awaiter(this, void 0, void 0, function* () {
            console.time("createCommittedSnapshot");
            if (!batch) {
                batch = {
                    id: 0,
                    terminated: false
                };
            }
            console.time("getDocMetaRefs");
            const docMetaFiles = yield datastore.getDocMetaRefs();
            console.timeEnd("getDocMetaRefs");
            const progressTracker = new ProgressTracker_1.ProgressTracker({ total: docMetaFiles.length, id: `datastore:${datastore.id}#snapshot` });
            const durations = {
                data: 0,
                docMeta: 0,
                docInfo: 0,
                docMetaFileRef: 0
            };
            for (const docMetaFile of docMetaFiles) {
                const dataProvider = Providers_1.AsyncProviders.memoize(() => __awaiter(this, void 0, void 0, function* () {
                    const before = Date.now();
                    try {
                        return yield datastore.getDocMeta(docMetaFile.fingerprint);
                    }
                    finally {
                        durations.data += Date.now() - before;
                    }
                }));
                const docMetaProvider = Providers_1.AsyncProviders.memoize(() => __awaiter(this, void 0, void 0, function* () {
                    const before = Date.now();
                    try {
                        const data = yield dataProvider();
                        return DocMetas_1.DocMetas.deserialize(data, docMetaFile.fingerprint);
                    }
                    finally {
                        durations.docMeta += Date.now() - before;
                    }
                }));
                const docInfoProvider = Providers_1.AsyncProviders.memoize(() => __awaiter(this, void 0, void 0, function* () {
                    const before = Date.now();
                    try {
                        return (yield docMetaProvider()).docInfo;
                    }
                    finally {
                        durations.docInfo += Date.now() - before;
                    }
                }));
                const docMetaFileRefProvider = Providers_1.AsyncProviders.memoize(() => __awaiter(this, void 0, void 0, function* () {
                    const before = Date.now();
                    try {
                        return DocMetaRef_1.DocMetaFileRefs.createFromDocInfo(yield docInfoProvider());
                    }
                    finally {
                        durations.docMetaFileRef += Date.now() - before;
                    }
                }));
                const docMetaMutation = {
                    fingerprint: docMetaFile.fingerprint,
                    docMetaFileRefProvider,
                    dataProvider,
                    docMetaProvider,
                    docInfoProvider,
                    mutationType: 'created'
                };
                yield listener({
                    datastore: datastore.id,
                    progress: progressTracker.incr(),
                    consistency: 'committed',
                    docMetaMutations: [docMetaMutation],
                    batch
                });
            }
            console.log("Durations: ", durations);
            yield listener({
                datastore: datastore.id,
                progress: progressTracker.terminate(),
                consistency: 'committed',
                docMetaMutations: [],
                batch: {
                    id: batch.id,
                    terminated: true,
                }
            });
            console.timeEnd("createCommittedSnapshot");
            return {};
        });
    }
    static purge(datastore, purgeListener = Functions_1.NULL_FUNCTION) {
        return __awaiter(this, void 0, void 0, function* () {
            log.debug("Getting doc meta refs...");
            const docMetaFiles = yield datastore.getDocMetaRefs();
            log.debug("Getting doc meta refs...done");
            let completed = 0;
            const total = docMetaFiles.length;
            const work = [];
            const asyncWorkQueue = new AsyncWorkQueue_1.AsyncWorkQueue(work);
            for (const docMetaFile of docMetaFiles) {
                work.push(() => __awaiter(this, void 0, void 0, function* () {
                    log.debug(`Purging file: ${docMetaFile.fingerprint} in datastore ${datastore.id}`);
                    const data = yield datastore.getDocMeta(docMetaFile.fingerprint);
                    const docMeta = DocMetas_1.DocMetas.deserialize(data, docMetaFile.fingerprint);
                    const docMetaFileRef = DocMetaRef_1.DocMetaFileRefs.createFromDocInfo(docMeta.docInfo);
                    yield datastore.delete(docMetaFileRef);
                    ++completed;
                    const progress = Percentages_1.Percentages.calculate(completed, total);
                    purgeListener({ completed, total, progress });
                }));
            }
            yield asyncWorkQueue.execute();
            if (total === 0) {
                purgeListener({ completed, total, progress: 100 });
            }
        });
    }
    static checkConsistency(datastore0, datastore1) {
        return __awaiter(this, void 0, void 0, function* () {
            const manifest0 = yield this.toDocInfoManifest(datastore0);
            const manifest1 = yield this.toDocInfoManifest(datastore1);
            const consistent = deep_equal_1.default(manifest0, manifest1);
            return { consistent, manifest0, manifest1 };
        });
    }
    static toDocInfoManifest(datastore) {
        return __awaiter(this, void 0, void 0, function* () {
            const persistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(datastore);
            const docMetaRefs = yield datastore.getDocMetaRefs();
            const docMetaFiles = [...docMetaRefs]
                .sort((d0, d1) => d0.fingerprint.localeCompare(d1.fingerprint));
            const result = [];
            for (const docMetaFile of docMetaFiles) {
                const docMeta = yield persistenceLayer.getDocMeta(docMetaFile.fingerprint);
                Preconditions_1.Preconditions.assertPresent(docMeta, "toDocInfoManifest could not find docMeta for " + docMetaFile.fingerprint);
                result.push(docMeta.docInfo);
            }
            return result;
        });
    }
    static assertNetworkLayer(datastore, networkLayer) {
        if (!networkLayer) {
            return;
        }
        const capabilities = datastore.capabilities();
        if (!capabilities.networkLayers.has(networkLayer)) {
            throw new Error(`Datastore '${datastore.id}' does not support ${networkLayer} only ${capabilities.networkLayers}`);
        }
    }
}
exports.Datastores = Datastores;
//# sourceMappingURL=Datastores.js.map