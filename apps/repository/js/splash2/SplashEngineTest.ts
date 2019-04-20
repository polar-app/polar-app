import {assert} from 'chai';
import {TestingTime} from '../../../../web/js/test/TestingTime';
import {UserFacts} from './SplashEngine';
import {SplashEventHandlers} from './SplashEngine';
import {SplashEngine} from './SplashEngine';
import {MutableUserFacts} from './SplashEngine';

describe('SplashEngine', function() {

    beforeEach(function() {
        TestingTime.freeze();
    });

    afterEach(function() {
        TestingTime.unfreeze();
    });

    it('first NPS, then version upgrade', function() {

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

        // FIXME this is impossible and not worth testing as we are not able to
        // upgrade the version while we're running.

        facts.version = "1.1.0";

        engine.run();

        assert.equal(whatsNewCalled, 1);
        assert.equal(netPromoterCalled, 1);

        // FIXME: test 15 minutes too ... after an upgrade where we were never
        //  called before.

        TestingTime.forward('8d');

        engine.run();
        assert.equal(whatsNewCalled, 1);
        assert.equal(netPromoterCalled, 2);

        // FIXME: we need an event emit engine to emit only named events
        // like 'whats-new' and 'net-promoter-score' which I can tie code to
        // and display messages.


        // "2019-04-20T14:38:55.825Z"


        // FIXME: tests to perform
        //
        //  - new user, no initial "whats new" splash, then 7 days later ,
        //    first NPS score prompted, then another 7 days, then new NPS score,
        //    requested.
        //
        //  - new user, 3 days, then new version, then 4 more days, then 'what's new'

        // - existing usser

    });

    it('version upgrade with persisted external state', function() {

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

    });


});
