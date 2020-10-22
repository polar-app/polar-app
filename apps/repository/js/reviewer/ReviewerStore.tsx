import * as React from 'react';
import {
    createObservableStore,
    SetStore
} from "../../../../web/js/react/store/ObservableStore";
import {Provider} from "polar-shared/src/util/Providers";
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";

interface IReviewerStore {

    /**
     * The current TaskRep we're working with or undefined when there are no more.
     */
    readonly taskRep?: TaskRep<any> | undefined;

    readonly pending: TaskRep<any>[];

    readonly finished: number;

    readonly total: number;

}

interface IReviewerCallbacks {

    readonly init: <A>(taskReps: ReadonlyArray<TaskRep<A>>) => void;

    readonly next: () => boolean;

}

const initialStore: IReviewerStore = {
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

    return React.useMemo(() => {

        function init<A>(taskReps: ReadonlyArray<TaskRep<A>>) {

            const pending = [...taskReps];
            const total = taskReps.length;

            setStore({
                taskRep: pending.shift(),
                pending,
                total,
                finished: 0
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

            setStore({
                ...store,
                pending,
                taskRep,
                finished
            });

            return false;
        }

        return {
            init, next
        };

        return result;

    }, [setStore, storeProvider]);

}

export const [ReviewerStoreProvider, useReviewerStore, useReviewerCallbacks] =
    createObservableStore<IReviewerStore, Mutator, IReviewerCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });
