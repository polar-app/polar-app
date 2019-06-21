/**
 * Set theoretic operations for Typescript arrays.
 */
export class SetArrays {

    /**
     * Difference (a \ b): create a set that contains those elements of set a
     * that are not in set b
     *
     */
    public static difference<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): ReadonlyArray<T> {
        return a.filter(x => ! b.includes(x));
    }

    /**
     * Compute a union of all the given sets.
     */
    public static union<T>(...arrays: ReadonlyArray<ReadonlyArray<T>>): ReadonlyArray<T> {

        const set = new Set<T>();

        for (const arr of arrays) {
            arr.forEach( current => set.add(current));
        }

        return Array.from(set);

    }

    public static intersection<T>(left: ReadonlyArray<T>, right: ReadonlyArray<T>): ReadonlyArray<T> {

        const a = new Set(left);
        const b = new Set(right);

        const intersection = new Set(
            [...a].filter(x => b.has(x)));

        return Array.from(intersection);

    }

    public static toSet<T>(arr: ReadonlyArray<T>): Set<T> {

        const set = new Set<T>();

        arr.forEach(current => set.add(current));

        return set;

    }

}
