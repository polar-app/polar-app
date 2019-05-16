import {EventHandlers} from './rules_engine/Engine';
import {EventMap} from './rules_engine/Engine';
import {EventMaps} from './rules_engine/Engine';
import {RuleMap} from './rules_engine/Engine';
import {Engine} from './rules_engine/Engine';
import {ISODateTimeString} from '../../../../web/js/metadata/ISODateTimeStrings';
import {ISODateTimeStrings} from '../../../../web/js/metadata/ISODateTimeStrings';
import {Rule} from './rules_engine/Rule';
import {RuleFactPair} from './rules_engine/Rule';
import {TimeDurations} from '../../../../web/js/util/TimeDurations';
import {DurationStr} from '../../../../web/js/util/TimeDurations';
import {ExternalEngineState} from './rules_engine/Engine';
import {LifecycleEvents} from '../../../../web/js/ui/util/LifecycleEvents';
import {LifecycleToggle} from '../../../../web/js/ui/util/LifecycleToggle';
import {Duration} from '../../../../web/js/util/TimeDurations';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';

export class SplashEngine {

    private engine: Engine<UserFacts, SplashEventHandlers>;

    constructor(private facts: UserFacts,
                private eventHandlers: SplashEventHandlers,
                private readonly externalEngineState?: ExternalEngineState<UserFacts, SplashEventHandlers>) {

        const rules: RuleMap<UserFacts, SplashEventHandlers> = {
            whatsNew: new WhatsNewRule(),
            netPromoter: new NetPromoterRule(),
            suggestions: new SuggestionsRule(),
        };

        this.engine = new Engine(facts, rules, eventHandlers, externalEngineState);

    }

    public run() {
        this.engine.run();
    }

    public toExternalEngineState() {
        return this.engine.toExternalEngineState();
    }

}

/**
 * Splash engine that automatically persists and resumes from local storage.
 */
export class DefaultSplashEngine extends SplashEngine {

    constructor(facts: UserFacts,
                eventHandlers: SplashEventHandlers) {

        super(facts, eventHandlers, LocalStorageExternalState.get());

    }

    public run() {

        super.run();

        const externalState = this.toExternalEngineState();
        LocalStorageExternalState.set(externalState);

    }

}

class LocalStorageExternalState {

    private static KEY = 'splash-engine-state';

    public static get(): ExternalEngineState<UserFacts, SplashEventHandlers> | undefined {
        const value = localStorage.getItem(this.KEY);

        if (value) {
            return JSON.parse(value);
        } else {
            return undefined;
        }

    }

    public static set(state: ExternalEngineState<UserFacts, SplashEventHandlers>) {
        localStorage.setItem(this.KEY, JSON.stringify(state));
    }

}

export interface SplashEventHandlers extends EventHandlers {
    readonly onWhatsNew: () => void;
    readonly onNetPromoter: () => void;
    readonly onSuggestions: () => void;
}

export interface MutableUserFacts {

    /**
     * The time the datastore was created.
     */
    datastoreCreated: ISODateTimeString;

    /**
     * The currently running version.
     */
    version: string;

}

export interface UserFacts extends Readonly<MutableUserFacts> {

}

interface SuggestionsState {

}

class SuggestionsRule implements Rule<UserFacts, SplashEventHandlers, SuggestionsState> {

    public run(facts: Readonly<UserFacts>,
               eventMap: EventMap<SplashEventHandlers>,
               state?: Readonly<SuggestionsState>): RuleFactPair<UserFacts, SuggestionsState> {

        if (! state) {
            state = {};
        }

        const canShow = () => {

            // prompt for suggestion if the user has been using polar for at LEAST
            // three days and we are at least 15m from the last event.

            const hasExistingAgedDatastore = () => {
                return UserFactsUtils.hasExistingAgedDatastore(facts, '3d');
            };

            const hasMinimumTimeSinceLastNPS = () => {
                const epoch = eventMap.onNetPromoter.lastExecuted;
                return hasMinimumTimeSince(epoch, '1d');
            };

            const hasMinimumTimeSinceLastEvent = () => {
                const epoch = EventMaps.latestExecution(eventMap);
                return hasMinimumTimeSince(epoch, '15m');
            };

            if (! hasMinimumTimeSinceLastEvent()) {
                RendererAnalytics.event({category: 'splash-suggestions-skipped', action: 'reason-has-minimum-time-since-last-event'});
                return false;
            }

            if (! hasExistingAgedDatastore()) {
                RendererAnalytics.event({category: 'splash-suggestions-skipped', action: 'reason-has-existing-aged-datastore'});
                return false;
            }

            if (! hasMinimumTimeSinceLastNPS()) {
                RendererAnalytics.event({category: 'splash-suggestions-skipped', action: 'reason-has-minimum-time-since-last-nps'});
                return false;
            }

            if (! hasTourTerminated()) {
                RendererAnalytics.event({category: 'splash-suggestions-skipped', action: 'reason-has-tour-terminated'});
                return false;
            }

            return true;

        };

        if (canShow()) {
            eventMap.onSuggestions.handler();
        }

        return [facts, state];

    }

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


class UserFactsUtils {

    public static hasExistingAgedDatastore(facts: UserFacts, duration: Duration) {

        // datastore should be created for at least 7 days.

        if (facts.datastoreCreated) {

            const since = ISODateTimeStrings.parse(facts.datastoreCreated);

            if (TimeDurations.hasElapsed(since, duration)) {
                return true;
            }

        }

        return false;

    }

}

function hasMinimumTimeSince(epoch: ISODateTimeString | undefined,
                             duration: DurationStr,
                             defaultValue: boolean = true) {

    if (epoch) {

        const since = ISODateTimeStrings.parse(epoch);
        return TimeDurations.hasElapsed(since, duration);

    } else {
        // our epoch hasn't happened yet so it's ok to send out this message.
        return defaultValue;
    }

}

function hasTourTerminated() {
    // TODO: I think this should be a fact and we should not measure
    // it directly.
    return LifecycleToggle.isMarked(LifecycleEvents.TOUR_TERMINATED);
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

        const hasExistingAgedDatastore = () => {
            return UserFactsUtils.hasExistingAgedDatastore(facts, '1w');
        };

        const hasMinimumTimeSinceLastEvent = () => {
            const epoch = EventMaps.latestExecution(eventMap);
            return hasMinimumTimeSince(epoch, '15m');
        };

        const hasMinimumTimeSinceLastNPS = () => {
            const epoch = eventMap.onNetPromoter.lastExecuted;
            return hasMinimumTimeSince(epoch, '7d');
        };

        const canShow = () => {

            if (! hasExistingAgedDatastore()) {
                RendererAnalytics.event({category: 'splash-nps-skipped', action: 'reason-has-existing-aged-datastore'});
                return false;
            }

            if (! hasMinimumTimeSinceLastEvent()) {
                RendererAnalytics.event({category: 'splash-nps-skipped', action: 'reason-has-minimum-time-since-last-event'});
                return false;
            }

            if (! hasMinimumTimeSinceLastNPS()) {
                RendererAnalytics.event({category: 'splash-nps-skipped', action: 'reason-has-minimum-time-since-last-nps'});
                return false;
            }

            if (! hasTourTerminated()) {
                RendererAnalytics.event({category: 'splash-nps-skipped', action: 'reason-has-tour-terminated'});
                return false;
            }

            return true;

        };

        if (canShow()) {
            eventMap.onNetPromoter.handler();
        }

        return [facts, state];

    }

}
