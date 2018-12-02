import {Percentages} from "./Percentages";

/**
 * Represents the progress of a state of tasks and allows us to just incr()
 * the progress in a loop rather than having the math exposed in the loop.
 */
export class ProgressTracker {

    private state: ProgressState;

    private readonly epoch: number;

    /**
     *
     * @param total The total number of tasks to complete.
     * @param initial The initial value of the progress counter.
     */
    constructor(total: number) {

        this.epoch = Date.now();

        this.state = {
            completed: 0,
            total,
            duration: 0,
            progress: 0
        };

        if (this.state.total === 0) {
            // we're done when there aree no tasks.
            this.state.progress = 100;
        }

    }

    /**
     * Increment the progress of the job by one, compute the updated state,
     * and return.
     */
    public incr(): Readonly<ProgressState> {
        ++this.state.completed;
        this.state.progress = this.calculate();
        this.state.duration = Date.now() - this.epoch;

        return this.peek();

    }

    /**
     * Used so that we can jump to the end the job as it's terminated.
     *
     */
    public terminate(): Readonly<ProgressState> {
        this.state.completed = this.state.total;
        this.state.progress = this.calculate();
        this.state.duration = Date.now() - this.epoch;
        return this.peek();
    }

    /**
     * Get a current view of the progress state.
     */
    public peek(): Readonly<ProgressState> {
        return Object.freeze(Object.assign({}, this.state));
    }

    private calculate(): Percentage {

        if (this.state.total === 0) {
            return 100;
        }

        const result = Percentages.calculate(this.state.completed, this.state.total);

        if (result < 0 || result > 100) {
            const msg = `Invalid percentage: ${result}: completed: ${this.state.completed} vs total: ${this.state.total}`;
            throw new Error(msg);
        }

        return <Percentage> result;

    }

}

export interface ProgressState {
    completed: number;
    total: number;
    duration: number;
    progress: Percentage;
}

/**
 * An actual percentage value between zero and 100 [0,100]
 */
export type Percentage = 0  |  1 |  2 |  3 |  4 |  5 |  6 |  7 |  8 |  9 |
                         10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 |
                         20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 |
                         30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 |
                         40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 |
                         50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 |
                         60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 |
                         70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 |
                         80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 |
                         90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 |
                         100;
