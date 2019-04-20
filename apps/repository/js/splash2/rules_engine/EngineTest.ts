import {ISODateTimeString} from '../../../../../web/js/metadata/ISODateTimeStrings';
import {assert} from 'chai';
import {Rule} from './Rule';
import {RuleFactPair} from './Rule';

describe('Engine', function() {

    it('basic', function() {

        interface WhatsNewState {

            readonly version: string;

        }

        /**
         * The times the last events were shown.
         */
        interface EventTimes {
            readonly whatsNew?: ISODateTimeString;
        }

        interface UserFacts {

            /**
             * The time the datastore was created.
             */
            readonly datastoreCreated: ISODateTimeString;

            readonly eventTimes: EventTimes;

            /**
             * The currently running version.
             */
            readonly version: string;

        }

        interface Event<T> {
            lastExecuted?: ISODateTimeString;
            handler: (input?: T) => void;
        }

        /**
         * Stores just the event event handlers code by name with no actual
         * metadata and we can only map to a void function with at most one
         * argument.
         */
        interface EventHandlers {
            [name: string]: <T>(input?: T) => void;
        }

        /**
         * The raw mapped types with metadata about their execution time.
         */
        type EventStates<H> = {
            [name in keyof H]: (<T>(input?: T) => void) | undefined;
        };

        /**
         * The engine state between run which between facts F and handlers H
         */
        interface EngineState<F, H> {

            readonly facts: F;

            /**
             * The states of the individual rules.
             */
            readonly states: {[id: string]: any};

            readonly events: EventStates<H>;

        }

        interface SplashEventHandlers extends EventHandlers {
            readonly onWhatsNew: () => void;
        }

        class WhatsNewRule implements Rule<UserFacts, SplashEventHandlers, WhatsNewState> {

            public readonly id = 'whats-new';

            public run(facts: UserFacts,
                       eventHandlers: SplashEventHandlers,
                       state?: WhatsNewState): RuleFactPair<UserFacts, WhatsNewState> {

                const updated = state && state.version !== facts.version;

                if (updated) {
                    eventHandlers.onWhatsNew();
                }

                state = {version: facts.version};

                return [facts, state];

            }

        }


        const rules: ReadonlyArray<Rule<UserFacts, SplashEventHandlers, any>> = [
            new WhatsNewRule()
        ];

        const states: {[id: string]: any} = {};

        let facts: UserFacts = {

            datastoreCreated: "2019-01-20T14:38:55.825Z",

            eventTimes: {

            },
            version: "1.0.0"

        };

        let whatsNewCalled: boolean = false;

        const eventHandlers: SplashEventHandlers = {
            onWhatsNew: () => whatsNewCalled = true
        };

        const eventStates: EventStates<SplashEventHandlers> = {
            onWhatsNew: undefined
        };

        // FIXME: now what is the best way to emit the events...
        //   - have a strictly typed eventEmitter passed in to the rules
        //     engine but should we expose ALL events to each rule...
        //   - probably but only if we keep ttrack of WHEN events were emitted
        //     and we can persist the times they were emitted independently
        //     of the handlers

        for (const rule of rules) {

            const state = states[rule.id];

            const result = rule.run(facts, state);

            // now update the fact and state of this object
            states[rule.id] = result[1];
            facts = result[0];

        }

        assert.equal(whatsNewCalled, true);

        // FIXME: we need an event emit engine to emit only named events
        // like 'whats-new' and 'net-promoter-score' which I can tie code to
        // and display messages.


        // "2019-04-20T14:38:55.825Z"


    });

});
