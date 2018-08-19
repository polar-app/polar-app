
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

    static empty(value?: string): boolean {
        return ! value || value.trim() === "";
    }

}
