import {Dates} from './Dates';

const GRADE_MIN = 0;
const GRADE_MAX = 1;
const GRADE_CUTOFF = 0.6;
const DEFAULT_DIFFICULTY = 0.3;

/**
 * https://github.com/pensieve-srs/pensieve-srs
 * http://www.blueraja.com/blog/477/a-better-spaced-repetition-learning-algorithm-sm2
 */
export class S2Plus {

    public static clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }

    public static calcRecallRate(reviewedAt: Date, interval: number, today = new Date()) {
        const diff = Dates.diffDays(today, reviewedAt);
        const recall = 2 ** (-diff / interval);
        return Math.ceil(recall * 100) / 100;
    }

    public static calcPercentOverdue(reviewedAt: Date, interval: number, today = new Date()) {
        const diff = Dates.diffDays(today, reviewedAt);
        const calculated = diff / interval;
        return Math.min(2, calculated);
    }

    public static calculate(reviewedAt: Date,
                            prevDifficulty: number,
                            prevInterval: number,
                            performanceRating: number,
                            today = new Date()): Scheduling {

        const percentOverdue = this.calcPercentOverdue(reviewedAt, prevInterval, today);

        const difficultyDelta = percentOverdue * (1 / 17) * (8 - 9 * performanceRating);
        const difficulty = this.clamp(prevDifficulty + difficultyDelta, 0, 1);

        const difficultyWeight = 3 - 1.7 * difficulty;

        let intervalDelta;
        if (performanceRating < GRADE_CUTOFF) {
            intervalDelta = Math.round(1 / difficultyWeight ** 2) || 1;
        } else {
            intervalDelta = 1 + Math.round((difficultyWeight - 1) * percentOverdue);
        }

        const interval = prevInterval * intervalDelta;

        const nextReviewDate = Dates.addDays(today, interval);

        return {
            difficulty,
            interval,
            nextReviewDate,
            reviewedAt: today,
        };

    }

}

interface Scheduling {
    readonly difficulty: number;
    readonly interval: number;
    readonly nextReviewDate: Date;
    readonly reviewedAt: Date;
}
