import {Strings} from '../util/Strings';
import {DurationStr, TimeDurations} from '../util/TimeDurations';

export type ISODateTimeString = string;

/**
 * An ISO Date string without a time.
 */
export type ISODateString = string;

/**
 * Time represented as the number of milliseconds since Jan 1, 1970.
 */
export type UnixTimeMS = number;

export class ISODateTimeStrings {

    public static create(date?: Date): ISODateTimeString {

        if (!date) {
            date = new Date();
        }

        return date.toISOString();
    }

    public static adjust(datetime: ISODateTimeString, durationStr: DurationStr) {

        const date = this.parse(datetime);

        const unixtimeMs = date.valueOf() - TimeDurations.toMillis(durationStr);

        return this.create(new Date(unixtimeMs));

    }

    public static toISODateString(date: Date): ISODateString {

        const ordYear = date.getUTCFullYear();
        const ordMonth = date.getUTCMonth() + 1;
        const ordDay = date.getUTCDate();

        const year = Strings.lpad(ordYear, '0', 4);
        const month = Strings.lpad(ordMonth, '0', 2);
        const day = Strings.lpad(ordDay, '0', 2);

        return `${year}-${month}-${day}`;

    }

    public static parse(value: string): Date {
        return new Date(Date.parse(value));
    }

    public static toUnixTimeMS(value: string): UnixTimeMS {
        return Date.parse(value);
    }

    public static toISODate(input: ISODateTimeString): ISODateString {
        return input.substring(0, '0000-00-00'.length);
    }

    public static toISOYear(input: ISODateTimeString): ISODateString {
        return input.substring(0, '0000'.length);
    }

}

