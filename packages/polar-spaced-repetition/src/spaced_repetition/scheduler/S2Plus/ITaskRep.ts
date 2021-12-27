import {ISpacedRep, Task} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {DurationMS} from "polar-shared/src/util/TimeDurations";

export interface ITaskRep<A> extends ISpacedRep, Task<A> {

    /**
     * The age of the work so we can sort the priority queue.
     */
    readonly age: DurationMS;

}
