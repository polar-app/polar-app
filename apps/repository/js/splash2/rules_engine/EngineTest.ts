import {ISODateTimeString} from '../../../../../web/js/metadata/ISODateTimeStrings';
import {assert} from 'chai';
import {Rule} from './Rule';
import {RuleFactPair} from './Rule';
import {RuleMap} from './Engine';
import {Engine} from './Engine';
import {RuleOrder} from './Engine';

describe('Engine', function() {

    it('basic', function() {


        interface SplashEventHandlers {
            readonly onWhatsNew: () => void;
        }


        interface MutableUserFacts {
            /**
             * The time the datastore was created.
             */
            datastoreCreated: ISODateTimeString;

            /**
             * The currently running version.
             */
            version: string;

        }

        interface UserFacts extends Readonly<MutableUserFacts> {

        }

        interface WhatsNewState {

            readonly version: string;

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

        const facts: MutableUserFacts = {

            datastoreCreated: "2019-01-20T14:38:55.825Z",

            version: "1.0.0"

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

});
