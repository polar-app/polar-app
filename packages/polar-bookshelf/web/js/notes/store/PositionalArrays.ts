import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Tuples} from "polar-shared/src/util/Tuples";

export namespace PositionalArrays {

    /**
     * A number encoded as an string that can be used to place something into a
     * positional array.
     */
    export type PositionalArrayPositionStr = string;

    export type PositionalArray<T> = Readonly<{[position: string /* PositionalArrayPosition */]: T}>;

    export interface IPositionalArrayPosition<T> {
        readonly pos: number;
        readonly value: T;
    }

    /**
     * An entry in the dictionary.
     */
    type PositionalArrayEntry<T> = [string, T];

    export function entries<T>(positionalArray: PositionalArray<T>): ReadonlyArray<PositionalArrayEntry<T>> {
        return Object.entries(positionalArray);
    }

    export function insert<T>(positionalArray: PositionalArray<T>,
                              ref: T,
                              value: T,
                              pos: 'before' | 'after'): PositionalArray<T> {

        const ptr = arrayStream(Tuples.createSiblings(entries(positionalArray)))
              .filter(current => current.curr[1] === ref)
              .first();

        if (ptr) {

            const computeKey = () => {

                const base = parseFloat(ptr.curr[0]);

                const computeDelta = () => {

                    const computeDeltaFromSibling = (entry: PositionalArrayEntry<T> | undefined) => {
                        return entry ? Math.abs(parseFloat(entry[0]) - base) : 1.0
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
                return `${idx}`;

            }

            const key = computeKey();
            const tmp = {...positionalArray};
            tmp[key] = value;

            return tmp;

        } else {
            throw new Error("Unable to find reference");
        }

    }

    export function append<T>(positionalArray: PositionalArray<T>, value: T): PositionalArray<T> {

        const max
            = arrayStream(Object.keys(positionalArray))
                .map(parseFloat).first() || 0.0;

        const idx = max + 1.0;

        const key = `${idx}`;

        const result = {
            ...positionalArray,
        }

        result[key] = value;

        return result;
    }

    export function remove<T>(positionalArray: PositionalArray<T>, value: T): PositionalArray<T> {

        const key = arrayStream(Object.entries(positionalArray))
                        .filter(current => current[1] === value)
                        .map(current => current[0])
                        .first();

        if (key !== undefined) {
            const tmp = {...positionalArray};
            delete tmp[key];
            return tmp;
        }

        return positionalArray;

    }

    /**
     * This is needed by the UI so that we can sort base on position.
     */
    export function toArray<T>(positionalArray: PositionalArray<T>): ReadonlyArray<T> {

        const toPosition = (entry: PositionalArrayEntry<T>): IPositionalArrayPosition<T> => {
            return {
                pos: parseFloat(entry[0]),
                value: entry[1]
            }
        }

        return Object.entries(positionalArray)
                     .map(toPosition)
                     .sort((a,b) => a.pos - b.pos)
                     .map(current => current.value);

    }

}
