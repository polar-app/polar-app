
export class TimeDurations {

    public static toMillis(duration: DurationStr): DurationMS {

        const sign = duration.startsWith('-') ? -1 : 1;

        duration = duration.replace(/^-/, "");

        const val = parseInt(duration.replace(/[smhw]/g, ""), 10);

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

    public static hasExceeded(since: Date, duration: DurationStr) {

        const durationMS = this.toMillis(duration);

        return ((Date.now() + durationMS) > since.getTime());

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

