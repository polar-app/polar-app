import {ErrorType} from "polar-shared/src/util/Errors";
import * as React from "react";
import {createValueStore, ValueStoreProvider} from "./ValueStore";
import {SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";

export interface ISnapshotLeft {
    readonly left: ErrorType;
}

export interface ISnapshotRight<S> {
    readonly right: S;
}

/**
 * Provides two main states that are exposed to the user.
 *
 * - right: aka the CORRECT, state (right is a pun for correct) and is the primary value we should have.
 *
 * - left: the incorrect state, and only happens during errors.
 */
export type ISnapshot<S> = ISnapshotRight<S> | ISnapshotLeft;

interface SnapshotStoreProviderProps<S> {
    readonly subscriber: SnapshotSubscriber<S>;
    readonly fallback: JSX.Element;
    readonly children: JSX.Element;
}

export type OnErrorCallback = (err: ErrorType) => void;

export type OnNextCallback<S> = (value: S) => void;

export type SnapshotSubscriber<S> = (onNext: OnNextCallback<S>, onError: OnErrorCallback) => SnapshotUnsubscriber;

export type SnapshotStoreProvider<S> = React.FC<SnapshotStoreProviderProps<S>>;

export type UseSnapshotStore<S> = () => ISnapshot<S>;

export type SnapshotStoreTuple<S> = Readonly<[
    SnapshotStoreProvider<S>,
    UseSnapshotStore<S>
]>;

/**
 * Create a snapshot store of a given type that is initially undefined, then a value is provide for us.
 */
export function createSnapshotStore<S>(): SnapshotStoreTuple<S> {

    // TODO: investigate react suspense for the fallback

    // TODO: how do we use multiple snapshots for performance reasons and
    // trigger them all at once

    const [ValueStoreProvider, useValue, valueSetter] = createValueStore<ISnapshot<S> | undefined>();

    const SnapshotStoreProviderInner: React.FC<SnapshotStoreProviderProps<S>> = React.memo(function SnapshotStoreProviderInner(props) {

        const value = useValue();

        const handleNext = React.useCallback((snapshot: S) => {

            valueSetter({right: snapshot});

        }, [valueSetter]);

        const handleError = React.useCallback((err: ErrorType) => {

            valueSetter({left: err});

        }, [valueSetter]);

        React.useEffect(() => {
            return props.subscriber(handleNext, handleError);
        }, [props.subscriber, handleNext, handleError])

        if (value === undefined) {
            return props.fallback;

        }

        return props.children;

    });

    const SnapshotStoreProvider: React.FC<SnapshotStoreProviderProps<S>> = React.memo(function SnapshotStoreProvider(props) {
        return (
            <ValueStoreProvider initialStore={undefined}>
                <SnapshotStoreProviderInner fallback={props.fallback} subscriber={props.subscriber}>
                    {props.children}
                </SnapshotStoreProviderInner>
            </ValueStoreProvider>
        );
    });

    const useSnapshotStore = (): ISnapshot<S> => {

        const value = useValue();

        // WARN: this seems dangerous but it is safe because
        // SnapshotStoreProviderInner only triggers renders on children when the
        // value is not null.  This way all users will receive ISnapshot
        // properly
        return value!;

    }

    return [SnapshotStoreProvider, useSnapshotStore]

}
