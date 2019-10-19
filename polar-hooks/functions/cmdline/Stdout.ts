export class Stdout {

    /**
     * Print a formatted record output.
     */
    public static report(value: ReadonlyArray<object> | object | string | undefined) {

        if (typeof value === 'string' || value === undefined) {
            console.log(value);
        } else {
            console.log(JSON.stringify(value, null, "  "));
        }

    }

}
