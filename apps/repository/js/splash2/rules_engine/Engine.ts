import {Rule} from './Rule';
import {ISODateTimeString} from '../../../../../web/js/metadata/ISODateTimeStrings';
import {ISODateTimeStrings} from '../../../../../web/js/metadata/ISODateTimeStrings';
import {isPresent} from '../../../../../web/js/Preconditions';
import {Reducers} from '../../../../../web/js/util/Reducers';


export type EventHandler = () => void;

export interface EventHandlers {
    readonly [name: string]: EventHandler;
}

/**
 * An engine that should run with facts , against rules, which can emit events.
 *
 * The engine can be event based or poll based and is designed to be very
 * efficient to run just from a few variables.
 */
export class Engine<F, H extends EventHandlers> {

    private readonly engineState: MutableEngineState<F, H>;

    private readonly eventMap: MutableEventMap<H>;
    /**
     *
     * @param facts The facts exposed to all rules in the engine.
     * @param rules The rule map we should execute
     * @param eventHandlers The event handlers we should pass to rules.
     */
    constructor(private facts: F,
                private readonly rules: RuleMap<F, H>,
                private readonly eventHandlers: H) {

        this.engineState = {
            facts: this.facts,
            ruleStates: {},
        };

        this.eventMap = EventMaps.create(this.eventHandlers, {});

    }

    public run() {

        const {engineState, rules, eventMap} = this;

        const ruleNames = Object.getOwnPropertyNames(this.rules);

        for (const ruleName of ruleNames) {

            const rule = rules[ruleName];

            const state = engineState.ruleStates[ruleName];

            const result = rule.run(engineState.facts, eventMap, state);

            // now update the fact and state of this object
            engineState.ruleStates[ruleName] = result[1];

            engineState.facts = result[0];

        }

    }

}

export class RuleMap<F, H extends EventHandlers> {

    [name: string]: Rule<F, H, any>;

}

export type RuleKeys<F, H extends EventHandlers> = keyof RuleMap<F, H>;

/**
 * Provide the order of the rules.  This is a bit verbose but Javascript object
 * keys order isn't defined reliably and I want to make sure we never have bugs
 * here.
 */
export type RuleOrder<F, H extends EventHandlers> = [RuleKeys<F, H>];

interface MutableEngineState<F, H extends EventHandlers> {

    facts: F;

    /**
     * The states of the individual rules.
     */
    ruleStates: {[id: string]: any};

}

/**
 * The engine state between run which between facts F and handlers H.
 */
export interface ExternalEngineState<F, H extends EventHandlers> extends Readonly<MutableEngineState<F, H>> {

    /**
     *
     */
    readonly eventTimes: Partial<EventTimes<H>>;


}

export type MutableEventTimes<E extends EventHandlers> = {
    [name in keyof E]: ISODateTimeString | undefined;
};

export type EventTimes<E extends EventHandlers> = Readonly<MutableEventTimes<E>>;

export interface MutableEvent {
    handler: EventHandler;
    lastExecuted: ISODateTimeString | undefined;
}

export interface Event extends Readonly<MutableEvent> {

}

export type MutableEventMap<E extends EventHandlers> = {
    [name in keyof E]: Event;
};

export type EventMap<E extends EventHandlers> = Readonly<MutableEventMap<E>>;

export class EventMaps {

    public static create<E extends EventHandlers>(handlers: E,
                                                  eventTimes: Partial<EventTimes<E>>): EventMap<E> {

        const result: MutableEventMap<E> = <any> {};

        for (const handlerName of Object.keys(handlers)) {

            const handler = handlers[handlerName];

            const lastExecuted: ISODateTimeString | undefined = eventTimes[handlerName];

            const event: MutableEvent = {
                handler: () => {
                    event.lastExecuted = ISODateTimeStrings.create();
                    handler();
                },
                lastExecuted
            };

            result[handlerName] = event;

        }

        return result;

    }

    public static toEventTimes<E extends EventHandlers>(eventMap: EventMap<E>): EventTimes<E> {

        const result: MutableEventTimes<E> = <any> {};

        for (const eventName of Object.keys(eventMap)) {
            const event = eventMap[eventName];
            result[eventName] = event.lastExecuted;
        }

        return result;

    }
    public static earliestExecution<E extends EventHandlers>(eventMap: EventMap<E>): ISODateTimeString | undefined {

        const eventTimes = EventMaps.toEventTimes(eventMap);

        return Object.values(eventTimes)
                .filter(current => isPresent(current))
                .sort()
                .reduce(Reducers.FIRST, undefined);

    }

}
