/**
 * A rule accepts facts and determines if it should run and then emits a
 * new facts object.
 */
export interface Rule<F, H, S> {

    readonly id: RuleID;

    /**
     * Execute the rule and return new a new facts object. If the rule doesn't
     * wish to perform any actions just return the facts without mutation.
     *
     */
    run(facts: F, eventHandlers: H, state?: S): RuleFactPair<F, S>;

}

export type RuleFactPair<F, S> = [F, S];

/**
 * Rule ID string.  All lowercase with hyphen supported.
 */
export type RuleID = string;
