/**
 * A rule accepts facts and determines if it should run and then emits a
 * new facts object.
 */
interface Rule<F> {

    /**
     * True if this rule accepts that it should run given the facts.
     */
    accept(facts: F): boolean;

    /**
     * Execute the rule and return new a new facts object.
     *
     */
    run(facts: F): F;

}
