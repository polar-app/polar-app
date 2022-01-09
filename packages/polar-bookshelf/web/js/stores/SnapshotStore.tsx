import {ErrorType} from "polar-shared/src/util/Errors";
import * as React from "react";
import {createValueStore} from "./ValueStore";
import {SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import {profiled} from "../profiler/ProfiledComponents";

export interface ISnapshotLeft {
    readonly left: ErrorType;
    readonly right?: never;
}

/**
 * Snapshot right value.  Right is the correct value (pun for correct).
 *
 * https://antman-does-software.com/stop-catching-errors-in-typescript-use-the-either-type-to-make-your-code-predictable
 */
export interface ISnapshotRight<S> {
    readonly left?: never;
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

export interface SnapshotStoreLoaderProps<S> {
    readonly subscriber: SnapshotSubscriber<S>;
}

export type SnapshotStoreLoader<S> = React.FC<SnapshotStoreLoaderProps<S>>;

export interface SnapshotStoreLatchProps {
    readonly fallback: JSX.Element;
    readonly children: JSX.Element;
}

/**
 * The latch HAS to be called before a component can useSnapshotStore to verify
 * that the snapshot was loaded at least once otherwise the given fallback is
 * used.
 */
export type SnapshotStoreLatch = React.FC<SnapshotStoreLatchProps>;

export type SnapshotStoreTuple<S> = readonly [
    SnapshotStoreProvider<S>,
    UseSnapshotStore<S>,
    SnapshotStoreLoader<S>,
    SnapshotStoreLatch
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
 * @param id The id for this snapshot store used internally for logging.
 */
export function createSnapshotStore<S>(id: string): SnapshotStoreTuple<S> {

    // TODO: investigate react suspense for the fallback

    const [ValueStoreProvider, useValue, useValueSetter] = createValueStore<ISnapshot<S> | undefined>();

    const SnapshotStoreLoader: React.FC<SnapshotStoreLoaderProps<S>> = React.memo(function SnapshotStoreLoader(props) {

        const valueSetter = useValueSetter()

        const handleNext = React.useCallback((snapshot: S) => {

            valueSetter({right: snapshot});

        }, [valueSetter]);

        const handleError = React.useCallback((err: ErrorType) => {

            valueSetter({left: err});

        }, [valueSetter]);

        React.useEffect(() => {
            return props.subscriber(handleNext, handleError);
        }, [props, handleNext, handleError])

        return null;

    });

    const SnapshotStoreLatch: React.FC<SnapshotStoreLatchProps> = React.memo(function SnapshotStoreLatch(props) {

        const value = useValue();
        const snapshotCreated = React.useRef(0);
        const latencyLogged = React.useRef(false);

        React.useEffect(() => {

            if (value !== undefined && snapshotCreated.current === 0) {
                snapshotCreated.current = Date.now();
            }

        }, [props, value])

        React.useEffect(() => {

            if (! latencyLogged.current) {
                const latency = Math.abs(Date.now() - snapshotCreated.current);
                console.log(`Initial snapshot latency for ${id} has duration: ${latency}ms`);
                latencyLogged.current = true;
            }

        }, [])

        if (value === undefined) {
            return props.fallback;
        }

        return props.children;

    });

    const SnapshotStoreProviderInner: React.FC<SnapshotStoreProviderProps<S>> = React.memo(function SnapshotStoreProviderInner(props) {

        return (
            <>
                <SnapshotStoreLoader subscriber={props.subscriber}/>
                <SnapshotStoreLatch fallback={props.fallback}>
                    {props.children}
                </SnapshotStoreLatch>
            </>
        )

    });

    const SnapshotStoreProvider: React.FC<SnapshotStoreProviderProps<S>> = React.memo(profiled(function SnapshotStoreProvider(props) {
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

    return [SnapshotStoreProvider, useSnapshotStore, SnapshotStoreLoader, SnapshotStoreLatch]

}
