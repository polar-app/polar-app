"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventMaps = exports.RuleMap = exports.Engine = void 0;
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Reducers_1 = require("polar-shared/src/util/Reducers");
class Engine {
    constructor(facts, rules, eventHandlers, externalEngineState) {
        this.facts = facts;
        this.rules = rules;
        this.eventHandlers = eventHandlers;
        this.externalEngineState = externalEngineState;
        const defaultRuleStates = () => {
            if (externalEngineState) {
                return externalEngineState.ruleStates;
            }
            return {};
        };
        const defaultEventTimes = () => {
            if (externalEngineState) {
                return externalEngineState.eventTimes;
            }
            return {};
        };
        this.engineState = {
            ruleStates: defaultRuleStates(),
        };
        this.eventMap = EventMaps.create(this.eventHandlers, defaultEventTimes());
    }
    run() {
        const { engineState, rules, eventMap } = this;
        const ruleNames = Object.getOwnPropertyNames(this.rules);
        for (const ruleName of ruleNames) {
            const rule = rules[ruleName];
            const state = engineState.ruleStates[ruleName];
            const result = rule.run(this.facts, eventMap, state);
            engineState.ruleStates[ruleName] = result[1];
            this.facts = result[0];
        }
    }
    toExternalEngineState() {
        return Object.assign(Object.assign({}, this.engineState), { eventTimes: EventMaps.toEventTimes(this.eventMap) });
    }
    getFacts() {
        return this.facts;
    }
}
exports.Engine = Engine;
class RuleMap {
}
exports.RuleMap = RuleMap;
class EventMaps {
    static create(handlers, eventTimes) {
        const result = {};
        for (const handlerName of Object.keys(handlers)) {
            const handler = handlers[handlerName];
            const lastExecuted = eventTimes[handlerName];
            const event = {
                handler: () => {
                    event.lastExecuted = ISODateTimeStrings_1.ISODateTimeStrings.create();
                    handler();
                },
                lastExecuted
            };
            result[handlerName] = event;
        }
        return result;
    }
    static toEventTimes(eventMap) {
        const result = {};
        for (const eventName of Object.keys(eventMap)) {
            const event = eventMap[eventName];
            result[eventName] = event.lastExecuted;
        }
        return result;
    }
    static toLastExecutedTimes(eventMap) {
        const eventTimes = EventMaps.toEventTimes(eventMap);
        return Object.values(eventTimes)
            .filter(current => Preconditions_1.isPresent(current))
            .map(current => current)
            .sort();
    }
    static earliestExecution(eventMap) {
        const times = [...this.toLastExecutedTimes(eventMap)];
        return times.reduce(Reducers_1.Reducers.FIRST, undefined);
    }
    static latestExecution(eventMap) {
        const times = [...this.toLastExecutedTimes(eventMap)];
        const result = times.reduce(Reducers_1.Reducers.LAST, undefined);
        return result;
    }
}
exports.EventMaps = EventMaps;
//# sourceMappingURL=Engine.js.map