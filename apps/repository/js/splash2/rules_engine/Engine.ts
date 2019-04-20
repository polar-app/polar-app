import {ISODateTimeString} from '../../../../../web/js/metadata/ISODateTimeStrings';
import {Rule} from './Rule';

/**
 * An engine that should run the facts.
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

/**
 * The times the last events were shown.
 */
export interface EventTimes {
    readonly whatsNew?: ISODateTimeString;
}

export interface Event<T> {
    lastExecuted?: ISODateTimeString;
    handler: (input?: T) => void;
}

/**
 * Stores just the event event handlers code by name with no actual
 * metadata and we can only map to a void function with at most one
 * argument.
 */
export interface EventHandlers {
    [name: string]: <T>(input?: T) => void;
}

/**
 * The raw mapped types with metadata about their execution time.
 */
export type EventStates<H> = {
    [name in keyof H]: (<T>(input?: T) => void) | undefined;
};

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
