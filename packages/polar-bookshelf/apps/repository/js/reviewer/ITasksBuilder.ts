import {Task} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";

/**
 * Take tasks and then build a
 */
export interface ITasksBuilder<A, B> {
    (data: ReadonlyArray<A>): ReadonlyArray<Task<B>>;
}
