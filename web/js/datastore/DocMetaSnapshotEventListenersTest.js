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
const DocMetaSnapshotEventListeners_1 = require("./DocMetaSnapshotEventListeners");
const DocMetas_1 = require("../metadata/DocMetas");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
const ProgressTracker_1 = require("polar-shared/src/util/ProgressTracker");
const chai_1 = require("chai");
const UUIDs_1 = require("../metadata/UUIDs");
const Functions_1 = require("polar-shared/src/util/Functions");
const Providers_1 = require("polar-shared/src/util/Providers");
const wait_for_expect_1 = __importDefault(require("wait-for-expect"));
const DocMetaRef_1 = require("./DocMetaRef");
const MetadataSerializer_1 = require("../metadata/MetadataSerializer");
const Reducers_1 = require("polar-shared/src/util/Reducers");
describe('DocMetaSnapshotEventListener', function () {
    let docMeta;
    let docMetaSnapshotEvents = [];
    let deduplicatedListener = Functions_1.ASYNC_NULL_FUNCTION;
    const progressTracker = new ProgressTracker_1.ProgressTracker({ total: 1, id: 'test' });
    progressTracker.incr();
    const progress = progressTracker.peek();
    const consistency = 'committed';
    beforeEach(function () {
        TestingTime_1.TestingTime.freeze();
        docMeta = DocMetas_1.MockDocMetas.createMockDocMeta();
        docMetaSnapshotEvents = [];
        const eventDeduplicator = DocMetaSnapshotEventListeners_1.DocMetaSnapshotEventListeners.createDeduplicatedListener((emittedEvent) => __awaiter(this, void 0, void 0, function* () {
            docMetaSnapshotEvents.push(emittedEvent);
        }));
        deduplicatedListener = eventDeduplicator.listener;
    });
    afterEach(function () {
        TestingTime_1.TestingTime.unfreeze();
    });
    function createDocMetaSnapshotEvent(mutationType = 'created') {
        const docMetaMutation = {
            fingerprint: docMeta.docInfo.fingerprint,
            dataProvider: Providers_1.AsyncProviders.of(MetadataSerializer_1.MetadataSerializer.serialize(docMeta)),
            docMetaProvider: Providers_1.AsyncProviders.of(docMeta),
            docInfoProvider: Providers_1.AsyncProviders.of(docMeta.docInfo),
            docMetaFileRefProvider: Providers_1.AsyncProviders.of(DocMetaRef_1.DocMetaFileRefs.createFromDocInfo(docMeta.docInfo)),
            mutationType
        };
        const docMetaSnapshotEvent = {
            datastore: 'memory',
            progress,
            consistency,
            docMetaMutations: [
                docMetaMutation
            ]
        };
        return docMetaSnapshotEvent;
    }
    function createFutureUUID() {
        TestingTime_1.TestingTime.forward(5000);
        return UUIDs_1.UUIDs.create();
    }
    function computeEmittedDocMetaMutations(event) {
        return docMetaSnapshotEvents.map(current => current.docMetaMutations.length)
            .reduce(Reducers_1.Reducers.SUM, 0);
    }
    it("basic duplicate suppression", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const docMetaSnapshotEvent = createDocMetaSnapshotEvent();
            chai_1.assert.equal(computeEmittedDocMetaMutations(docMetaSnapshotEvents), 0);
            yield deduplicatedListener(docMetaSnapshotEvent);
            chai_1.assert.equal(computeEmittedDocMetaMutations(docMetaSnapshotEvents), 1);
            yield deduplicatedListener(docMetaSnapshotEvent);
            yield wait_for_expect_1.default(() => {
                chai_1.assert.equal(computeEmittedDocMetaMutations(docMetaSnapshotEvents), 1);
            });
        });
    });
    it("Two 'created' (with differing times)", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const docMetaSnapshotEvent = createDocMetaSnapshotEvent();
            chai_1.assert.equal(computeEmittedDocMetaMutations(docMetaSnapshotEvents), 0);
            yield deduplicatedListener(docMetaSnapshotEvent);
            chai_1.assert.equal(computeEmittedDocMetaMutations(docMetaSnapshotEvents), 1);
            TestingTime_1.TestingTime.forward(60000);
            const futureUUID = createFutureUUID();
            chai_1.assert.notEqual(docMeta.docInfo.uuid, futureUUID);
            docMeta.docInfo.uuid = futureUUID;
            yield deduplicatedListener(docMetaSnapshotEvent);
            chai_1.assert.equal(computeEmittedDocMetaMutations(docMetaSnapshotEvents), 2);
            yield wait_for_expect_1.default(() => {
                chai_1.assert.equal(computeEmittedDocMetaMutations(docMetaSnapshotEvents), 2);
            });
        });
    });
    it("One created, then one updated.", function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield deduplicatedListener(createDocMetaSnapshotEvent('created'));
            docMeta.docInfo.uuid = createFutureUUID();
            yield deduplicatedListener(createDocMetaSnapshotEvent('updated'));
            yield wait_for_expect_1.default(() => {
                chai_1.assert.equal(docMetaSnapshotEvents.length, 2);
            });
        });
    });
    it("Two updated.", function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield deduplicatedListener(createDocMetaSnapshotEvent('updated'));
            docMeta.docInfo.uuid = createFutureUUID();
            yield deduplicatedListener(createDocMetaSnapshotEvent('updated'));
            yield wait_for_expect_1.default(() => {
                chai_1.assert.equal(docMetaSnapshotEvents.length, 2);
            });
        });
    });
    it("Created, then deleted, then created", function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield deduplicatedListener(createDocMetaSnapshotEvent('created'));
            docMeta.docInfo.uuid = createFutureUUID();
            yield deduplicatedListener(createDocMetaSnapshotEvent('deleted'));
            docMeta.docInfo.uuid = createFutureUUID();
            yield deduplicatedListener(createDocMetaSnapshotEvent('created'));
            yield wait_for_expect_1.default(() => {
                chai_1.assert.equal(docMetaSnapshotEvents.length, 3);
            });
        });
    });
});
//# sourceMappingURL=DocMetaSnapshotEventListenersTest.js.map