import {ISODateTimeString, ISODateTimeStrings} from '../metadata/ISODateTimeStrings';
import {Preconditions} from '../Preconditions';

export class TimeDurations {

    public static toMillis(duration: Duration): DurationMS {

        if (typeof duration === 'number') {
            // we're done as this is already a number.
            return duration;
        }

        const sign = duration.startsWith('-') ? -1 : 1;

        duration = duration.replace(/^-/, "");

        const val = parseInt(duration.replace(/[smhw]/g, ""), 10);

        // TODO: I don't think we handle 1m30s right now.

        // TODO: would be nice to only accept a limited vocabulary so I could have
        // type checking work. I could take the durations as varargs like

        // '1m', '30s' and sum them.

        if (duration.endsWith("w")) {
            return sign * val * 7 * 24 * 60 * 60 * 1000;
        } else if (duration.endsWith("d")) {
            return sign * val * 24 * 60 * 60 * 1000;
        } else if (duration.endsWith("h")) {
            return sign * val * 60 * 60 * 1000;
        } else if (duration.endsWith("m")) {
            return sign * val * 60 * 1000;
        } else if (duration.endsWith("s")) {
            return sign * val * 1000;
        } else if (duration.endsWith("ms")) {
            return sign * val;
        } else {
            throw new Error("Unable to parse duration: " + duration);
        }

    }

    // TODO: still need a solution for format()
    // public static format(duration: Duration) {
    //
        // https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss

        // const durationMS = this.toMillis(duration);
        //
        // const date = new Date();
        // // date.setSeconds(durationMS / 1000); // specify value for SECONDS here
        // date.setMilliseconds(durationMS);
        // // return date.toISOString().substr(11, 8);
        // return date.toISOString();
    //
    // }

    /**
     * Compute a random duration based on the given duration.
     * @param duration
     */
    public static toRandom(duration: Duration): DurationMS {

        const durationMS = this.toMillis(duration);

        return Math.random() * durationMS;

    }

    /**
     * Return true if the amount of time in the given duration has elapsed
     * since the given date.
     *
     *
     * @param since
     * @param duration
     */
    public static hasElapsed(since: Date, duration: Duration, now: Date = new Date()) {

        const durationMS = this.toMillis(duration);

        const nowMS = now.getTime();

        const cutoffMS = since.getTime() + durationMS;

        return (nowMS > cutoffMS);

    }

    public static inWeeks(since: Date | ISODateTimeString, now: Date = new Date()) {

        if (typeof since === 'string') {
            since = ISODateTimeStrings.parse(since);
        }

        Preconditions.assert(since, value => value instanceof Date, "since not Date");

        const delta = now.getTime() - since.getTime();

        const nrWeeks = Math.floor(delta / this.toMillis('1w'));

        return `${nrWeeks}w`;

    }

}

/**
 * A duration in milliseconds
 */
export type DurationMS = number;

/**
 * A time duration string which has the following supported suffixes:
 *
 * ms = milliseconds
 * s = seconds
 * m = minutes
 * h = hours
 * d = days
 * w = weeks
 */
export type DurationStr = string;

/**
 * A duration in either a string form or just raw MS.
 */
export type Duration = DurationStr | DurationMS;
