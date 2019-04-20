import {assert} from 'chai';
import {Engine} from './Engine';
import {EventMaps} from './Engine';
import {EventHandlers} from './Engine';
import {NULL_FUNCTION} from '../../../../../web/js/util/Functions';
import {isPresent} from '../../../../../web/js/Preconditions';
import {TestingTime} from '../../../../../web/js/test/TestingTime';
import {assertJSON} from '../../../../../web/js/test/Assertions';
import {UserFacts} from '../SplashEngine';
import {SplashEventHandlers} from '../SplashEngine';
import {SplashEngine} from '../SplashEngine';

describe('Engine', function() {

    beforeEach(function() {
        TestingTime.freeze();
    });

    afterEach(function() {
        TestingTime.unfreeze();
    });

    it('basic', function() {

        const facts: UserFacts = {

            datastoreCreated: "2012-02-02T11:38:49.321Z",

            version: "1.0.0",

            eventTimes: {
                onWhatsNew: undefined,
                onNetPromoter: undefined,

            }

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

    describe('EventHandlers', function() {

        it('basic', function() {

            const myEventHandlers = {
                onFoo: NULL_FUNCTION
            };

            const myEventMap = EventMaps.create(myEventHandlers, {});

            assert.isTrue(isPresent(myEventMap.onFoo));
            assert.isTrue(isPresent(myEventMap.onFoo.handler));
            assert.isTrue(myEventMap.onFoo.lastExecuted === undefined);
            myEventMap.onFoo.handler();
            assert.isTrue(myEventMap.onFoo.lastExecuted !== undefined);

            assert.equal(myEventMap.onFoo.lastExecuted, "2012-03-02T11:38:49.321Z");

        });


        it('withExistingTime', function() {

            const myEventHandlers = {
                onFoo: NULL_FUNCTION
            };

            const myEventMap = EventMaps.create(myEventHandlers, {onFoo: "2012-03-01T00:00:00.000Z"});

            assert.isTrue(isPresent(myEventMap.onFoo));
            assert.isTrue(isPresent(myEventMap.onFoo.handler));
            assert.isTrue(myEventMap.onFoo.lastExecuted !== undefined);
            assert.equal(myEventMap.onFoo.lastExecuted, "2012-03-01T00:00:00.000Z");
            myEventMap.onFoo.handler();
            assert.isTrue(myEventMap.onFoo.lastExecuted !== undefined);
            assert.equal(myEventMap.onFoo.lastExecuted, "2012-03-02T11:38:49.321Z");

            assertJSON(EventMaps.toEventTimes(myEventMap), {
                "onFoo": "2012-03-02T11:38:49.321Z"
            });


        });

    });

});
