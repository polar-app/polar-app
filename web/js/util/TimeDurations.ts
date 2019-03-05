
export class TimeDurations {

    public static toMillis(duration: DurationStr): DurationMS {

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

    /**
     * Compute a random duration based on the given duration.
     * @param duration
     */
    public static toRandom(duration: DurationStr): DurationMS {

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
    public static hasElapsed(since: Date, duration: DurationStr, now: Date = new Date()) {

        const durationMS = this.toMillis(duration);

        const nowMS = now.getTime();

        const cutoffMS = since.getTime() + durationMS;

        return (nowMS > cutoffMS);

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

