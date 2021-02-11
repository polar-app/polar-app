export class SortFunctions {

    public static compareWithEmptyStringsLast<V>(a: V, b: V, formatter: (value: V) => string): number {

        const strA = formatter(a);
        const strB = formatter(b);

        if (strA === '' || strB === '') {

            if (strA === '' && strB === '') {
                return 0;
            } else if (strA === "") {
                return 1;
            } else {
                return -1;
            }

        }

        return strA.localeCompare(strB);

    }

}
