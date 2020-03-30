import {Sets} from "polar-shared/src/util/Sets";

/**
 * Keeps an index of our tag and the keys within this tag so that add/remove
 * is idempotent.
 */
export class StringSet {

    private keys = new Set<string>();

    public add(key: string) {
        this.keys.add(key);
    }

    public set(keys: ReadonlyArray<string>) {
        this.keys = new Set<string>();

        for (const key of keys) {
            this.add(key);
        }
    }

    public delete(key: string) {
        this.keys.delete(key);
    }

    public count() {
        return this.keys.size;
    }

    public toArray() {
        return Sets.toArray(this.keys);
    }

}
