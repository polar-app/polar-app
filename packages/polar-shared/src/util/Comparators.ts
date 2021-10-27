export namespace Comparators {

    export type Comparator<C> = (a: C, b: C) => number;

    /**
     * Create a chain of comparators where, if a comparator is tied, we use the
     * next comparator in the list.
     */
    export function chain<C>(primary: Comparator<C>, ...additional: ReadonlyArray<Comparator<C>>): Comparator<C> {

        const comparators = [primary, ...additional];

        return (a, b) => {

            let diff = 0;

            for(const comparator of comparators) {
                diff = comparator(a, b);
                if (diff !== 0) {
                    return diff;
                }
            }

            return diff;

        }

    }

}
