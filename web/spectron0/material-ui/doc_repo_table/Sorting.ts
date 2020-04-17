import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {

    // const toVal = (value: number | string | ReadonlyArray<string>): number | string => {
    //
    //     if (typeof value ==='array') {
    //         return value.join(', ');
    //     }
    //
    //     return value;
    //
    // };
    //
    // const aVal = toVal(a[orderBy]);
    // const bVal = toVal(b[orderBy]);

    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
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
