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

}
