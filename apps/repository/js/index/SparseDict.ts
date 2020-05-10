export type ToKeyFunction<K> = (key: K) => string;

export type Predicate<V> = (value: V) => boolean;

/**
 * A dict that is sparse but we can still have empty values.
 */
export class SparseDict<K, V> {

    private backing: { [key: string]: V } = {};

    constructor(private readonly toKey: ToKeyFunction<K>,
                private readonly newValue: (key: K) => V) {
    }

    public read(key: string): V | undefined {
        return this.backing[key] || undefined;
    }

    public get(key: K): V {

        const k = this.toKey(key);

        if (!this.backing[k]) {
            this.backing[k] = this.newValue(key);
        }

        return this.backing[k];

    }

    /**
     * Purge items from the set that match the predicate
     */
    public purge(predicate: Predicate<V>) {

        for (const key of this.keys()) {

            const value = this.backing[key];

            if (value && predicate(value)) {
                delete this.backing[key];
            }

        }

    }

    /**
     * Get with the raw key, no conversion.
     */
    public getWithKey(k: string): V | undefined {
        return this.backing[k] || undefined;
    }

    public keys(): ReadonlyArray<string> {
        return Object.keys(this.backing);
    }

    public values(): ReadonlyArray<V> {
        return Object.values(this.backing);
    }

    public delete(key: string) {
        delete this.backing[key];
    }

}
