import {ErrorType} from "polar-shared/src/util/Errors";
import * as React from "react";
import {createValueStore} from "./ValueStore";
import {SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import {profiled} from "../profiler/ProfiledComponents";

export interface ISnapshotLeft {
    readonly left: ErrorType;
}

/**
 * Snapshot right value.  Right is the correct value (pun for correct).
 *
 * https://antman-does-software.com/stop-catching-errors-in-typescript-use-the-either-type-to-make-your-code-predictable
 */
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

export type SnapshotStoreTuple<S> = readonly [
    SnapshotStoreProvider<S>,
    UseSnapshotStore<S>
];

/**
 * Create a snapshot store of a given type that is initially undefined, then a
 * value is provided for us by the underlying snapshot provider.
 *
 * The values are stored in an Either:
 *
 * https://antman-does-software.com/stop-catching-errors-in-typescript-use-the-either-type-to-make-your-code-predictable
 *
 * This is not Firestore specific and can support any type of value that can be updated.
 */
export function createSnapshotStore<S>(): SnapshotStoreTuple<S> {

    // TODO: investigate react suspense for the fallback

    const [ValueStoreProvider, useValue, valueSetter] = createValueStore<ISnapshot<S> | undefined>();

    const SnapshotStoreProviderInner: React.FC<SnapshotStoreProviderProps<S>> = React.memo(function SnapshotStoreProviderInner(props) {

        const value = useValue();

        const handleNext = React.useCallback((snapshot: S) => {

            valueSetter({right: snapshot});

        }, []);

        const handleError = React.useCallback((err: ErrorType) => {

            valueSetter({left: err});

        }, []);

        React.useEffect(() => {
            return props.subscriber(handleNext, handleError);
        }, [props, handleNext, handleError])

        if (value === undefined) {
            return props.fallback;
        }

        return props.children;

    });

    const SnapshotStoreProvider: React.FC<SnapshotStoreProviderProps<S>> = profiled(React.memo(function SnapshotStoreProvider(props) {
        return (
            <ValueStoreProvider initialStore={undefined}>
                <SnapshotStoreProviderInner fallback={props.fallback} subscriber={props.subscriber}>
                    {props.children}
                </SnapshotStoreProviderInner>
            </ValueStoreProvider>
        );
    }));

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
