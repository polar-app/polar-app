import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export namespace PositionalArrays {

    /**
     * A number encoded as an string that can be used to place something into a
     * positional array.
     */
    export type PositionalArrayPositionStr = string;

    export type PositionalArray<T> = Readonly<{[position: string /* PositionalArrayPosition */]: T}>;

    // FIXME: insert with 'before' and 'after'
    // FIXME: delete vy value...

    export interface IPositionalArrayPosition<T> {
        readonly pos: number;
        readonly value: T;
    }

    /**
     * An entry in the dictionary.
     */
    type PositionalArrayEntry<T> = [string, T];

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
