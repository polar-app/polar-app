import * as React from 'react';
import {Percentages} from "polar-shared/src/util/Percentages";
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {ReviewFinished} from "./ReviewFinished";
import LinearProgress from "@material-ui/core/LinearProgress";
import {ReviewerCard} from "./cards/ReviewerCard";
import {RatingCallback, useReviewerCallbacks, useReviewerStore, SuspendedCallback, FinishedCallback} from './ReviewerStore';
import {deepMemo} from "../../../../web/js/react/ReactUtils";

export const ReviewerRunner = deepMemo(() => {

    const {taskRep, finished, total} = useReviewerStore(['taskRep', 'finished', 'total']);

    if (! taskRep) {

        return (
            <ReviewFinished/>
        );

    }

    const perc = Math.floor(Percentages.calculate(finished, total));

    return (
        <>
            <div className="mb-1">

                <LinearProgress variant="determinate"
                                color="primary"
                                value={perc}/>

            </div>

            <ReviewerCard key={taskRep.id}
                          taskRep={taskRep}/>

        </>

    );

});


export interface IProps<A> {

    readonly taskReps: ReadonlyArray<TaskRep<A>>;

    /**
     * Callback for when we receive answers and their values.
     */
    readonly doRating: RatingCallback<A>;

    readonly doSuspended: SuspendedCallback<A>;

    readonly doFinished: FinishedCallback;

}
export const Reviewer3 = function<A>(props: IProps<A>) {

    const {init} = useReviewerCallbacks();

    React.useEffect(() => {
        init(props.taskReps, props.doRating, props.doSuspended, props.doFinished);
    }, [init, props.doFinished, props.doRating, props.doSuspended, props.taskReps])

    return (
        <ReviewerRunner/>
    );

};