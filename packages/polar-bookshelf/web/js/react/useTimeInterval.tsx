import {Duration, TimeDurations} from "polar-shared/src/util/TimeDurations";
import React from "react";

/**
 * The duration we requested
 */
type DurationMillis = number;

/**
 * The time that we *should* expire which might be slightly different than the wall clock.
 */
type ExpirationTimeMillis = number;

/**
 * The actual wall time that we expired.
 */
type ExpirationTimeWallClockMillis = number;

type TimeIntervalTuple = readonly [ExpirationTimeMillis, ExpirationTimeWallClockMillis, Duration]

export function getTimezoneOffsetMs(): number {
    const tzOffset = new Date().getTimezoneOffset();
    return tzOffset * 60 * 1000 * -1;
}

export function useTimeInterval(duration: Duration): TimeIntervalTuple {

    const [time, setTime] = React.useState<TimeIntervalTuple>(() => {
        const now = Date.now();
        return [now, now, duration];
    });

    const timeoutRef = React.useRef<number | undefined>(undefined);

    const computeDurationForTimeout = React.useCallback((): readonly [ExpirationTimeWallClockMillis, DurationMillis] => {

        const now = Date.now();
        const offsetMs = getTimezoneOffsetMs();
        const nowWithOffset = now + offsetMs;

        const expirationTime = TimeDurations.computeExpirationTime(nowWithOffset, duration);
        const durationMillis =  Math.abs(expirationTime - nowWithOffset);

        return [
            expirationTime - offsetMs,
            durationMillis,
        ];

    }, [duration]);

    const scheduleTimeout = React.useCallback(() => {

        const [expirationTime, duration] = computeDurationForTimeout();

        timeoutRef.current = window.setTimeout(() => {
            setTime([expirationTime, Date.now(), duration]);

            //now reschedule in the future.
            scheduleTimeout();

        }, duration);

    }, [computeDurationForTimeout])

    React.useEffect(() => {

        scheduleTimeout();

        return () => window.clearTimeout(timeoutRef.current);

    }, [computeDurationForTimeout, scheduleTimeout]);

    return time;

}
