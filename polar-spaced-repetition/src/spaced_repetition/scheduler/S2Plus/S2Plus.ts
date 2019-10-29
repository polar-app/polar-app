import {Dates} from './Dates';
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Answer, Days, Schedule, Review} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";

const GRADE_MIN = 0;
const GRADE_MAX = 1;
const GRADE_CUTOFF = 0.6;


/**
 * https://github.com/pensieve-srs/pensieve-srs
 * http://www.blueraja.com/blog/477/a-better-spaced-repetition-learning-algorithm-sm2
 */
export class S2Plus {

    public static DEFAULT_DIFFICULTY = 0.3;

    public static DEFAULT_INTERVAL = 1;

    public static clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }

    public static calcRecallRate(reviewedAt: Date, interval: Days, timestamp = new Date()) {
        const diff = Dates.diffDays(timestamp, reviewedAt);
        const recall = 2 ** (-diff / interval);
        return Math.ceil(recall * 100) / 100;
    }

    public static calcPercentOverdue(reviewedAt: Date, interval: Days, timestamp = new Date()) {
        const diff = Dates.diffDays(timestamp, reviewedAt);
        const calculated = diff / interval;
        return Math.min(2, calculated);
    }

    /**
     *
     * @param review The rating data persisted between ratings of the user.
     *
     * @param answer After an item is attempted, choose a answer from [0.0, 1.0], with 1.0 being
     * the best.  Set a cutoff point for the answer being “correct” (default is 0.6). Then set
     *
     */
    public static calculate(review: Review,
                            answer: Answer): Schedule {

        const timestamp = new Date();

        const reviewedAt = ISODateTimeStrings.parse(review.reviewedAt);
        const percentOverdue = this.calcPercentOverdue(reviewedAt, review.interval, timestamp);

        const difficultyDelta = percentOverdue * (1 / 17) * (8 - 9 * answer);
        const difficulty = this.clamp(review.difficulty + difficultyDelta, 0, 1);

        const difficultyWeight = 3 - 1.7 * difficulty;

        let intervalDelta;
        if (answer < GRADE_CUTOFF) {
            intervalDelta = Math.round(1 / difficultyWeight ** 2) || 1;
        } else {
            intervalDelta = 1 + Math.round((difficultyWeight - 1) * percentOverdue);
        }

        const interval = review.interval * intervalDelta;

        const nextReviewDate = Dates.addDays(timestamp, interval);

        return {
            difficulty,
            interval,
            nextReviewDate,
            reviewedAt: timestamp.toISOString(),
        };

    }

}
