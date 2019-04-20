import {Rule} from './Rule';
import {ISODateTimeString} from '../../../../../web/js/metadata/ISODateTimeStrings';
import {ISODateTimeStrings} from '../../../../../web/js/metadata/ISODateTimeStrings';

/**
 * An engine that should run with facts , against rules, which can emit events.
 *
 * The engine can be event based or poll based and is designed to be very
 * efficient to run just from a few variables.
 */
export class Engine<F, H> {

    private readonly engineState: MutableEngineState<F, H> = {
        facts: this.facts,
        ruleStates: {},
    };

    /**
     *
     * @param facts The facts exposed to all rules in the engine.
     * @param rules The rule map we should execute
     * @param order The order that the rules should be executed.
     * @param eventHandlers The event handlers we should pass to rules.
     */
    constructor(private facts: F,
                private readonly rules: RuleMap<F, H>,
                private readonly order: RuleOrder<F, H>,
                private readonly eventHandlers: H) {

    }

    public run() {



        const {engineState, rules} = this;

        for (const ruleName of this.order) {

            const rule = rules[ruleName];

            const state = engineState.ruleStates[ruleName];

            const result = rule.run(engineState.facts, this.eventHandlers, state);

            // now update the fact and state of this object
            engineState.ruleStates[ruleName] = result[1];

            engineState.facts = result[0];

        }

    }


}

export class RuleMap<F, H> {

    [name: string]: Rule<F, H, any>;

}

export type RuleKeys<F, H> = keyof RuleMap<F, H>;

/**
 * Provide the order of the rules.  This is a bit verbose but Javascript object
 * keys order isn't defined reliably and I want to make sure we never have bugs
 * here.
 */
export type RuleOrder<F, H> = [RuleKeys<F, H>];

interface MutableEngineState<F, H> {

    facts: F;

    /**
     * The states of the individual rules.
     */
    ruleStates: {[id: string]: any};

}

/**
 * The engine state between run which between facts F and handlers H
 */
export interface EngineState<F, H> extends Readonly<MutableEngineState<F, H>> {


}

export type EventHandler = () => void;

export interface EventHandlers {
    readonly [name: string]: EventHandler;
}

export type EventTimes<E extends EventHandlers> = {
    readonly [name in keyof E]: ISODateTimeString | undefined;
};

export interface MutableEvent {
    handler: EventHandler;
    lastExecuted: ISODateTimeString | undefined;
}

export interface Event extends Readonly<MutableEvent> {

}

export type EventMap<E extends EventHandlers> = {
    readonly [name in keyof E]: Event;
};

export class EventMaps {

    public static create<E extends EventHandlers>(handlers: E,
                                                  eventTimes: Partial<EventTimes<E>>): EventMap<E> {

        const result: any = {};

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

}
