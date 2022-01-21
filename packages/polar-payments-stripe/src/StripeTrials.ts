import {Duration, TimeDurations} from "polar-shared/src/util/TimeDurations";

export namespace StripeTrials {

    /**
     * Function to compute the end of a trail that's compatible with stripe.
     */
    export function computeTrialEnds(duration: Duration): number {

        const duration_ms = TimeDurations.toMillis(duration)

        return Math.floor((Date.now() + (duration_ms)) / 1000);

    }

}
