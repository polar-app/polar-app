"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
const SplashEngine_1 = require("./SplashEngine");
const LocalPrefs_1 = require("../../../../web/js/util/LocalPrefs");
const LifecycleToggle_1 = require("../../../../web/js/ui/util/LifecycleToggle");
const LifecycleEvents_1 = require("../../../../web/js/ui/util/LifecycleEvents");
const Assertions_1 = require("../../../../web/js/test/Assertions");
const TimeDurations_1 = require("polar-shared/src/util/TimeDurations");
const Functions_1 = require("polar-shared/src/util/Functions");
describe('SplashEngine', function () {
    beforeEach(function () {
        LocalPrefs_1.StorageBackends.delegate = new LocalPrefs_1.MockStorageBackend();
        TestingTime_1.TestingTime.freeze();
    });
    afterEach(function () {
        LocalPrefs_1.StorageBackends.delegate = undefined;
        TestingTime_1.TestingTime.unfreeze();
    });
    xit('Scan forward in the future with default configuration', function () {
        LifecycleToggle_1.LifecycleToggle.mark(LifecycleEvents_1.LifecycleEvents.TOUR_TERMINATED);
        const facts = {
            datastoreCreated: "2012-02-02T11:38:49.321Z",
            version: "1.0.0",
        };
        const [createSnapshot, eventHandlers] = createEventHandlers();
        const engine = new SplashEngine_1.SplashEngine(facts, eventHandlers);
        testEngineInTheFuture(engine);
        Assertions_1.assertJSON(createSnapshot(), {
            "netPromoterCalled": 9,
            "suggestionsCalled": 9,
            "whatsNewCalled": 0
        });
        console.log("worked!");
    });
    xit('first NPS, then version upgrade', function () {
        LifecycleToggle_1.LifecycleToggle.mark(LifecycleEvents_1.LifecycleEvents.TOUR_TERMINATED);
        const facts = {
            datastoreCreated: "2012-02-02T11:38:49.321Z",
            version: "1.0.0",
        };
        let whatsNewCalled = 0;
        let netPromoterCalled = 0;
        let suggestionsCalled = 0;
        const eventHandlers = {
            onWhatsNew: () => ++whatsNewCalled,
            onNetPromoter: () => ++netPromoterCalled,
            onSuggestions: () => ++suggestionsCalled,
        };
        const engine = new SplashEngine_1.SplashEngine(facts, eventHandlers);
        engine.run();
        chai_1.assert.equal(whatsNewCalled, 0);
        chai_1.assert.equal(suggestionsCalled, 0);
        chai_1.assert.equal(netPromoterCalled, 1);
        engine.run();
        chai_1.assert.equal(whatsNewCalled, 0);
        chai_1.assert.equal(suggestionsCalled, 0);
        chai_1.assert.equal(netPromoterCalled, 1);
        TestingTime_1.TestingTime.forward('8d');
        engine.run();
        chai_1.assert.equal(whatsNewCalled, 0);
        chai_1.assert.equal(suggestionsCalled, 0);
        chai_1.assert.equal(netPromoterCalled, 2);
        TestingTime_1.TestingTime.forward('1d');
        TestingTime_1.TestingTime.forward('1m');
        engine.run();
        chai_1.assert.equal(whatsNewCalled, 0);
        chai_1.assert.equal(suggestionsCalled, 1);
        chai_1.assert.equal(netPromoterCalled, 2);
        console.log("worked!");
    });
    xit('version upgrade with persisted external state', function () {
        LifecycleToggle_1.LifecycleToggle.mark(LifecycleEvents_1.LifecycleEvents.TOUR_TERMINATED);
        const facts = {
            datastoreCreated: "2012-02-02T11:38:49.321Z",
            version: "1.50.0",
        };
        let whatsNewCalled = 0;
        let netPromoterCalled = 0;
        let suggestionsCalled = 0;
        const eventHandlers = {
            onWhatsNew: () => ++whatsNewCalled,
            onNetPromoter: () => ++netPromoterCalled,
            onSuggestions: () => ++suggestionsCalled,
        };
        let engine = new SplashEngine_1.SplashEngine(facts, eventHandlers);
        engine.run();
        chai_1.assert.equal(whatsNewCalled, 0);
        chai_1.assert.equal(suggestionsCalled, 0);
        chai_1.assert.equal(netPromoterCalled, 1);
        const externalEngineState = engine.toExternalEngineState();
        facts.version = "1.60.4";
        engine = new SplashEngine_1.SplashEngine(facts, eventHandlers, externalEngineState);
        engine.run();
        chai_1.assert.equal(whatsNewCalled, 1);
        chai_1.assert.equal(suggestionsCalled, 0);
        chai_1.assert.equal(netPromoterCalled, 1);
    });
    xit('NPS preempted due to "whats new"', function () {
        LifecycleToggle_1.LifecycleToggle.mark(LifecycleEvents_1.LifecycleEvents.TOUR_TERMINATED);
        const facts = {
            datastoreCreated: "2012-02-02T11:38:49.321Z",
            version: "1.50.0",
        };
        let whatsNewCalled = 0;
        let netPromoterCalled = 0;
        let suggestionsCalled = 0;
        const eventHandlers = {
            onWhatsNew: () => ++whatsNewCalled,
            onNetPromoter: () => ++netPromoterCalled,
            onSuggestions: () => ++suggestionsCalled,
        };
        let engine = new SplashEngine_1.SplashEngine(facts, eventHandlers);
        engine.run();
        chai_1.assert.equal(whatsNewCalled, 0);
        chai_1.assert.equal(netPromoterCalled, 1);
        const externalEngineState = engine.toExternalEngineState();
        facts.version = "1.60.4";
        TestingTime_1.TestingTime.forward('10d');
        engine = new SplashEngine_1.SplashEngine(facts, eventHandlers, externalEngineState);
        engine.run();
        chai_1.assert.equal(whatsNewCalled, 1);
        chai_1.assert.equal(suggestionsCalled, 0);
        chai_1.assert.equal(netPromoterCalled, 1);
        TestingTime_1.TestingTime.forward('16m');
        engine.run();
        chai_1.assert.equal(whatsNewCalled, 1);
        chai_1.assert.equal(suggestionsCalled, 0);
        chai_1.assert.equal(netPromoterCalled, 2);
    });
    it('Just "whats new" called', function () {
        LifecycleToggle_1.LifecycleToggle.mark(LifecycleEvents_1.LifecycleEvents.TOUR_TERMINATED);
        const facts = {
            datastoreCreated: "2012-02-02T11:38:49.321Z",
            version: "1.50.0",
        };
        let whatsNewCalled = 0;
        const eventHandlers = {
            onWhatsNew: () => ++whatsNewCalled,
            onNetPromoter: Functions_1.NULL_FUNCTION,
            onSuggestions: Functions_1.NULL_FUNCTION,
        };
        const engine = new SplashEngine_1.SplashEngine(facts, eventHandlers);
        engine.run();
        facts.version = "1.60.4";
        TestingTime_1.TestingTime.forward('16m');
        engine.run();
        chai_1.assert.equal(whatsNewCalled, 1);
    });
});
function testEngineInTheFuture(engine, duration = '60d') {
    const epoch = new Date();
    while (true) {
        TestingTime_1.TestingTime.forward('15m');
        engine.run();
        if (TimeDurations_1.TimeDurations.hasElapsed(epoch, duration)) {
            break;
        }
    }
}
function createEventHandlers() {
    let whatsNewCalled = 0;
    let netPromoterCalled = 0;
    let suggestionsCalled = 0;
    const eventHandlers = {
        onWhatsNew: () => ++whatsNewCalled,
        onNetPromoter: () => ++netPromoterCalled,
        onSuggestions: () => ++suggestionsCalled,
    };
    const createSnapshot = () => {
        return {
            whatsNewCalled,
            netPromoterCalled,
            suggestionsCalled
        };
    };
    return [createSnapshot, eventHandlers];
}
//# sourceMappingURL=SplashEngineTest.js.map