export class Sets {

    public static mergedSets<T>(...sets: ReadonlyArray<ReadonlySet<T>>): ReadonlySet<T> {

        const result = new Set<T>();

        for (const set of sets) {
            for (const value of set.values()) {
                result.add(value);
            }
        }

        return result;

    }

    public static mergedArrays<T>(...arrays: ReadonlyArray<ReadonlyArray<T>>): ReadonlySet<T> {

        const result = new Set<T>();

        for (const arr of arrays) {
            for (const value of arr) {
                result.add(value);
            }
        }

        return result;

    }

    public static toArray<T>(set: ReadonlySet<T>): ReadonlyArray<T> {

        const result: readonly T[] = [];

        for (const value of set.values()) {
            result.push(value);
        }

        return result;

    }

}
