import {ISODateTimeString} from '../../../../../web/js/metadata/ISODateTimeStrings';
import {Rule} from './Rule';

/**
 * An engine that should run the facts.
 */
export class Engine<F, H> {


    constructor(private facts: F,
                private rules: ReadonlyArray<Rule<F, H, any>>) {

    }

    public run() {

        // FIXME: we need a way to get the engineState from localStorage on it

        const engineState: MutableEngineState<F, H> = {
            facts: this.facts,
            ruleStates: {},
        };

        for (const rule of this.rules) {

            const state = engineState.ruleStates[rule.id];

            const result = rule.run(engineState.facts, state);

            // now update the fact and state of this object
            engineState.ruleStates[rule.id] = result[1];

            engineState.facts = result[0];

        }

    }


}

export class RuleMap<F, H> {

    [name: string]: Rule<F, H, any>;

}

export type RuleOrder<F, H> = [keyof RuleMap<F, H>];

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

class Foo {
    public readonly foo: string = "foo";
    public readonly bar: string = "bar";
}

type Bar = {
    [name in keyof Foo]: string;
};

const bar: Bar = {
    foo: "foo",
    bar: "bar"
};


