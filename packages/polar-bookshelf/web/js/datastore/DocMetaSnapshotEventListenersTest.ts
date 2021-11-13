import {DocMetaMutation, DocMetaSnapshotEvent, DocMetaSnapshotEventListener, MutationType} from './Datastore';
import {DocMetaSnapshotEventListeners} from './DocMetaSnapshotEventListeners';
import {TestingTime} from 'polar-shared/src/test/TestingTime';
import {ProgressTracker} from 'polar-shared/src/util/ProgressTracker';
import {assert} from 'chai';
import {UUIDs} from 'polar-shared/src/metadata/UUIDs';
import {ASYNC_NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {AsyncProviders} from 'polar-shared/src/util/Providers';
import waitForExpect from 'wait-for-expect';
import {DocMetaFileRefs} from './DocMetaRef';
import {MetadataSerializer} from 'polar-shared/src/metadata/MetadataSerializer';
import {Reducers} from 'polar-shared/src/util/Reducers';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {MockDocMetas} from "polar-shared/src/metadata/MockDocMetas";
import {FirebaseDatastores} from "polar-shared-datastore/src/FirebaseDatastores";
import DatastoreConsistency = FirebaseDatastores.DatastoreConsistency;

describe('DocMetaSnapshotEventListener', function() {

    let docMeta: IDocMeta;

    let docMetaSnapshotEvents: DocMetaSnapshotEvent[] = [];

    let deduplicatedListener: DocMetaSnapshotEventListener = ASYNC_NULL_FUNCTION;

    const progressTracker = new ProgressTracker({total: 1, id: 'test'});
    progressTracker.incr();

    const progress = progressTracker.peek();
    const consistency: DatastoreConsistency = 'committed';

    beforeEach(function() {
        TestingTime.freeze();

        docMeta = MockDocMetas.createMockDocMeta();

        docMetaSnapshotEvents = [];

        const eventDeduplicator = DocMetaSnapshotEventListeners.createDeduplicatedListener(async emittedEvent => {
            docMetaSnapshotEvents.push(emittedEvent);
        });

        deduplicatedListener = eventDeduplicator.listener;

    });

    afterEach(function() {
        TestingTime.unfreeze();
    });

    function createDocMetaSnapshotEvent(mutationType: MutationType = 'created'): DocMetaSnapshotEvent {

        const docMetaMutation: DocMetaMutation = {
            fingerprint: docMeta.docInfo.fingerprint,
            dataProvider: AsyncProviders.of(MetadataSerializer.serialize(docMeta)),
            docMetaProvider: AsyncProviders.of(docMeta),
            docInfoProvider: AsyncProviders.of(docMeta.docInfo),
            docMetaFileRefProvider: AsyncProviders.of(DocMetaFileRefs.createFromDocInfo(docMeta.docInfo)),
            mutationType,
            fromCache: true,
            hasPendingWrites: false
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
        TestingTime.forward(5000);
        return UUIDs.create();
    }

    function computeEmittedDocMetaMutations(event: DocMetaSnapshotEvent[]) {

        return docMetaSnapshotEvents.map(current => current.docMetaMutations.length)
            .reduce(Reducers.SUM, 0);

    }

    it("basic duplicate suppression", async function() {

        const docMetaSnapshotEvent = createDocMetaSnapshotEvent();

        assert.equal(computeEmittedDocMetaMutations(docMetaSnapshotEvents), 0);

        await deduplicatedListener(docMetaSnapshotEvent);

        assert.equal(computeEmittedDocMetaMutations(docMetaSnapshotEvents), 1);

        await deduplicatedListener(docMetaSnapshotEvent);

        await waitForExpect(() => {
            assert.equal(computeEmittedDocMetaMutations(docMetaSnapshotEvents), 1);
        });

    });


    it("Two 'created' (with differing times)", async function() {

        const docMetaSnapshotEvent = createDocMetaSnapshotEvent();

        assert.equal(computeEmittedDocMetaMutations(docMetaSnapshotEvents), 0);

        await deduplicatedListener(docMetaSnapshotEvent);

        assert.equal(computeEmittedDocMetaMutations(docMetaSnapshotEvents), 1);

        TestingTime.forward(60000);
        const futureUUID = createFutureUUID();

        assert.notEqual(docMeta.docInfo.uuid, futureUUID);

        docMeta.docInfo.uuid = futureUUID;

        await deduplicatedListener(docMetaSnapshotEvent);

        assert.equal(computeEmittedDocMetaMutations(docMetaSnapshotEvents), 2);

        await waitForExpect(() => {
            assert.equal(computeEmittedDocMetaMutations(docMetaSnapshotEvents), 2);
        });

    });

    it("One created, then one updated.", async function() {

        await deduplicatedListener(createDocMetaSnapshotEvent('created'));

        docMeta.docInfo.uuid = createFutureUUID();

        await deduplicatedListener(createDocMetaSnapshotEvent('updated'));

        await waitForExpect(() => {
            assert.equal(docMetaSnapshotEvents.length, 2);
        });

    });

    it("Two updated.", async function() {

        await deduplicatedListener(createDocMetaSnapshotEvent('updated'));

        docMeta.docInfo.uuid = createFutureUUID();

        await deduplicatedListener(createDocMetaSnapshotEvent('updated'));

        await waitForExpect(() => {
            assert.equal(docMetaSnapshotEvents.length, 2);
        });

    });

    it("Created, then deleted, then created", async function() {

        await deduplicatedListener(createDocMetaSnapshotEvent('created'));

        docMeta.docInfo.uuid = createFutureUUID();

        await deduplicatedListener(createDocMetaSnapshotEvent('deleted'));

        docMeta.docInfo.uuid = createFutureUUID();

        await deduplicatedListener(createDocMetaSnapshotEvent('created'));

        await waitForExpect(() => {
            assert.equal(docMetaSnapshotEvents.length, 3);
        });

    });

});
