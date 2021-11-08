export interface Multimap<K, V> {
    clear(): void;
    containsKey(key: K): boolean;
    containsValue(value: V): boolean;
    containsEntry(key: K, value: V): boolean;
    delete(key: K, value?: V): boolean;
    entries: ReadonlyArray<MultimapEntry<K, V>>;
    get(key: K): ReadonlyArray<V>;
    keys(): ReadonlyArray<K>;
    put(key: K, value: V): ReadonlyArray<MultimapEntry<K, V>>;
}

/**
 * Multimap backed by an simple array.
 */
export class ArrayListMultimap<K, V> implements Multimap<K, V> {

    private backing: Array<MultimapEntry<K, V>> = [];

    public clear(): void {
        this.backing = [];
    }

    public containsKey(key: K): boolean {
        return this.backing
            .filter(entry => entry.key === key)
            .length > 0;
    }

    public containsValue(value: V): boolean {
        return this.backing
            .filter(entry => entry.value === value)
            .length > 0;
    }

    public containsEntry(key: K, value: V): boolean {
        return this.backing
            .filter(entry => entry.key === key && entry.value === value)
            .length > 0;
    }

    public delete(key: K, value?: V, filter?: (val: V) => boolean): boolean {
        const temp = this.backing;
        this.backing = this.backing
            .filter(entry => {

                if (value) {
                    return entry.key !== key || entry.value !== value;
                }

                if (filter) {
                    return entry.key !== key || ! filter(entry.value);
                }

                return entry.key !== key;
            });

        return temp.length !== this.backing.length;

    }

    public get entries(): ReadonlyArray<MultimapEntry<K, V>> {
        return this.backing;
    }

    public get(key: K): V[] {
        return this.backing
            .filter(entry => entry.key === key)
            .map(entry => entry.value);
    }

    public keys(): ReadonlyArray<K> {
        return Array.from(new Set(this.backing.map(entry => entry.key)));
    }

    public put(key: K, value: V): ReadonlyArray<MultimapEntry<K, V>> {
        this.backing.push({key, value});
        return this.backing;
    }

    public putAll(key: K, values: ReadonlyArray<V>) {

        for (const value of values) {
            this.put(key, value);
        }

    }

}

export type HashMultimapEntry<V> = [string , ReadonlyArray<V>];

export class HashMultimap<K extends string, V extends Exclude<any, null | undefined>> {

    private backing: {[key: string]: V[]} = {}

    public clear(): void {
        this.backing = {};
    }

    public containsKey(key: K): boolean {
        return this.backing[key] !== null;
    }

    /**
     * This is O(N) as it has to scan all the valus.
     */
    public containsValue(value: V): boolean {

        for(const entry of Object.entries(this.backing)) {

            const [, entryValue] = entry;

            for(const currentValue of entryValue) {
                if (currentValue === value) {
                    return true;
                }
            }

        }

        return false;

    }

    public containsEntry(key: K, value: V): boolean {

        const entry = this.backing[key];

        if (! entry) {
            return false;
        }

        for(const current of entry) {
            if (current === value) {
                return true;
            }
        }

        return false;

    }

    public delete(key: K, value?: V): boolean {

        const lenBefore = (this.backing[key] || []).length;

        if (key && value) {
            this.backing[key] = this.backing.key.filter(current => current !== value);
        } else {
            delete this.backing[key];
        }

        const lenAfter = (this.backing[key] || []).length;

        return lenAfter !== lenBefore;

    }

    public get(key: K): ReadonlyArray<V> {

        const entry = this.backing[key];
        return entry || [];

    }

    public keys(): ReadonlyArray<K> {
        return Object.keys(this.backing) as unknown as ReadonlyArray<K>;
    }

    public put(key: string, value: V): ReadonlyArray<V> {

        if (this.backing[key]) {
            this.backing[key] = [...this.backing[key], value];
        } else {
            this.backing[key] = [value];
        }

        return this.backing[key];

    }

    public entries(): ReadonlyArray<HashMultimapEntry<V>> {
        return Object.entries(this.backing);
    }

    public putAll(key: K, values: ReadonlyArray<V>) {

        if (! Array.isArray(values)) {
            throw new Error("values not array")
        }

        for (const value of values) {
            this.put(key, value);
        }

    }


}

export interface MultimapEntry<K, V> {
    readonly key: K,
    readonly value: V;
}
