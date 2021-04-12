import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {StringComparators} from "polar-shared/src/util/StringComparators";
import { TagFilters } from "polar-shared/src/tags/TagFilters";
import {NumberComparators} from "polar-shared/src/util/NumberComparators";
import {Tag} from "polar-shared/src/tags/Tags";

export namespace Sorting {

    export type Order = 'asc' | 'desc';

    /**
     * Convert value from F and to T
     */
    export type TypeConverter<F, T> = (from: F) => T

    export type PrimitiveConverter<V> = (value: V) => number | string;

    export function reverse(order: Order) {
        return order === 'asc' ? 'desc' : 'asc';
    }

    function createComparatorWithOrderBy<F, T>(a: F, b: F,
                                               order: Order,
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

                type TagMap = {[id: string]: Tag};

                const tagMap: TagMap = value;

                // this is sort of a hack and only works because with tags the key
                // is the tag id and there are no other objects we're sorting on.
                return Object.values(tagMap)
                    .filter(TagFilters.onlyRegular)
                    .map(current => current.label.toLowerCase())
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
            // TODO: this is going to slow us down as comparing the orer ech time is not fun.
            return NumberComparators.create(aVal as number, bVal as number, order);
        }

        return StringComparators.comparatorWithEmptyStringsLast(<string> aVal, <string> bVal, order);

    }

    export function createComparator<F, T>(order: Order,
                                           orderBy: keyof T,
                                           converter: TypeConverter<F, T>): (a: F, b: F) => number {

        return (a, b) => createComparatorWithOrderBy<F, T>(a, b, order, orderBy, converter)

    }

    export function stableSort<T>(array: ReadonlyArray<T>, comparator: (a: T, b: T) => number): ReadonlyArray<T> {

        return arrayStream(array)
            .sort(comparator)
            .collect();

    }

}

