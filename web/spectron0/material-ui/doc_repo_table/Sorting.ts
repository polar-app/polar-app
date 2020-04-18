import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export namespace Sorting {

    export type Order = 'asc' | 'desc';

    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {

        const toVal = (value: number | string | any): number | string => {

            if (typeof value === 'number' || typeof value === 'string') {
                return value;
            }

            // this is sort of a hack and only works because with tags the key
            // is the tag id and there are no other objects we're sorting on.
            return Object.keys(value)
                    .map(current => current.toLowerCase())
                    .sort()
                    .join(', ');

        };

        const aVal = toVal(<any> a[orderBy]);
        const bVal = toVal(<any> b[orderBy]);

        if (typeof aVal === 'number') {
            return <number> bVal - <number> aVal;
        }

        return (<string> bVal).localeCompare(<string> aVal);

    }

    export function getComparator(order: Order,
                                  orderBy: string): (a: { [key: string]: any},
                                                     b: { [key: string]: any}) => number {

        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);

    }

    export function stableSort<T>(array: ReadonlyArray<T>, comparator: (a: T, b: T) => number): ReadonlyArray<T> {

        return arrayStream(array)
            .sort(comparator)
            .collect();

    }

}

