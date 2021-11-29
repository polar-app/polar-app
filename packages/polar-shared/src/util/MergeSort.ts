
export namespace MergeSort {

    export type Comparator<T> = (a: T, b: T) => number;

    export function sort<T>(left: ReadonlyArray<T>,
                            right: ReadonlyArray<T>,
                            comparator: Comparator<T>): ReadonlyArray<T> {

        const buff: T[] = [];

        const leftArr = [...left];
        const rightArr = [...right];

        // Break out of loop if any one of the array gets empty
        while (leftArr.length && rightArr.length) {
            const cmp = comparator(left[0], right[0]);

            // Pick the smaller among the smallest element of left and right sub arrays
            if (cmp < 0) {
                buff.push(leftArr.shift()!)
            } else {
                buff.push(rightArr.shift()!)
            }
        }

        // Concatenating the leftover elements
        // (in case we didn't go through the entire left or right array)
        return [ ...buff, ...leftArr, ...rightArr ];
    }

}
