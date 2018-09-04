import assert from 'assert';
import {MockDocMetas} from '../metadata/DocMetas';
import {MemoryDatastore} from './MemoryDatastore';
import {PersistenceLayer} from './PersistenceLayer';
import {TestingTime} from '../test/TestingTime';


describe('PersistenceLayer', function() {

    it("verify that lastUpdated was written", async function () {

        let memoryDatastore = new MemoryDatastore();
        let persistenceLayer = new PersistenceLayer(memoryDatastore);

        let docMeta = MockDocMetas.createWithinInitialPagemarks('0x0001', 1);

        assert.ok(docMeta.docInfo.lastUpdated === undefined);
        assert.ok(docMeta.docInfo.added === undefined);

        await persistenceLayer.syncDocMeta(docMeta);

        assert.ok(docMeta.docInfo.lastUpdated !== undefined);

        let current = docMeta.docInfo.lastUpdated!;

        TestingTime.forward(1000);

        await persistenceLayer.syncDocMeta(docMeta);

        let now = docMeta.docInfo.lastUpdated!;

        assert.ok(current.toString() !== now.toString());


    });


    it("verify that added was written", async function () {

        TestingTime.freeze();

        let memoryDatastore = new MemoryDatastore();
        let persistenceLayer = new PersistenceLayer(memoryDatastore);

        let docMeta = MockDocMetas.createWithinInitialPagemarks('0x0001', 1);

        assert.ok(docMeta.docInfo.added === undefined);
        await persistenceLayer.syncDocMeta(docMeta);
        assert.ok(docMeta.docInfo.added !== undefined);

        let current = docMeta.docInfo.added!;

        TestingTime.forward(1000);

        await persistenceLayer.syncDocMeta(docMeta);

        let now = docMeta.docInfo.added!;

        assert.ok(current.toString() === now.toString());

        // now verify that if we write a second time, that the added value
        // is NOT changed.

    });

});
