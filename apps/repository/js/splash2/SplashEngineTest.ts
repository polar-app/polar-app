import {assert} from 'chai';
import {TestingTime} from '../../../../web/js/test/TestingTime';
import {UserFacts} from './SplashEngine';
import {SplashEventHandlers} from './SplashEngine';
import {SplashEngine} from './SplashEngine';
import {MutableUserFacts} from './SplashEngine';
import {MockStorageBackend} from '../../../../web/js/util/LocalPrefs';
import {StorageBackends} from '../../../../web/js/util/LocalPrefs';
import {LifecycleToggle} from '../../../../web/js/ui/util/LifecycleToggle';
import {LifecycleEvents} from '../../../../web/js/ui/util/LifecycleEvents';

describe('SplashEngine', function() {

    beforeEach(function() {
        StorageBackends.delegate = new MockStorageBackend();
        TestingTime.freeze();
    });

    afterEach(function() {
        StorageBackends.delegate = undefined;
        TestingTime.unfreeze();
    });

    it('first NPS, then version upgrade', function() {

        LifecycleToggle.mark(LifecycleEvents.TOUR_TERMINATED);

        const facts: MutableUserFacts = {

            datastoreCreated: "2012-02-02T11:38:49.321Z",

            version: "1.0.0",

        };

        let whatsNewCalled: number = 0;
        let netPromoterCalled: number = 0;

        const eventHandlers: SplashEventHandlers = {
            onWhatsNew: () => ++whatsNewCalled,
            onNetPromoter: () => ++netPromoterCalled,
        };

        const engine = new SplashEngine(facts, eventHandlers);

        engine.run();

        assert.equal(whatsNewCalled, 0);
        assert.equal(netPromoterCalled, 1);

        engine.run();

        assert.equal(whatsNewCalled, 0);
        assert.equal(netPromoterCalled, 1);

        TestingTime.forward('8d');

        engine.run();
        assert.equal(whatsNewCalled, 0);
        assert.equal(netPromoterCalled, 2);

    });

    it('version upgrade with persisted external state', function() {

        LifecycleToggle.mark(LifecycleEvents.TOUR_TERMINATED);

        const facts: MutableUserFacts = {
            datastoreCreated: "2012-02-02T11:38:49.321Z",
            version: "1.0.0",
        };

        let whatsNewCalled: number = 0;
        let netPromoterCalled: number = 0;

        const eventHandlers: SplashEventHandlers = {
            onWhatsNew: () => ++whatsNewCalled,
            onNetPromoter: () => ++netPromoterCalled,
        };

        let engine = new SplashEngine(facts, eventHandlers);

        engine.run();

        assert.equal(whatsNewCalled, 0);
        assert.equal(netPromoterCalled, 1);

        const externalEngineState = engine.toExternalEngineState();

        facts.version = "1.1.0";

        engine = new SplashEngine(facts, eventHandlers, externalEngineState);

        engine.run();

        assert.equal(whatsNewCalled, 1);
        assert.equal(netPromoterCalled, 1);

    });

    it('NPS preempted due to "whats new"', function() {

        LifecycleToggle.mark(LifecycleEvents.TOUR_TERMINATED);

        const facts: MutableUserFacts = {
            datastoreCreated: "2012-02-02T11:38:49.321Z",
            version: "1.0.0",
        };

        let whatsNewCalled: number = 0;
        let netPromoterCalled: number = 0;

        const eventHandlers: SplashEventHandlers = {
            onWhatsNew: () => ++whatsNewCalled,
            onNetPromoter: () => ++netPromoterCalled,
        };

        let engine = new SplashEngine(facts, eventHandlers);

        engine.run();

        assert.equal(whatsNewCalled, 0);
        assert.equal(netPromoterCalled, 1);

        const externalEngineState = engine.toExternalEngineState();
        facts.version = "1.1.0";
        TestingTime.forward('10d');

        engine = new SplashEngine(facts, eventHandlers, externalEngineState);

        engine.run();

        assert.equal(whatsNewCalled, 1);
        assert.equal(netPromoterCalled, 1);

        TestingTime.forward('16m');

        engine.run();

        assert.equal(whatsNewCalled, 1);
        assert.equal(netPromoterCalled, 2);


    });


});
