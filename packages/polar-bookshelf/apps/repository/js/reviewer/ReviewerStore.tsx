import * as React from 'react';
import {
    createObservableStore,
    SetStore
} from "../../../../web/js/react/store/ObservableStore";
import {Provider} from "polar-shared/src/util/Providers";
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Rating, ReviewRating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {ASYNC_NULL_FUNCTION} from "polar-shared/src/util/Functions";

/**
 * Called when we're finished all the tasks.
 *
 * @param cancelled true if the user explicitly cancelled the review.
 */
export type FinishedCallback = () => Promise<void>;

export type SuspendedCallback<A> = (taskRep: TaskRep<A>) => Promise<void>;

/**
 * Called when we're finished all the tasks.
 *
 * @param cancelled true if the user explicitly cancelled the review.
 */
export type RatingCallback<A> = (taskRep: TaskRep<A>, rating: Rating) => Promise<void>;

interface IReviewerStore {

    readonly initialized: boolean;

    /**
     * The current TaskRep we're working with or undefined when there are no more.
     */
    readonly taskRep?: TaskRep<any>;

    readonly pending: TaskRep<any>[];

    readonly finished: number;

    readonly total: number;

    readonly doRating: RatingCallback<any>;

    readonly doSuspended: SuspendedCallback<any>;

    readonly doFinished: FinishedCallback;

    /**
     * The history of ratings (mostly for debug)
     */
    readonly ratings: ReadonlyArray<ReviewRating>;

    /**
     * True if the user has finished.
     */
    readonly hasFinished: boolean | undefined;

    /**
     * True if the user has suspended.
     */
    readonly hasSuspended: boolean | undefined;

}

interface IReviewerCallbacks {

    readonly init: <A>(taskReps: ReadonlyArray<TaskRep<A>>,
                       doRating: RatingCallback<any>,
                       doSuspended: SuspendedCallback<any>,
                       doFinished: FinishedCallback) => void;

    readonly next: (rating: Rating) => boolean;

    readonly onRating: (taskRep: TaskRep<any>, rating: Rating) => void;

    readonly onSuspended: () => void;

    readonly onFinished: () => void;

    readonly onReset: () => void;

}

const initialStore: IReviewerStore = {
    initialized: false,
    taskRep: undefined,
    pending: [],
    finished: 0,
    total: 0,
    ratings: [],
    hasSuspended: undefined,
    hasFinished: undefined,
    doFinished: ASYNC_NULL_FUNCTION,
    doSuspended: ASYNC_NULL_FUNCTION,
    doRating: ASYNC_NULL_FUNCTION
}

interface Mutator {

}

function mutatorFactory<A>(storeProvider: Provider<IReviewerStore>,
                           setStore: SetStore<IReviewerStore>): Mutator {

    return {};

}

function useCallbacksFactory(storeProvider: Provider<IReviewerStore>,
                            setStore: (store: IReviewerStore) => void,
                            mutator: Mutator): IReviewerCallbacks {

    const dialogs = useDialogManager();

    return React.useMemo(() => {

        function reset() {
            setStore({
                initialized: false,
                taskRep: undefined,
                pending: [],
                finished: 0,
                total: 0,
                doFinished: ASYNC_NULL_FUNCTION,
                doSuspended: ASYNC_NULL_FUNCTION,
                doRating: ASYNC_NULL_FUNCTION,
                ratings: [],
                hasSuspended: undefined,
                hasFinished: undefined,
            })
        }

        function init<A>(taskReps: ReadonlyArray<TaskRep<A>>,
                         doRating: RatingCallback<any>,
                         doSuspended: SuspendedCallback<any>,
                         doFinished: FinishedCallback) {

            const pending = [...taskReps];
            const total = taskReps.length;

            setStore({
                initialized: true,
                taskRep: pending.shift(),
                pending,
                total,
                finished: 0,
                doRating,
                doSuspended,
                doFinished,
                ratings: [],
                hasFinished: undefined,
                hasSuspended: undefined
            });

        }

        function next(rating: Rating): boolean {

            const store = storeProvider();

            const pending = [...store.pending];
            const taskRep = pending.shift();

            if (! taskRep) {

                setStore({
                    ...store,
                    taskRep: undefined,
                    ratings: [...store.ratings, rating]
                });

                onFinished();

                return true;

            }

            const finished = store.finished + 1;

            console.log(`next: finished: ${finished}, nr pending: ${pending.length}`);

            setStore({
                ...store,
                pending,
                taskRep,
                finished,
                ratings: [...store.ratings, rating]
            });

            return false;
        }


        function handleAsyncCallback(delegate: () => Promise<void>) {

            function handleError(err: Error) {
                dialogs.snackbar({type: 'error', message: err.message});
            }

            delegate()
                .catch(handleError)

        }

        function onRating(taskRep: TaskRep<any>, rating: Rating) {
            console.log("ReviewerStore: onRating: " + rating);
            handleAsyncCallback(async () => storeProvider().doRating(taskRep, rating));
            next(rating);
        }

        function onSuspended() {
            console.log("ReviewerStore: onSuspended");
            const store = storeProvider();
            const {taskRep} = store;

            setStore({...store, hasSuspended: true});

            if (! taskRep) {
                // we suspended when we didn't have any tasks left.
                return;
            }

            handleAsyncCallback(async () => store.doSuspended(taskRep));
            reset();
        }

        function onFinished() {
            console.log("ReviewerStore: onFinished");
            const store = storeProvider();
            setStore({...store, hasFinished: true});
            handleAsyncCallback(async () => storeProvider().doFinished());
        }

        function onReset() {
            reset();
        }

        return {
            init, next, onRating, onSuspended, onFinished, onReset
        };

    }, [dialogs, setStore, storeProvider]);

}

export const [ReviewerStoreProvider, useReviewerStore, useReviewerCallbacks] =
    createObservableStore<IReviewerStore, Mutator, IReviewerCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory
    });
