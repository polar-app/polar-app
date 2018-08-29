
export class Strings {

    static toPrimitive(value: string): string | number | boolean {

        if (value === "true" || value === "false") {
            return value === "true";
        }

        if (value.match(/^[0-9]+$/)) {
            return parseInt(value);
        }

        if (value.match(/^[0-9]+\.[0-9]+$/)) {
            return parseFloat(value);
        }

        return value;

    }

    static empty(value: string | null | undefined): boolean {
        return value === null || value === undefined || value.trim() === "";
    }

    static lpad = function(str: string, padd: string, length: number) {

        while (str.length < length)
            str = padd + str;

        return str;

    }

}
