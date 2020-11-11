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
const SpectronRenderer_1 = require("../../js/test/SpectronRenderer");
const DiskDatastore_1 = require("../../js/datastore/DiskDatastore");
const DefaultPersistenceLayer_1 = require("../../js/datastore/DefaultPersistenceLayer");
const DocMetas_1 = require("../../js/metadata/DocMetas");
const chai_1 = require("chai");
const DatastoreTester_1 = require("../../js/datastore/DatastoreTester");
const Promises_1 = require("../../js/util/Promises");
const FirebaseDatastore_1 = require("../../js/datastore/FirebaseDatastore");
const FirebaseTestRunner_1 = require("../../js/firebase/FirebaseTestRunner");
const CloudAwareDatastore_1 = require("../../js/datastore/CloudAwareDatastore");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const Files_1 = require("polar-shared/src/util/Files");
const DatastoreMutation_1 = require("../../js/datastore/DatastoreMutation");
const PolarDataDir_1 = require("../../js/test/PolarDataDir");
const Datastores_1 = require("../../js/datastore/Datastores");
const Functions_1 = require("polar-shared/src/util/Functions");
const Logging_1 = require("../../js/logger/Logging");
const wait_for_expect_1 = __importDefault(require("wait-for-expect"));
const Latch_1 = require("polar-shared/src/util/Latch");
const TIMEOUT = 30000;
Logging_1.Logging.initForTesting();
mocha.setup('bdd');
mocha.timeout(TIMEOUT);
function createDatastore() {
    return __awaiter(this, void 0, void 0, function* () {
        const diskDatastore = new DiskDatastore_1.DiskDatastore();
        const firebaseDatastore = new FirebaseDatastore_1.FirebaseDatastore();
        yield Promise.all([diskDatastore.init(), firebaseDatastore.init()]);
        const cloudAwareDatastore = new CloudAwareDatastore_1.CloudAwareDatastore(diskDatastore, firebaseDatastore);
        cloudAwareDatastore.shutdownHook = () => __awaiter(this, void 0, void 0, function* () {
            yield wait_for_expect_1.default(() => __awaiter(this, void 0, void 0, function* () {
                console.log("Checking consistency...");
                const consistency = yield Datastores_1.Datastores.checkConsistency(diskDatastore, firebaseDatastore);
                if (!consistency.consistent) {
                    console.log("Filesystems are NOT consistent: ", consistency.manifest0, consistency.manifest1);
                }
                chai_1.assert.ok(consistency.consistent, "Datastores are not consistent");
            }), TIMEOUT);
        });
        return cloudAwareDatastore;
    });
}
SpectronRenderer_1.SpectronRenderer.run((state) => __awaiter(void 0, void 0, void 0, function* () {
    new FirebaseTestRunner_1.FirebaseTestRunner(state).run(() => __awaiter(void 0, void 0, void 0, function* () {
        yield PolarDataDir_1.PolarDataDir.useFreshDirectory('.test-firebase-cloud-aware-datastore');
        const fingerprint = "0x001";
        describe('Cloud datastore tests', function () {
            beforeEach(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        console.log("==== BEGIN beforeEach: ");
                        console.log("Removing files from: " + PolarDataDir_1.PolarDataDir.get());
                        yield Files_1.Files.removeDirectoryRecursivelyAsync(PolarDataDir_1.PolarDataDir.get());
                        console.log("Initializing firebase datastore...");
                        const firebaseDatastore = new FirebaseDatastore_1.FirebaseDatastore();
                        yield firebaseDatastore.init();
                        console.log("Initializing firebase datastore...done");
                        console.log("Purging firebase datastore...");
                        yield Datastores_1.Datastores.purge(firebaseDatastore, purgeEvent => console.log("Purged: ", purgeEvent));
                        console.log("Purging firebase datastore...done");
                        yield firebaseDatastore.stop();
                    }
                    catch (e) {
                        console.error("Caught exception in beforeEach: ", e);
                        throw e;
                    }
                    finally {
                        console.log("==== END beforeEach");
                    }
                });
            });
            function testForConsistency(testFunction = Functions_1.ASYNC_NULL_FUNCTION) {
                return __awaiter(this, void 0, void 0, function* () {
                    const cloudAwareDatastore = yield createDatastore();
                    const persistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(cloudAwareDatastore);
                    try {
                        yield persistenceLayer.init();
                        yield wait_for_expect_1.default(() => __awaiter(this, void 0, void 0, function* () {
                            const consistency = yield Datastores_1.Datastores.checkConsistency(cloudAwareDatastore.local, cloudAwareDatastore.cloud);
                            chai_1.assert.ok(consistency.consistent);
                        }));
                        yield testFunction(persistenceLayer, cloudAwareDatastore);
                    }
                    finally {
                        yield persistenceLayer.stop();
                    }
                });
            }
            it("Test8: Sync with extra files in the local store", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const datastore = new DiskDatastore_1.DiskDatastore();
                    yield datastore.init();
                    yield datastore.writeDocMeta(DocMetas_1.MockDocMetas.createMockDocMeta('0x0004'));
                    yield datastore.writeDocMeta(DocMetas_1.MockDocMetas.createMockDocMeta('0x0005'));
                    yield datastore.stop();
                    yield testForConsistency((persistenceLayer, cloudAwareDatastore) => __awaiter(this, void 0, void 0, function* () {
                        for (const currentFingerprint of ['0x0004', '0x0005']) {
                            chai_1.assert.ok(yield cloudAwareDatastore.local.contains(currentFingerprint));
                            chai_1.assert.ok(yield cloudAwareDatastore.cloud.contains(currentFingerprint));
                        }
                    }));
                });
            });
            it("Test9: Sync with extra files in the firebase store", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const datastore = new FirebaseDatastore_1.FirebaseDatastore();
                    yield datastore.init();
                    yield datastore.writeDocMeta(DocMetas_1.MockDocMetas.createMockDocMeta('0x0004'));
                    yield datastore.writeDocMeta(DocMetas_1.MockDocMetas.createMockDocMeta('0x0005'));
                    yield datastore.stop();
                    yield testForConsistency((persistenceLayer, cloudAwareDatastore) => __awaiter(this, void 0, void 0, function* () {
                        for (const currentFingerprint of ['0x0004', '0x0005']) {
                            chai_1.assert.ok(yield cloudAwareDatastore.local.contains(currentFingerprint));
                            chai_1.assert.ok(yield cloudAwareDatastore.cloud.contains(currentFingerprint));
                        }
                    }));
                });
            });
            it("Test1: null test to make sure we have no documents on startup", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const persistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(yield createDatastore());
                    yield persistenceLayer.init();
                    const docMetaFiles = yield persistenceLayer.getDocMetaRefs();
                    chai_1.assert.equal(docMetaFiles.length, 0);
                    yield persistenceLayer.stop();
                });
            });
            it("Test2: Basic synchronization tests", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const firebaseDatastore = new FirebaseDatastore_1.FirebaseDatastore();
                    yield firebaseDatastore.init();
                    yield Datastores_1.Datastores.purge(firebaseDatastore);
                    const firestorePersistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(firebaseDatastore);
                    yield firestorePersistenceLayer.writeDocMeta(DocMetas_1.MockDocMetas.createMockDocMeta('0x001'));
                    const cloudAwareDatastore = yield createDatastore();
                    const persistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(cloudAwareDatastore);
                    const initialDocLatch = new Latch_1.Latch();
                    const externallyWrittenDocLatch = new Latch_1.Latch();
                    cloudAwareDatastore.addDocMetaSnapshotEventListener((docMetaSnapshotEvent) => __awaiter(this, void 0, void 0, function* () {
                        for (const docMutation of docMetaSnapshotEvent.docMetaMutations) {
                            if (docMutation.fingerprint === '0x001') {
                                initialDocLatch.resolve(true);
                                continue;
                            }
                            if (docMutation.fingerprint === '0x002') {
                                externallyWrittenDocLatch.resolve(true);
                                continue;
                            }
                        }
                    }));
                    yield persistenceLayer.init();
                    yield initialDocLatch.get();
                    yield firestorePersistenceLayer.writeDocMeta(DocMetas_1.MockDocMetas.createMockDocMeta('0x002'));
                    yield externallyWrittenDocLatch.get();
                    yield wait_for_expect_1.default(() => __awaiter(this, void 0, void 0, function* () {
                        chai_1.assert.ok(yield persistenceLayer.contains('0x002'), "Does not contain second doc");
                    }));
                    console.log("WORKED");
                    yield persistenceLayer.stop();
                    yield firestorePersistenceLayer.stop();
                });
            });
            it("Test3: Write a basic doc with synchronization listener", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const cloudAwareDatastore = yield createDatastore();
                    const persistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(cloudAwareDatastore);
                    const latch0 = new Latch_1.Latch();
                    const latch1 = new Latch_1.Latch();
                    cloudAwareDatastore.addSynchronizationEventListener(docMetaSnapshotEvent => {
                        if (docMetaSnapshotEvent.consistency !== 'committed') {
                            return;
                        }
                        for (const docMetaMutation of docMetaSnapshotEvent.docMetaMutations) {
                            if (docMetaMutation.fingerprint === '0x002') {
                                latch0.resolve(true);
                            }
                            if (docMetaMutation.fingerprint === '0x003') {
                                latch1.resolve(true);
                            }
                        }
                    });
                    yield persistenceLayer.init();
                    const docMeta = DocMetas_1.MockDocMetas.createMockDocMeta('0x002');
                    yield persistenceLayer.writeDocMeta(docMeta);
                    const firebasePersistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(new FirebaseDatastore_1.FirebaseDatastore());
                    yield firebasePersistenceLayer.init();
                    yield firebasePersistenceLayer.writeDocMeta(DocMetas_1.MockDocMetas.createMockDocMeta('0x003'));
                    yield latch0.get();
                    yield latch1.get();
                    yield persistenceLayer.stop();
                    yield firebasePersistenceLayer.stop();
                });
            });
            it("Test4: Write a basic doc", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const persistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(yield createDatastore());
                    yield persistenceLayer.init();
                    const docMeta = DocMetas_1.MockDocMetas.createMockDocMeta();
                    const datastoreMutation = new DatastoreMutation_1.DefaultDatastoreMutation();
                    let writtenDuration = 0;
                    let committedDuration = 0;
                    const before = Date.now();
                    datastoreMutation.written.get().then(() => writtenDuration = Date.now() - before);
                    datastoreMutation.committed.get().then(() => committedDuration = Date.now() - before);
                    yield persistenceLayer.write(fingerprint, docMeta, { datastoreMutation });
                    console.log(`writtenDuration: ${writtenDuration}, committedDuration: ${committedDuration}`);
                    yield persistenceLayer.stop();
                });
            });
            it("Test5: Test an existing firebase store with existing data replicating to a new CloudDatastore.", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    let err;
                    const errorListener = (error) => {
                        console.error("Got error:  ", err);
                        err = error;
                    };
                    const sourcePersistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(new FirebaseDatastore_1.FirebaseDatastore());
                    yield sourcePersistenceLayer.init(errorListener);
                    yield sourcePersistenceLayer.writeDocMeta(DocMetas_1.MockDocMetas.createMockDocMeta(fingerprint));
                    yield sourcePersistenceLayer.stop();
                    const targetPersistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(yield createDatastore());
                    yield targetPersistenceLayer.init(errorListener);
                    yield wait_for_expect_1.default(() => __awaiter(this, void 0, void 0, function* () {
                        const dataDir = PolarDataDir_1.PolarDataDir.get();
                        const path = FilePaths_1.FilePaths.join(dataDir, fingerprint, 'state.json');
                        chai_1.assert.ok(yield Files_1.Files.existsAsync(path), "Path does not exist: " + path);
                    }));
                    yield targetPersistenceLayer.stop();
                    chai_1.assert.ok(err === undefined, "Received an error: " + err);
                });
            });
            it("Test6: Verify unsubscribe works.", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield Files_1.Files.removeDirectoryRecursivelyAsync(PolarDataDir_1.PolarDataDir.get());
                    const targetPersistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(yield createDatastore());
                    yield targetPersistenceLayer.init();
                    yield Datastores_1.Datastores.purge(targetPersistenceLayer.datastore);
                    const docMetaFiles = yield targetPersistenceLayer.getDocMetaRefs();
                    chai_1.assert.equal(docMetaFiles.length, 0);
                    let gotEventAfterUnsubscribe = false;
                    let unsubscribed = false;
                    const snapshotResult = yield targetPersistenceLayer.snapshot((event) => __awaiter(this, void 0, void 0, function* () {
                        console.log("GOT AN EVENT with consistency: " + event.consistency, event);
                        if (event.consistency !== 'committed') {
                            return;
                        }
                        if (!unsubscribed) {
                            return;
                        }
                        gotEventAfterUnsubscribe = true;
                    }));
                    snapshotResult.unsubscribe();
                    unsubscribed = true;
                    const sidePersistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(new FirebaseDatastore_1.FirebaseDatastore());
                    yield sidePersistenceLayer.init();
                    yield sidePersistenceLayer.writeDocMeta(DocMetas_1.MockDocMetas.createMockDocMeta());
                    yield sidePersistenceLayer.stop();
                    yield Promises_1.Promises.waitFor(5000);
                    chai_1.assert.ok(gotEventAfterUnsubscribe === false, "Nope.. we still got the event");
                });
            });
            xit("Test7: Test a remote write and a local replication to disk", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const sourcePersistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(new FirebaseDatastore_1.FirebaseDatastore());
                    yield sourcePersistenceLayer.init();
                    const targetPersistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(yield createDatastore());
                    yield targetPersistenceLayer.init();
                    const docMeta = DocMetas_1.MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);
                    yield sourcePersistenceLayer.write(fingerprint, docMeta);
                    yield wait_for_expect_1.default(() => __awaiter(this, void 0, void 0, function* () {
                        const dataDir = PolarDataDir_1.PolarDataDir.get();
                        const path = FilePaths_1.FilePaths.join(dataDir, '0x001', 'state.json');
                        chai_1.assert.ok(yield Files_1.Files.existsAsync(path), 'Path for fingerprint never appeared');
                    }));
                    yield sourcePersistenceLayer.stop();
                    yield targetPersistenceLayer.stop();
                });
            });
        });
        DatastoreTester_1.DatastoreTester.test(createDatastore, false);
    })).catch(err => console.error(err));
}));
//# sourceMappingURL=content.js.map