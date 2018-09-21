
export type ISODateTimeString = string;

/**
 * Time represented as the number of milliseconds since Jan 1, 1970.
 */
export type UnixTimeMS = number;

export class ISODateTimeStrings {

    public static create(): ISODateTimeString {
        return new Date().toISOString();
    }

    public static parse(value: string): Date {
        return new Date(Date.parse(value));
    }

    public static toUnixTimeMS(value: string): UnixTimeMS {
        return Date.parse(value);
    }

}

