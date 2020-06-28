import * as React from 'react';
import {useState} from 'react';
import {Percentages} from "polar-shared/src/util/Percentages";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {ReviewFinished} from "./ReviewFinished";
import LinearProgress from "@material-ui/core/LinearProgress";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {ReviewerCard} from "./cards/ReviewerCard";

/**
 * Called when we're finished all the tasks.
 *
 * @param cancelled true if the user explicitly cancelled the review.
 */
export type FinishedCallback = (cancelled?: boolean) => Promise<void>;


/**
 * Called when we're finished all the tasks.
 *
 * @param cancelled true if the user explicitly cancelled the review.
 */
export type RatingCallback<A> = (taskRep: TaskRep<A>, rating: Rating) => Promise<void>;

export type SuspendedCallback<A> = (taskRep: TaskRep<A>) => Promise<void>;

export interface IProps<A> {

    readonly taskReps: ReadonlyArray<TaskRep<A>>;

    /**
     * Callback for when we receive answers and their values.
     */
    readonly doRating: RatingCallback<A>;

    readonly doSuspended: SuspendedCallback<A>;

    readonly doFinished: FinishedCallback;

}

export interface IState<A> {

    /**
     * The review we're working with or undefined when there are no more.
     */
    readonly taskRep?: TaskRep<A> | undefined;

    readonly pending: TaskRep<A>[];

    readonly finished: number;

    readonly total: number;

}

export const Reviewer2 = function<A>(props: IProps<A>) {

    const dialogs = useDialogManager();

    const [state, setState] = useState(() => {

        const pending = [...props.taskReps];
        const total = props.taskReps.length;

        return {
            taskRep: pending.shift(),
            pending,
            total,
            finished: 0
        }

    });

    const handleAsyncCallback = (delegate: () => Promise<void>) => {

        function handleError(err: Error) {
            dialogs.snackbar({type: 'error', message: err.message});
        }

        delegate()
            .catch(handleError)

    }

    const doNext = React.useCallback(() => {

        const taskRep = state.pending.shift();

        async function doAsync() {

            if (! taskRep) {
                await props.doFinished();
            }

            setState({
                ...state,
                taskRep,
                finished: state.finished + 1
            });

        }

        handleAsyncCallback(doAsync);

    }, []);


    const onSuspended = React.useCallback((taskRep: TaskRep<A>) => {

        async function doAsync() {
            await props.doSuspended(taskRep);
        }

        handleAsyncCallback(doAsync);

    }, []);


    const onRating = React.useCallback((taskRep: TaskRep<A>, rating: Rating) => {

        async function doAsync() {
            await props.doRating(taskRep, rating);
        }

        handleAsyncCallback(doAsync);

        doNext();

    }, []);

    const {taskRep} = state;

    if (! taskRep) {

        return (
            <ReviewFinished/>
        );

    }

    const perc = Math.floor(Percentages.calculate(state.finished, state.total));

    return (
        <>
            <div className="mb-1">

                <LinearProgress variant="determinate"
                                color="primary"
                                value={perc}/>

            </div>

            <ReviewerCard key={taskRep.id}
                          taskRep={taskRep}
                          onRating={onRating}/>
        </>

    );

};
