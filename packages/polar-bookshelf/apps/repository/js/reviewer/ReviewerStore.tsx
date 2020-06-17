import React from 'react';
import {
    createObservableStore,
    SetStore
} from "../../../../web/js/react/store/ObservableStore";
import {Provider} from "polar-shared/src/util/Providers";
import {Logger} from "polar-shared/src/logger/Logger";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";

const log = Logger.create();

interface IReviewerStore {
    /**
     * The review we're working with or undefined when there are no more.
     */
    readonly taskRep?: TaskRep<any> | undefined;

    readonly pending: TaskRep<any>[];

    readonly finished: number;

    readonly total: number;

}

interface IReviewerCallbacks {

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

    function reduce(): IReviewerStore | undefined {

        return undefined;

    }

    return {};

}

function callbacksFactory<A>(storeProvider: Provider<IReviewerStore>,
                             setStore: (store: IReviewerStore) => void,
                             mutator: Mutator): IReviewerCallbacks {

    return {
    };

}

export const [ReviewerStoreProvider, useReviewerStore, useReviewerCallbacks] =
    createObservableStore<IReviewerStore, Mutator, IReviewerCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });
