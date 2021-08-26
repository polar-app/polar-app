import {arrayStream} from "./ArrayStreams";
import {Tuples} from "./Tuples";
import {DeviceIDManager} from "./DeviceIDManager";

/**
 * Positional Arrays are based on LSeq:
 *
 * LSEQ: an Adaptive Structure for Sequences in DistributedCollaborative Editing
 *
 * The general idea here is that we can implement distributed arrays as CRDT-like stuctures
 * where the keys are the position in a map and the 'array' order is determined by the key.
 *
 * This is a ROUGH approximation of the LSEQ idea but designed for rapid
 * iteration and fewer total keys.
 *
 * https://bartoszsypytkowski.com/operation-based-crdts-arrays-1/
 * https://www.researchgate.net/publication/262162421_LSEQ_an_Adaptive_Structure_for_Sequences_in_Distributed_Collaborative_Editing
 *
 *
 */
export namespace PositionalArrays {

    // FIXME: I think this implementation has the following bugs:
    //
    // If someone tries to delete the first element, and I try to add it then
    // it's possible to compute the same key. We can resolve this by having a
    // local portion so this is impossible since to can't generate teh same
    // code.
    // FIXME: need a local component
    //

    //
    // FIXME: We might want to to think about a tree with all positive integers with an arity of say 10000
    // and a spacing of say 10... then when this is filled up another level of 10000

    /**
     * A Device ID followed by a 20 digit number that marks the position of the item in the array
     */
    export type PositionalArrayKey = string;

    export type PositionalArray<T> = {[position: string /* PositionalArrayPosition */]: T};

    export interface IPositionalArrayPosition<T> {
        readonly pos: number;
        readonly value: T;
    }

    export type PositionalArrayParsedKey = {
        position: string;
        host: string;
    };

    /**
     * An entry in the dictionary.
     */
    export type PositionalArrayEntry<T> = {
        key: PositionalArrayParsedKey,
        value: T
    };
    export type PositionalArrayRawEntry<T> = {
        key: PositionalArrayKey,
        value: T
    };

    const KEY_PARTS_SEPARATOR = ":";

    export function parseKey(key: string): PositionalArrayParsedKey {
        if (key.indexOf(KEY_PARTS_SEPARATOR) > -1) {
            const [host, position] = key.split(KEY_PARTS_SEPARATOR);
            return {host, position};
        }
        return {host: '', position: key};
    }

    export function padPosition(position: number): string {
        const isNegative = position < 0;
        // Check if the number has a decimal dot if so we need to add an extra zero at the start
        // TODO: What if we end up with a number that uses the scientific notation here we might need to convert it first
        const padded = Math.abs(position).toString().padStart(position % 1 ===  0 ? 20 : 21, '0');
        return `${isNegative ? '-' : ''}${padded}`;
    }

    export function generateKey(position: number) {
        return `${DeviceIDManager.DEVICE_ID}${KEY_PARTS_SEPARATOR}${padPosition(position)}`;
    }

    export function create<T>(values?: ReadonlyArray<T>): PositionalArray<T> {

        const result: PositionalArray<T> = {};

        if (values !== undefined) {
            for(const value of values) {
                append(result, value);
            }
        }

        return result;
    }


    export function rawEntries<T>(positionalArray: PositionalArray<T>): ReadonlyArray<PositionalArrayRawEntry<T>> {
        return Object.entries(positionalArray).map(([key, value]) => ({ key, value }));
    }

    export function entries<T>(positionalArray: PositionalArray<T>): ReadonlyArray<PositionalArrayEntry<T>> {
        return Object.entries(positionalArray).map(([key, value]) => ({ key: parseKey(key), value }));
    }

    export function compare<T>(a: PositionalArrayEntry<T>, b: PositionalArrayEntry<T>) {
        return (parseFloat(a.key.position) - parseFloat(b.key.position)) ||
               (a.key.host.localeCompare(b.key.host));
    }

    export function insert<T>(positionalArray: PositionalArray<T>,
                              ref: T,
                              value: T,
                              pos: 'before' | 'after'): PositionalArray<T> {

        const sorted = arrayStream(entries(positionalArray))
            .sort((a, b) => compare(a, b))
            .collect();

        const pointers = arrayStream(Tuples.createSiblings(sorted))
              .sort((a, b) => compare(a.curr, b.curr))
              .collect();

        const ptr = arrayStream(pointers)
              .filter(current => current.curr.value === ref)
              .first();

        if (ptr) {

            const computeKey = () => {

                const base = parseFloat(ptr.curr.key.position);

                const computeDelta = () => {

                    const computeDeltaFromSibling = (entry: PositionalArrayEntry<T> | undefined) => {

                        if (entry !== undefined) {
                            return Math.abs(parseFloat(entry.key.position) - base) / 2;
                        } else {
                            return 1.0;
                        }

                    }

                    switch(pos) {

                        case "before":
                            return computeDeltaFromSibling(ptr.prev) * -1;
                        case "after":
                            return computeDeltaFromSibling(ptr.next);

                    }

                }

                const delta = computeDelta();

                const idx = base + delta;
                return generateKey(idx);

            }

            const key = computeKey();
            positionalArray[key] = value;

            return positionalArray;

        } else {
            throw new Error(`Unable to find reference to ${ref} in: ` + JSON.stringify(positionalArray));
        }

    }

    /**
     * Put a value into the positional array with the exact key position.
     */
    export function put<T>(positionalArray: PositionalArray<T>,
                           key: PositionalArrayKey,
                           value: T): PositionalArray<T> {

        positionalArray[key] = value;
        return positionalArray;

    }

    export function unshift<T>(positionalArray: PositionalArray<T>, value: T): PositionalArray<T> {

        const min
            = arrayStream(entries(positionalArray))
            .sort((a, b) => compare(a, b))
            .map(({ key }) => parseFloat(key.position))
            .first() || 0.0;

        const idx = min - 1.0;

        const key = generateKey(idx);

        positionalArray[key] = value;

        return positionalArray;
    }

    export function append<T>(positionalArray: PositionalArray<T>, value: T): PositionalArray<T> {

        const max
            = arrayStream(entries(positionalArray))
                .sort((a, b) => compare(a, b))
                .map(({ key }) => parseFloat(key.position))
                .last() || 0.0;

        const idx = max + 1.0;

        const key = generateKey(idx);

        positionalArray[key] = value;

        return positionalArray;
    }

    export function remove<T>(positionalArray: PositionalArray<T>, value: T): PositionalArray<T> {

        const key = arrayStream(Object.entries(positionalArray))
                        .filter(current => current[1] === value)
                        .map(current => current[0])
                        .first();

        if (key !== undefined) {
            delete positionalArray[key];
            return positionalArray;
        }

        return positionalArray;

    }

    export function removeKey<T>(positionalArray: PositionalArray<T>, key: PositionalArrayKey): PositionalArray<T> {
        delete positionalArray[key];
        return positionalArray;
    }

    export function clear<T>(positionalArray: PositionalArray<T>) {

        for(const key of Object.keys(positionalArray)) {
            delete positionalArray[key];
        }

    }

    /**
     * Set will take new items, and give them keys that will be unique, then
     * remove the old keys.  This way the set has new values and it's safe from
     * the existing data and can't conflict with anyone.
     */
    export function set<T>(positionalArray: PositionalArray<T>, values: ReadonlyArray<T> | PositionalArray<T>): PositionalArray<T> {

        // FIXME: instead of appending, then removing the existing, it might be
        // better to delete the removed items, then place the added items in the
        // right positions.  This way none of the existing item keys will be
        // changed.

        const convertToArray = (): ReadonlyArray<T> => {

            if (Array.isArray(values)) {
                return values;
            }

            if (typeof values === 'object') {
                return toArray(values as any);
            }

            throw new Error("Unknown values");

        }

        const converted = convertToArray();

        // *** get all of the existing keys so that we can remove them later
        const existing = Object.keys(positionalArray);

        // *** now append all the current ones.
        for (const value of converted) {
            append(positionalArray, value);
        }

        // *** now delete all the existing values...
        for (const key of existing) {
            delete positionalArray[key];
        }

        return positionalArray;

    }

    export function keyForValue<T>(positionalArray: PositionalArray<T>, value: T): PositionalArrayKey | undefined {

        return arrayStream(Object.entries(positionalArray))
            .filter(current => current[1] === value)
            .map(current => current[0])
            .first();

    }

    /**
     * This is needed by the UI so that we can sort base on position.
     */
    export function toArray<T>(positionalArray: PositionalArray<T>): ReadonlyArray<T> {

        return arrayStream(entries(positionalArray))
                     .sort((a, b) => compare(a, b))
                     .collect()
                     .map(({ value }) => value);

    }

}
