import {ErrorType} from "polar-shared/src/util/Errors";
import * as React from "react";
import {createValueStore} from "./ValueStore";
import {profiled} from "../profiler/ProfiledComponents";

export interface IAsyncLeft {
    readonly left: ErrorType;
    readonly right?: never;
}

export interface IAsyncRight<V> {
    readonly left?: never;
    readonly right: V;
}

/**
 * Provides two main states that are exposed to the user.
 *
 * - right: aka the CORRECT, state (right is a pun for correct) and is the primary value we should have.
 *
 * - left: the incorrect state, and only happens during errors.
 */
export type IAsyncEither<V> = IAsyncLeft | IAsyncRight<V>;

interface AsyncStoreProviderProps<S> {
    readonly children: JSX.Element;
}

export type AsyncProvider<V> = () => Promise<V>;

export type AsyncStoreProvider<S> = React.FC<AsyncStoreProviderProps<S>>;

export type UseAsyncStore<S> = () => IAsyncEither<S>;

export interface AsyncStoreLoaderProps<S> {
    readonly provider: AsyncProvider<S>;
}

export type AsyncStoreLoader<S> = React.FC<AsyncStoreLoaderProps<S>>;

export interface AsyncStoreLatchProps {
    readonly fallback: JSX.Element;
    readonly children: JSX.Element;
}

/**
 * The latch HAS to be called before a component can useAsyncStore to verify
 * that the provider was loaded at least once otherwise the given fallback is
 * used.
 */
export type AsyncStoreLatch = React.FC<AsyncStoreLatchProps>;

export type AsyncStoreTuple<V> = readonly [
    AsyncStoreProvider<V>,
    UseAsyncStore<V>,
    AsyncStoreLoader<V>,
    AsyncStoreLatch
];

const AsyncLatchContext = React.createContext<boolean>(false);

function useAsyncLatchContext() {
    return React.useContext(AsyncLatchContext);
}

/**
 * Create a async store of a given type that is initially undefined, then a
 * value is provided for us by the underlying async provider.
 *
 * The values are stored in an Either:
 *
 * https://antman-does-software.com/stop-catching-errors-in-typescript-use-the-either-type-to-make-your-code-predictable
 *
 * This is not Firestore specific and can support any type of value that can be updated.
 * @param id The id for this async store used internally for logging.
 */
export function createAsyncStore<V>(id: string): AsyncStoreTuple<V> {

    const [ValueStoreProvider, useValue, useValueSetter] = createValueStore<IAsyncEither<V> | undefined>();

    const AsyncStoreLoader: React.FC<AsyncStoreLoaderProps<V>> = React.memo(function AsyncStoreLoader(props) {

        const valueSetter = useValueSetter()

        const handleValue = React.useCallback((value: V) => {

            valueSetter({right: value});

        }, [valueSetter]);

        const handleError = React.useCallback((err: ErrorType) => {

            valueSetter({left: err});

        }, [valueSetter]);

        React.useEffect(() => {
            props.provider()
                .then(value => handleValue(value))
                .catch(err => handleError(err))

        }, [props, handleValue, handleError])

        return null;

    });

    // TODO: implement a proper latch verification...

    const AsyncStoreLatchInner: React.FC<AsyncStoreLatchProps> = React.memo(function AsyncStoreLatchInner(props) {

        const value = useValue();
        const asyncCreated = React.useRef(0);
        const latencyLogged = React.useRef(false);

        React.useEffect(() => {

            if (value !== undefined && asyncCreated.current === 0) {
                asyncCreated.current = Date.now();
            }

        }, [props, value])

        React.useEffect(() => {

            if (! latencyLogged.current) {
                const latency = Math.abs(Date.now() - asyncCreated.current);
                console.log(`Initial async latency for ${id} has duration: ${latency}ms`);
                latencyLogged.current = true;
            }

        }, [])

        if (value === undefined) {
            return props.fallback;
        }

        return props.children;

    });

    const AsyncStoreLatch: React.FC<AsyncStoreLatchProps> = React.memo(function AsyncStoreLatch(props) {

        return (
            <AsyncLatchContext.Provider value={true}>
                <AsyncStoreLatchInner fallback={props.fallback}>
                    {props.children}
                </AsyncStoreLatchInner>
            </AsyncLatchContext.Provider>
        );

    });

    const AsyncStoreProvider: React.FC<AsyncStoreProviderProps<V>> = React.memo(profiled(function AsyncStoreProvider(props) {
        return (
            <ValueStoreProvider initialStore={undefined}>
                {props.children}
            </ValueStoreProvider>
        );
    }));

    const useAsyncStore = (): IAsyncEither<V> => {

        const AsyncLatchUsed = useAsyncLatchContext();

        if (! AsyncLatchUsed) {
            throw new Error("AsyncStoreLatch not used.  This needs to be used at least once along with AsyncStoreLoader");
        }

        const value = useValue();

        // WARN: this seems dangerous, but, in practice, it is safe because
        // AsyncStoreProviderInner only triggers renders on children when the
        // value is not null.  This way all users will receive IAsync
        // properly
        return value!;

    }

    return [AsyncStoreProvider, useAsyncStore, AsyncStoreLoader, AsyncStoreLatch]

}
