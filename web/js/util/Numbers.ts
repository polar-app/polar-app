export class Numbers {

    public static compare(n0: number | undefined, n1: number | undefined) {

        if (n0 === undefined && n1 !== undefined) {
            return -1;
        }

        if (n0 === undefined && n1 === undefined) {
            return 0;
        }

        if (n0 !== undefined && n1 === undefined) {
            return 1;
        }

        return n0! - n1!;

    }

    public static range(start: number, end: number): ReadonlyArray<number> {

        const result = [];

        for (let idx = start; idx <= end; ++idx) {
            result.push(idx);
        }

        return result;

    }

    public static toFixedFloat(input: number, width: number): number {
        return parseFloat(input.toFixed(width));
    }

}
