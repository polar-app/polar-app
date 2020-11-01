import * as React from 'react';
import {Percentages} from "polar-shared/src/util/Percentages";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {ReviewFinished} from "./ReviewFinished";
import LinearProgress from "@material-ui/core/LinearProgress";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {ReviewerCard} from "./cards/ReviewerCard";
import {RatingCallback, useReviewerCallbacks, useReviewerStore} from './ReviewerStore';
import {deepMemo} from "../../../../web/js/react/ReactUtils";

/**
 * Called when we're finished all the tasks.
 *
 * @param cancelled true if the user explicitly cancelled the review.
 */
export type FinishedCallback = (cancelled?: boolean) => Promise<void>;

export type SuspendedCallback<A> = (taskRep: TaskRep<A>) => Promise<void>;

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
    const dialogs = useDialogManager();

    const handleAsyncCallback = React.useCallback((delegate: () => Promise<void>) => {

        function handleError(err: Error) {
            dialogs.snackbar({type: 'error', message: err.message});
        }

        delegate()
            .catch(handleError)

    }, [dialogs]);

    const onRating: RatingCallback<A> = React.useCallback(async (taskRep: TaskRep<A>, rating: Rating) => {

        async function doAsync() {
            await props.doRating(taskRep, rating);
        }

        handleAsyncCallback(doAsync);

    }, [handleAsyncCallback, props]);

    React.useEffect(() => {
        init(props.taskReps, onRating);
    }, [init, onRating, props.doRating, props.taskReps])

    return (
        <ReviewerRunner/>
    );

};