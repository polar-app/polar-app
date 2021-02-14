import * as React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {createObservableStore, SetStore} from '../react/store/ObservableStore';
import {UndoQueues} from "./UndoQueues";
import UndoFunction = UndoQueues.UndoFunction;
import IPushResult = UndoQueues.IPushResult;
import UndoResult = UndoQueues.UndoResult;
import RedoResult = UndoQueues.RedoResult;

interface IUndoStore {
    readonly undoQueue: UndoQueues.UndoQueue;
}

interface IUndoCallbacks {
    readonly push: (action: UndoFunction) => Promise<IPushResult>;
    readonly undo: () => Promise<UndoResult>;
    readonly redo: () => Promise<RedoResult>;
}

const initialStore: IUndoStore = {
    undoQueue: UndoQueues.create()
}

interface Mutation {
}

interface Mutator {

}

function mutatorFactory(storeProvider: Provider<IUndoStore>,
                        setStore: SetStore<IUndoStore>): Mutator {

    return {};

}

function useCallbacksFactory(storeProvider: Provider<IUndoStore>,
                             setStore: (store: IUndoStore) => void,
                             mutator: Mutator): IUndoCallbacks {

    return React.useMemo(() => {

        type WithQueueHandler<T> = (undoQueue: UndoQueues.UndoQueue) => Promise<T>;

        async function withQueue<T>(handler: WithQueueHandler<T>): Promise<T> {

            const store = storeProvider();
            const {undoQueue} = store;

            return await handler(undoQueue);

        }

        async function push(action: UndoFunction): Promise<IPushResult> {
            return await withQueue(undoQueue => undoQueue.push(action));
        }

        async function undo(): Promise<UndoResult> {
            // TODO: need to determine the source of the event because if the
            // user is within text input don't allow it to undo...
            return await withQueue(undoQueue => undoQueue.undo());
        }

        async function redo(): Promise<RedoResult> {
            return await withQueue(undoQueue => undoQueue.redo());
        }

        return {
            push, undo, redo
        };

    }, [storeProvider]);

}

export const [UndoStoreProviderDelegate, useUndoStore, useUndoCallbacks, useUndoMutator] =
    createObservableStore<IUndoStore, Mutator, IUndoCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory,
        enableShallowEquals: true
    });

