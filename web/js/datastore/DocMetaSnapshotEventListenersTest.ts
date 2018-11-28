
import {DocMetaSnapshotEvent, DocMetaSnapshotEventListener, DatastoreConsistency, DocMetaMutation, MutationType} from './Datastore';
import {DocMetaSnapshotEventListeners} from './DocMetaSnapshotEventListeners';
import {MockDocMetas} from '../metadata/DocMetas';
import {TestingTime} from '../test/TestingTime';
import {ProgressTracker} from '../util/ProgressTracker';
import {assertJSON} from '../test/Assertions';
import {assert} from 'chai';
import {UUIDs} from '../metadata/UUIDs';
import {NULL_FUNCTION} from '../util/Functions';
import {AsyncProviders} from '../util/Providers';
import waitForExpect from 'wait-for-expect';

describe('DocMetaSnapshotEventListener', function() {

    const docMeta = MockDocMetas.createMockDocMeta();

    let emitted: DocMetaSnapshotEvent[] = [];

    let deduplicatedListener: DocMetaSnapshotEventListener = NULL_FUNCTION;

    const progressTracker = new ProgressTracker(1);
    progressTracker.incr();

    const progress = progressTracker.peek();
    const consistency: DatastoreConsistency = 'committed';

    beforeEach(function() {
        TestingTime.freeze();

        emitted = [];

        deduplicatedListener = DocMetaSnapshotEventListeners.createDeduplicatedListener(emittedEvent => {
            emitted.push(emittedEvent);
        });

    });

    afterEach(function() {
        TestingTime.unfreeze();
    });

    function createDocMetaSnapshotEvent(mutationType: MutationType = 'created'): DocMetaSnapshotEvent {

        const docMetaMutation: DocMetaMutation = {
            docMetaProvider: AsyncProviders.of(docMeta),
            docInfoProvider: AsyncProviders.of(docMeta.docInfo),
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
        TestingTime.forward(5000);
        return UUIDs.create();
    }

    it("basic duplicate suppression", async function() {

        const docMetaSnapshotEvent = createDocMetaSnapshotEvent();

        deduplicatedListener(docMetaSnapshotEvent);
        deduplicatedListener(docMetaSnapshotEvent);

        waitForExpect(() => {
            assert.equal(emitted.length, 1);
        });

    });


    it("Two 'created' (with differing times)", async function() {

        const docMetaSnapshotEvent = createDocMetaSnapshotEvent();

        deduplicatedListener(docMetaSnapshotEvent);

        docMeta.docInfo.uuid = createFutureUUID();

        deduplicatedListener(docMetaSnapshotEvent);

        waitForExpect(() => {
            assert.equal(emitted.length, 1);
        });

    });

    it("One created, then one updated.", async function() {

        deduplicatedListener(createDocMetaSnapshotEvent('created'));

        docMeta.docInfo.uuid = createFutureUUID();

        deduplicatedListener(createDocMetaSnapshotEvent('updated'));

        waitForExpect(() => {
            assert.equal(emitted.length, 2);
        });

    });

    it("Two updated.", async function() {

        deduplicatedListener(createDocMetaSnapshotEvent('updated'));

        docMeta.docInfo.uuid = createFutureUUID();

        deduplicatedListener(createDocMetaSnapshotEvent('updated'));

        waitForExpect(() => {
            assert.equal(emitted.length, 2);
        });

    });

    it("Created, then deleted, then created", async function() {

        deduplicatedListener(createDocMetaSnapshotEvent('created'));

        docMeta.docInfo.uuid = createFutureUUID();

        deduplicatedListener(createDocMetaSnapshotEvent('deleted'));

        docMeta.docInfo.uuid = createFutureUUID();

        deduplicatedListener(createDocMetaSnapshotEvent('created'));

        waitForExpect(() => {
            assert.equal(emitted.length, 3);
        });

    });

});
