import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {ITaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/ITaskRep";

/**
 * Called when we're finished all the tasks.
 *
 * @param cancelled true if the user explicitly cancelled the review.
 */
export type RatingCallback<A> = (taskRep: ITaskRep<A>, rating: Rating) => void;
