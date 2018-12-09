

export class Strings {

    public static toPrimitive(value: string): string | number | boolean {

        if (value === "true" || value === "false") {
            return value === "true";
        }

        if (value.match(/^[0-9]+$/)) {
            return parseInt(value, 10);
        }

        if (value.match(/^[0-9]+\.[0-9]+$/)) {
            return parseFloat(value);
        }

        return value;

    }

    public static empty(value: string | null | undefined): boolean {
        return value === null || value === undefined || value.trim() === "";
    }

    public static filterEmpty(value: string | null | undefined): string | undefined {

        if (this.empty(value)) {
            return undefined;
        }

        return value!;

    }

    public static lpad = function(str: string | number, padd: string, length: number) {

        if (typeof str === 'number') {
            str = `${str}`;
        }

        while (str.length < length) {
            str = padd + str;
        }

        return str;

    };

    public static toUnixLineNewLines(str: string) {
        return str.replace(/\r\n/g, '\n');
    }

}
