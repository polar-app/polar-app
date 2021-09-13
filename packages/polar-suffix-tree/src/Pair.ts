/**
 * A private class used to return a tuples of two elements
 */
export class Pair<A, B> {

    constructor(public readonly a: A,
                public readonly b: B) {

    }

    public getFirst() {
        return this.a;
    }

    public getSecond() {
        return this.b;
    }
}
