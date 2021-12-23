import {ITaskRep} from "./ITaskRep";
import {StageCounts} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";

export interface ICalculatedTaskReps<A> {

    /**
     * The task reps that need to be completed.
     */
    readonly taskReps: ReadonlyArray<ITaskRep<A>>;

    readonly stageCounts: StageCounts;
}
