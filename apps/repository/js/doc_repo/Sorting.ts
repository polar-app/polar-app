import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export namespace Sorting {

    export type Order = 'asc' | 'desc';


    /**
     * Convert value from F and to T
     */
    export type TypeConverter<F, T> = (from: F) => T

    export function reverse(order: Order) {
        return order === 'asc' ? 'desc' : 'asc';
    }

    function descendingComparator<F, T>(a: F, b: F,
                                        orderBy: keyof T,
                                        converter: TypeConverter<F, T>) {

        const toVal = (value: number | string | any): number | string => {

            if (value === undefined || value === null) {
                return ""
            }

            if (typeof value === 'number' || typeof value === 'string') {
                return value;
            }

            if (orderBy === 'tags') {
                // this is sort of a hack and only works because with tags the key
                // is the tag id and there are no other objects we're sorting on.
                return Object.keys(value)
                    .map(current => current.toLowerCase())
                    .sort()
                    .join(', ');
            }

            function toDictionaryValue() {

                const dict: {[key: string]: any} = value;

                return Object.values(dict)
                    .map(current => current.toString().toLowerCase())
                    .sort()
                    .join(', ');
            }

            return toDictionaryValue();

        };

        const aVal = toVal(<any> converter(a)[orderBy]);
        const bVal = toVal(<any> converter(b)[orderBy]);

        if (typeof aVal === 'number') {
            return <number> bVal - <number> aVal;
        }

        return (<string> bVal).localeCompare(<string> aVal);

    }

    export function getComparator<F, T>(order: Order,
                                        orderBy: keyof T,
                                        converter: TypeConverter<F, T>): (a: F, b: F) => number {

        return order === 'desc'
            ? (a, b) => descendingComparator<F, T>(a, b, orderBy, converter)
            : (a, b) => -descendingComparator<F, T>(a, b, orderBy, converter);

    }

    export function stableSort<T>(array: ReadonlyArray<T>, comparator: (a: T, b: T) => number): ReadonlyArray<T> {

        return arrayStream(array)
            .sort(comparator)
            .collect();

    }

}

