import {ISODateTimeString} from '../../../../../web/js/metadata/ISODateTimeStrings';
import {assert} from 'chai';
import {Rule} from './Rule';
import {RuleFactPair} from './Rule';
import {RuleMap} from './Engine';
import {Engine} from './Engine';
import {RuleOrder} from './Engine';
import {NULL_FUNCTION} from '../../../../../web/js/util/Functions';
import {EventMaps} from './Engine';
import {isPresent} from '../../../../../web/js/Preconditions';
import {TestingTime} from '../../../../../web/js/test/TestingTime';
import {assertJSON} from '../../../../../web/js/test/Assertions';
import {EventMap} from './Engine';
import {EventHandlers} from './Engine';

describe('Engine', function() {

    beforeEach(function() {
        TestingTime.freeze();
    });

    afterEach(function() {
        TestingTime.unfreeze();
    });

    it('basic', function() {


        interface SplashEventHandlers extends EventHandlers {
            readonly onWhatsNew: () => void;
        }


        /**
         * Stores a time for each of our event handlers to verify that events
         * do not occur too often and are ordered properly.
         */
        type SplashEventTimes = {
            [id in keyof SplashEventHandlers]: ISODateTimeString | undefined
        };

        interface UserFacts {

            /**
             * The time the datastore was created.
             */
            datastoreCreated: ISODateTimeString;

            /**
             * The currently running version.
             */
            version: string;

            eventTimes: SplashEventTimes;

        }

        interface WhatsNewState {

            version: string;

        }

        class WhatsNewRule implements Rule<UserFacts, SplashEventHandlers, WhatsNewState> {

            public run(facts: Readonly<UserFacts>,
                       eventMap: EventMap<SplashEventHandlers>,
                       state?: Readonly<WhatsNewState>): RuleFactPair<UserFacts, WhatsNewState> {

                const updated = state && state.version !== facts.version;

                if (updated) {
                    eventMap.onWhatsNew.handler();
                }

                state = {version: facts.version};

                return [facts, state];

            }

        }

        interface NetPromoterState {

        }

        class NetPromoterRule implements Rule<UserFacts, SplashEventHandlers, NetPromoterState> {

            public run(facts: Readonly<UserFacts>,
                       eventMap: EventMap<SplashEventHandlers>,
                       state?: Readonly<NetPromoterState>): RuleFactPair<UserFacts, NetPromoterState> {

                if (! state) {
                    state = {};
                }

                // FIXME: go over all event times, find the min value, and make sure
                // we don't have one called since then.

                // FIXME: make it so that when we call fire an event the timestamp
                // is always updated.

                // FIXME: have a new structure that takes the event Handlers,
                // returns a tuple of NEW event handlers with a wrapper function
                // and an index of their call times called EventHistory and
                // EventHandlers

                return [facts, state];

            }

        }

        const facts: UserFacts = {

            datastoreCreated: "2019-01-20T14:38:55.825Z",

            version: "1.0.0",

            eventTimes: {
                onWhatsNew: undefined
            }

        };

        let whatsNewCalled: boolean = false;

        const rules: RuleMap<UserFacts, SplashEventHandlers> = {
            whatsNew: new WhatsNewRule()
        };

        const order: RuleOrder<UserFacts, SplashEventHandlers> = [
            'whatsNew'
        ];

        const eventHandlers: SplashEventHandlers = {
            onWhatsNew: () => whatsNewCalled = true
        };

        const engine: Engine<UserFacts, SplashEventHandlers>
            = new Engine(facts, rules, order, eventHandlers);

        engine.run();

        assert.equal(whatsNewCalled, false);

        engine.run();

        assert.equal(whatsNewCalled, false);

        facts.version = "1.1.0";

        engine.run();

        assert.equal(whatsNewCalled, true);

        // FIXME: we need an event emit engine to emit only named events
        // like 'whats-new' and 'net-promoter-score' which I can tie code to
        // and display messages.


        // "2019-04-20T14:38:55.825Z"


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
