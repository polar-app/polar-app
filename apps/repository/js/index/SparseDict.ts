/**
 * A dict that is sparse but we can still have empty values.
 */
export class SparseDict<K, V> {

    private backing: { [key: string]: V } = {};

    constructor(private readonly toKey: (key: K) => string,
                private readonly newValue: (key: K) => V) {
    }

    public get(key: K): V {

        const k = this.toKey(key);

        if (!this.backing[k]) {
            this.backing[k] = this.newValue(key);
        }

        return this.backing[k];

    }

    /**
     * Get with the raw key, no conversion.
     */
    public getWithKey(k: string): V | undefined {
        return this.backing[k] || undefined;
    }

    public values(): ReadonlyArray<V> {
        return Object.values(this.backing);
    }

    public delete(key: string) {
        delete this.backing[key];
    }

}
