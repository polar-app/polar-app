"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultSplashEngine = exports.SplashEngine = void 0;
const Engine_1 = require("./rules_engine/Engine");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const TimeDurations_1 = require("polar-shared/src/util/TimeDurations");
const LifecycleEvents_1 = require("../../../../web/js/ui/util/LifecycleEvents");
const LifecycleToggle_1 = require("../../../../web/js/ui/util/LifecycleToggle");
const semver = __importStar(require("semver"));
const ReleaseMetadatas_1 = require("polar-release-metadata/src/ReleaseMetadatas");
const Devices_1 = require("polar-shared/src/util/Devices");
class SplashEngine {
    constructor(facts, eventHandlers, externalEngineState) {
        this.facts = facts;
        this.eventHandlers = eventHandlers;
        this.externalEngineState = externalEngineState;
        const rules = {
            whatsNew: new WhatsNewRule(),
        };
        this.engine = new Engine_1.Engine(facts, rules, eventHandlers, externalEngineState);
    }
    run() {
        this.engine.run();
    }
    getFacts() {
        return this.engine.getFacts();
    }
    toExternalEngineState() {
        return this.engine.toExternalEngineState();
    }
}
exports.SplashEngine = SplashEngine;
class DefaultSplashEngine extends SplashEngine {
    constructor(facts, eventHandlers) {
        super(facts, eventHandlers, LocalStorageExternalState.get());
    }
    run() {
        super.run();
        const externalState = this.toExternalEngineState();
        LocalStorageExternalState.set(externalState);
    }
}
exports.DefaultSplashEngine = DefaultSplashEngine;
class LocalStorageExternalState {
    static get() {
        const value = localStorage.getItem(this.KEY);
        if (value) {
            return JSON.parse(value);
        }
        else {
            return undefined;
        }
    }
    static set(state) {
        localStorage.setItem(this.KEY, JSON.stringify(state));
    }
}
LocalStorageExternalState.KEY = 'splash-engine-state';
class SuggestionsRule {
    run(facts, eventMap, state) {
        if (!state) {
            state = {};
        }
        const canShow = () => canFireMajorRule(facts, eventMap, eventMap.onSuggestions, 'splash-suggestions-skipped');
        if (canShow()) {
            eventMap.onSuggestions.handler();
        }
        return [facts, state];
    }
}
class NetPromoterRule {
    run(facts, eventMap, state) {
        if (!state) {
            state = {};
        }
        const canShow = () => canFireMajorRule(facts, eventMap, eventMap.onNetPromoter, 'splash-nps-skipped');
        if (canShow()) {
            eventMap.onNetPromoter.handler();
        }
        return [facts, state];
    }
}
class WhatsNewRule {
    run(facts, eventMap, state) {
        const hasUpdated = state && semver.lt(state.version, facts.version);
        const hasMetadata = ReleaseMetadatas_1.ReleaseMetadatas.hasMetadata(facts.version);
        if (hasUpdated && hasMetadata) {
            if (Devices_1.Devices.isDesktop() || Devices_1.Devices.isTablet) {
                eventMap.onWhatsNew.handler();
            }
        }
        state = { version: facts.version };
        return [facts, state];
    }
}
function canFireMajorRule(facts, eventMap, event, analyticsKey) {
    const hasExistingAgedDatastore = () => {
        return UserFactsUtils.hasExistingAgedDatastore(facts, '3d');
    };
    const hasMinimumTimeSinceLastEvent = () => {
        const lastEventExecution = Engine_1.EventMaps.latestExecution(eventMap);
        return hasMinimumTimeSince(lastEventExecution, '15m');
    };
    const hasMinimumTimeSinceLastRuleFired = () => {
        const epoch = event.lastExecuted;
        return hasMinimumTimeSince(epoch, '7d');
    };
    if (!hasExistingAgedDatastore()) {
        return false;
    }
    if (!hasMinimumTimeSinceLastMajorPrompt(eventMap)) {
        return false;
    }
    if (!hasMinimumTimeSinceLastEvent()) {
        return false;
    }
    if (!hasMinimumTimeSinceLastRuleFired()) {
        return false;
    }
    if (!hasTourTerminated()) {
        return false;
    }
    return true;
}
function hasMinimumTimeSinceLastMajorPrompt(eventMap) {
    const events = [eventMap.onNetPromoter, eventMap.onSuggestions];
    for (const event of events) {
        if (!hasMinimumTimeSince(event.lastExecuted, '1d')) {
            return false;
        }
    }
    return true;
}
function hasMinimumTimeSince(epoch, duration, defaultValue = true) {
    if (epoch) {
        const since = ISODateTimeStrings_1.ISODateTimeStrings.parse(epoch);
        return TimeDurations_1.TimeDurations.hasElapsed(since, duration);
    }
    else {
        return defaultValue;
    }
}
function hasTourTerminated() {
    return LifecycleToggle_1.LifecycleToggle.isMarked(LifecycleEvents_1.LifecycleEvents.TOUR_TERMINATED);
}
class UserFactsUtils {
    static hasExistingAgedDatastore(facts, duration) {
        if (facts.datastoreCreated) {
            const since = ISODateTimeStrings_1.ISODateTimeStrings.parse(facts.datastoreCreated);
            if (TimeDurations_1.TimeDurations.hasElapsed(since, duration)) {
                return true;
            }
        }
        return false;
    }
}
//# sourceMappingURL=SplashEngine.js.map