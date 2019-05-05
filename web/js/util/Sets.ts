/**
 * Set theoretic operations for Typescript arrays.
 */
export class Sets {

    /**
     * Difference (a \ b): create a set that contains those elements of set a
     * that are not in set b
     *
     */
    public static difference<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): ReadonlyArray<T> {
        return a.filter(x => ! b.includes(x));
    }

    public static union<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): ReadonlyArray<T> {

        const set = new Set<T>();
        a.forEach( current => set.add(current));
        b.forEach( current => set.add(current));
        return Array.from(set);

    }

    public static intersection<T>(left: ReadonlyArray<T>, right: ReadonlyArray<T>): ReadonlyArray<T> {

        const a = new Set(left);
        const b = new Set(right);
        const intersection = new Set(
            [...a].filter(x => b.has(x)));

        return Array.from(intersection);

    }

    public static toSet<T>(arr: T[]): Set<T> {

        const set = new Set<T>();

        arr.forEach(current => set.add(current));

        return set;

    }

}
