import {DocumentReadyStates, MockReadyStateChanger, ReadyStateResolution} from './DocumentReadyStates';
import {JSDOM} from 'jsdom';
import {assert} from 'chai';

describe('DocumentReadyStates', function() {

    describe('waitForChanger', function() {

        let jsdom = new JSDOM();

        let doc = jsdom.window.document;

        it("basic via event", async function () {

            let mockReadyStateChanger = new MockReadyStateChanger('loading');

            let result = DocumentReadyStates.waitForChanger(doc, 'interactive', mockReadyStateChanger);

            mockReadyStateChanger.resolve();

            assert.equal(await result, ReadyStateResolution.EVENT);

        });

        it("basic via direct", async function () {

            let mockReadyStateChanger = new MockReadyStateChanger('loading');

            let result = DocumentReadyStates.waitForChanger(doc, 'loading', mockReadyStateChanger);

            assert.equal(await result, ReadyStateResolution.DIRECT);

        });

        it("to via direct", async function () {

            let mockReadyStateChanger = new MockReadyStateChanger('loading');

            let result = DocumentReadyStates.waitForChanger(doc, 'complete', mockReadyStateChanger);
            mockReadyStateChanger.resolve();
            mockReadyStateChanger.resolve();

            assert.equal(await result, ReadyStateResolution.EVENT);

        });

    });

    describe('meetsRequiredState', function() {

        it("basic", function () {
            assert.equal(DocumentReadyStates.meetsRequiredState('interactive', 'interactive'), true);
        });

        it("full", function () {
            assert.equal(DocumentReadyStates.meetsRequiredState('loading', 'complete'), true);
        });

    });

});
