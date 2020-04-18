import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {

    const toVal = (value: number | string | ReadonlyArray<string>): number | string => {

        if (typeof value === 'number' || typeof value === 'string') {
            return value;
        }

        return Object.values(value)
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

    // FIXME: make sure I can sort by tag

    // TODO: this is kind of ugly in that it specifices a NEGATIVE value andit's
    // not completely clear.

    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);

}

export function stableSort<T>(array: ReadonlyArray<T>, comparator: (a: T, b: T) => number): ReadonlyArray<T> {

    return arrayStream(array)
        .sort(comparator)
        .collect();

    //
    //
    // const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    // stabilizedThis.sort((a, b) => {
    //     const order = comparator(a[0], b[0]);
    //     if (order !== 0) return order;
    //     return a[1] - b[1];
    // });
    // return stabilizedThis.map((el) => el[0]);
}
