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
const DefaultPersistenceLayer_1 = require("../../js/datastore/DefaultPersistenceLayer");
const DocMetas_1 = require("../../js/metadata/DocMetas");
const chai_1 = require("chai");
const DatastoreTester_1 = require("../../js/datastore/DatastoreTester");
const FirebaseDatastore_1 = require("../../js/datastore/FirebaseDatastore");
const FirebaseTestRunner_1 = require("../../js/firebase/FirebaseTestRunner");
const DatastoreMutation_1 = require("../../js/datastore/DatastoreMutation");
const Datastores_1 = require("../../js/datastore/Datastores");
const wait_for_expect_1 = __importDefault(require("wait-for-expect"));
const Logger_1 = require("polar-shared/src/logger/Logger");
const Latch_1 = require("polar-shared/src/util/Latch");
const log = Logger_1.Logger.create();
mocha.setup('bdd');
mocha.timeout(600000);
const fingerprint = "0x001";
SpectronRenderer_1.SpectronRenderer.run((state) => __awaiter(void 0, void 0, void 0, function* () {
    new FirebaseTestRunner_1.FirebaseTestRunner(state).run(() => __awaiter(void 0, void 0, void 0, function* () {
        const firebaseDatastore = new FirebaseDatastore_1.FirebaseDatastore();
        yield firebaseDatastore.init();
        describe('FirebaseDatastore tests', function () {
            xit("Make sure we get events from the datastore", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    let datastore = new FirebaseDatastore_1.FirebaseDatastore();
                    const persistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(datastore);
                    yield persistenceLayer.init();
                    yield Datastores_1.Datastores.purge(datastore, purgeEvent => {
                        log.info("purgeEvent: ", purgeEvent);
                    });
                    yield wait_for_expect_1.default(() => __awaiter(this, void 0, void 0, function* () {
                        const docMetaFiles = yield persistenceLayer.getDocMetaRefs();
                        chai_1.assert.equal(docMetaFiles.length, 0);
                    }));
                    const docMeta = DocMetas_1.MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);
                    const datastoreMutation = new DatastoreMutation_1.DefaultDatastoreMutation();
                    const docReplicationEventListenerCalled = false;
                    yield persistenceLayer.write(fingerprint, docMeta, { datastoreMutation });
                    chai_1.assert.isFalse(docReplicationEventListenerCalled, "No doc replication event listener called");
                    yield wait_for_expect_1.default(() => __awaiter(this, void 0, void 0, function* () {
                        const docMetaFiles = yield persistenceLayer.getDocMetaRefs();
                        chai_1.assert.equal(docMetaFiles.length, 1);
                    }));
                    yield persistenceLayer.stop();
                    datastore = new FirebaseDatastore_1.FirebaseDatastore();
                    const docMutationLatch = new Latch_1.Latch();
                    const docReplicationLatch = new Latch_1.Latch();
                    yield datastore.init();
                    yield docMutationLatch.get();
                    yield docReplicationLatch.get();
                    yield datastore.stop();
                });
            });
            xit("Make sure we get replication events from a second datastore to the first", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    class ReplicationTester {
                        constructor() {
                            this.hasDocReplicationEvent = false;
                        }
                        init() {
                            return __awaiter(this, void 0, void 0, function* () {
                                this.datastore = new FirebaseDatastore_1.FirebaseDatastore();
                                this.persistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(this.datastore);
                                yield this.persistenceLayer.init();
                                return this;
                            });
                        }
                        setup() {
                            return __awaiter(this, void 0, void 0, function* () {
                                return this;
                            });
                        }
                        write() {
                            return __awaiter(this, void 0, void 0, function* () {
                                const docMeta = DocMetas_1.MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);
                                yield this.persistenceLayer.write(fingerprint, docMeta);
                                yield this.persistenceLayer.delete({ fingerprint, docInfo: docMeta.docInfo });
                                return this;
                            });
                        }
                        stop() {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield this.persistenceLayer.stop();
                            });
                        }
                    }
                    const replicationTester0 = yield new ReplicationTester().init();
                    const replicationTester1 = yield new ReplicationTester().init();
                    yield replicationTester0.setup();
                    yield replicationTester1.setup();
                    yield replicationTester1.write();
                    chai_1.assert.ok(replicationTester0.hasDocReplicationEvent, "replicationTester0 failed");
                    chai_1.assert.ok(!replicationTester1.hasDocReplicationEvent, "replicationTester1 failed");
                    yield replicationTester0.stop();
                    yield replicationTester1.stop();
                });
            });
        });
        DatastoreTester_1.DatastoreTester.test(() => __awaiter(void 0, void 0, void 0, function* () { return firebaseDatastore; }), false);
    })).catch(err => console.error(err));
}));
//# sourceMappingURL=content.js.map