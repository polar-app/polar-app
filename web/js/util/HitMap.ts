import {Dictionaries} from "./Dictionaries";
import {Reducers} from "./Reducers";
import {Multimap} from './Multimap';

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

    public toPercRanked(total?: number): ReadonlyArray<PercRankedEntry> {

        const ranked = this.toRanked();

        if (total === undefined) {
            total = Object.values(ranked)
                .map(current => current.value)
                .reduce(Reducers.SUM, 0);

        }

        let idx = 1;
        return ranked.map(current => {

            return {
                idx: idx++,
                key: current.key,
                hits: current.value,
                perc: Math.floor((current.value / total!)  * 100)
            };

        });

    }

}

/**
 * A HitMap impl that uses a Multimap to keep the values as well for reporting.
 */
// export class MultiHitMap {
//
//     private backing: Multimap
//
// }

interface HitEntry {
    key: string;
    value: number;
}

interface PercRankedEntry {
    idx: number;
    key: string;
    hits: number;
    perc: number;
}
