/**
 * Set theoretic operations for Typescript arrays.
 */
export class Sets {

    /**
     * Difference (a \ b): create a set that contains those elements of set a
     * that are not in set b
     *
     */
    static difference<T>(a: T[], b: T[]): T[] {

        return a.filter(x => ! b.includes(x));

    }

}
