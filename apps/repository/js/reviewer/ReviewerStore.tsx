import * as React from 'react';
import {
    createObservableStore,
    SetStore
} from "../../../../web/js/react/store/ObservableStore";
import {Provider} from "polar-shared/src/util/Providers";
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";

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

    readonly doRating?: RatingCallback<any>;
}

interface IReviewerCallbacks {

    readonly init: <A>(taskReps: ReadonlyArray<TaskRep<A>>,
                       doRating: RatingCallback<any>) => void;

    readonly next: () => boolean;

    readonly onRating: (taskRep: TaskRep<any>, rating: Rating) => void;

}

const initialStore: IReviewerStore = {
    initialized: false,
    taskRep: undefined,
    pending: [],
    finished: 0,
    total: 0
}

interface Mutator {

}

function mutatorFactory<A>(storeProvider: Provider<IReviewerStore>,
                           setStore: SetStore<IReviewerStore>): Mutator {

    return {};

}

function callbacksFactory(storeProvider: Provider<IReviewerStore>,
                          setStore: (store: IReviewerStore) => void,
                          mutator: Mutator): IReviewerCallbacks {

    const dialogs = useDialogManager();

    return React.useMemo(() => {

        function init<A>(taskReps: ReadonlyArray<TaskRep<A>>,
                         doRating: RatingCallback<any>) {

            const pending = [...taskReps];
            const total = taskReps.length;

            setStore({
                initialized: true,
                taskRep: pending.shift(),
                pending,
                total,
                finished: 0,
                doRating
            });

        }

        function next(): boolean {

            const store = storeProvider();

            const pending = [...store.pending];
            const taskRep = pending.shift();

            if (! taskRep) {

                setStore({
                    ...store,
                    taskRep: undefined
                });

                return true;

            }

            const finished = store.finished + 1;

            console.log(`next: finished: ${finished}, nr pending: ${pending.length}`);

            setStore({
                ...store,
                pending,
                taskRep,
                finished
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

            const store = storeProvider();

            async function doAsync() {

                if (! store.doRating) {
                    return;
                }

                await store.doRating(taskRep, rating);
            }

            handleAsyncCallback(doAsync);

            next();

        }


        return {
            init, next, onRating
        };

    }, [dialogs, setStore, storeProvider]);

}

export const [ReviewerStoreProvider, useReviewerStore, useReviewerCallbacks] =
    createObservableStore<IReviewerStore, Mutator, IReviewerCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });
