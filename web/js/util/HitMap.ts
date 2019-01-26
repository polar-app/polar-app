import {Dictionaries} from "./Dictionaries";

/**
 * Keeps track of hits for a given key...
 */
export class HitMap {

    private index: {[key: string]: HitEntry} = {};

    public registerHit(key: string): number {

        const entry = Dictionaries.computeIfAbsent(this.index, key, () => {
            return {key, value: 0};
        });

        return ++entry.value;

    }

    public registerHits(...keys: string[]) {

        for (const key of keys) {
            this.registerHit(key);
        }

    }


    /**
     * Return the hit index as a map.
     */
    public toMap(): Readonly<{[key: string]: HitEntry}> {
        return Object.freeze({...this.index});
    }

    /**
     * Return the HitMap entries ranked.
     */
    public toRanked(): ReadonlyArray<HitEntry> {

        return Object.values(this.toMap())
            .sort((a, b) => b.value - a.value);

    }

}

interface HitEntry {
    key: string;
    value: number;
}
