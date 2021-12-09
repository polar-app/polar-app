/**
 * Simple system to working with basic function predicates.
 */
export namespace Predicates {

    export type Predicate<V> = (value: V) => boolean;

    /**
     * Take a predicate and compute it to a 'not' predicate inverting it.
     */
    export function not<V>(predicate: Predicate<V>): Predicate<V> {
        return (value: V) => ! predicate(value);
    }

    export function and<V>(a: Predicate<V>, b: Predicate<V>): Predicate<V> {
        return (value: V) => a(value) && b(value);
    }

    export function or<V>(a: Predicate<V>, b: Predicate<V>): Predicate<V> {
        return (value: V) => a(value) || b(value);
    }

    export function any<V extends string | number>(value: V, accepts: ReadonlyArray<V>) {
        return accepts.includes(value);
    }

}
