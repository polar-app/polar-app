

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


    /**
     * Convert the string to a number or return the default value.
     */
    public static toNumber(value: string | null | undefined,
                           defaultValue: number) {

        // don't use type cooercion as the rules are insane.

        if (value && value.match(/^[0-9]+$/)) {
            return parseInt(value, 10);
        }

        return defaultValue;

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

    public static indent(text: string, padding: string) {
        text = padding + text;
        text = text.replace(/\n/g, "\n" + padding);
        return text;
    }

}

export type HTMLStr = string;

/**
 * A string representing a URL (file URL or HTTP URL or blob URL)
 */
export type URLStr = string;

/**
 * A string representing a local file path.
 */
export type PathStr = string;

/**
 * A string whichi can contain a URL or a path.  Anything without a scheme
 * prefix is assumed to be a path.
 */
export type PathOrURLStr = string;
