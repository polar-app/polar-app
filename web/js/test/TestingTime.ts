
import timekeeper from 'timekeeper';

const time = new Date(1330688329321);

export class TestingTime {

    /**
     * Freeze time for testing at '2012-03-02T11:38:49.321Z'
     */
    public static freeze() {
        timekeeper.freeze(time);
    }

    public static unfreeze() {
        timekeeper.reset();
    }

    public static forward(duration: DurationMS | TimeDuration) {
        timekeeper.freeze(new Date(Date.now() + this.toDurationMS(duration)));
    }

    private static toDurationMS(duration: DurationMS | TimeDuration) {

        if (typeof duration === 'string') {
            return TimeDurations.toMillis(duration);
        } else {
            return duration;
        }

    }

}

export function freeze() {
    TestingTime.freeze();
}

export type DurationMS = number;

/**
 * A time duration which has the following supported suffixes:
 *
 * ms = milliseconds
 * s = seconds
 * m = minutes
 * h = hours
 * d = days
 * w = weeks
 */
export type TimeDuration = string;

export class TimeDurations {

    public static toMillis(duration: TimeDuration): DurationMS {

        const val = parseInt(duration.replace(/[smhw]/g, ""), 10);

        if (duration.endsWith("w")) {
            return val * 7 * 24 * 60 * 60 * 1000;
        } else if (duration.endsWith("d")) {
            return val * 24 * 60 * 60 * 1000;
        } else if (duration.endsWith("h")) {
            return val * 60 * 60 * 1000;
        } else if (duration.endsWith("m")) {
            return val * 60 * 1000;
        } else if (duration.endsWith("s")) {
            return val * 1000;
        } else if (duration.endsWith("ms")) {
            return val;
        } else {
            throw new Error("Unable to parse duration: " + duration);
        }

    }

}
