import {Subject} from "rxjs";
import React, {useContext, useState} from "react";
import {Provider} from "polar-shared/src/util/Providers";
import {useComponentWillUnmount} from "../../hooks/ReactLifecycleHooks";
import deepEquals from "react-fast-compare";

function pick<T, K extends keyof T>(value: T, keys: ReadonlyArray<K>): Pick<T, K> {

    const result: any = {};

    for (const key of keys) {
        result[key] = value[key];
    }

    return result;

}

/**
 * Hook that allows us to just pick specific keys from the store.
 */
function usePick<T, K extends keyof T>(useStoreHook: () => T,
                                       keys: K[]): Pick<T, K> {

    const store = useStoreHook();

    const [value, ] = React.useState<Pick<T, K>>(pick(store, keys));

    return value;

}

interface InternalObservableStore<V> {

    /**
     * The underlying rxjs observable for sending off updates to components.
     */
    readonly subject: Subject<V>;

    /**
     * The current value, used for the the initial render of each component
     * and to update it each time so that on useObservableStore we can
     * return the current value.
     */
    current: V;

}


export interface ObservableStore<V> {

    /**
     * The current value, used for the the initial render of each component.
     */
    readonly current: V;

}

export type SetStore<V> = (value: V) => void;
export type Store<V> = [V, SetStore<V>];

interface IUseObservableStoreOpts<V, K extends keyof V, N> extends IUseStoreHookOpts<V, K, N> {
    readonly enableShallowEquals: boolean;
}

type Dict = {[key: string]: any};

namespace Equals {

    export function shallow(a: Dict, b: Dict): boolean {

        if (a === b) {
            // the easiest case where they are both object.
            return true;
        }

        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);

        if (aKeys.length !== bKeys.length) {
            // they have obviously different number of keys
            return false;
        }

        // we HAVE to check the names of the keys in the index because
        // if we don't there might be null values in a different
        // dictionary which would be indistinguishable from missing

        for (let idx = 0; idx < aKeys.length; ++idx) {
            if(aKeys[idx] !== bKeys[idx]) {
                return false;
            }
        }

        for(const key of aKeys) {

            if(a[key] !== b[key]) {
                return false;
            }

        }

        return true;

    }

    export function deep(a: Dict, b: Dict): boolean {
        return deepEquals(a, b);
    }

}

export function useObservableStore<V, K extends keyof V, N>(context: React.Context<ObservableStore<V>>,
                                                            keys: ReadonlyArray<K> | undefined,
                                                            opts: IUseObservableStoreOpts<V, K, N>): N {

    const internalObservableStore = useContext(context) as InternalObservableStore<V>;

    const [value, setValue] = useState<N>(opts.mapper(internalObservableStore.current));
    const valueRef = React.useRef(value);

    React.useEffect(() => {

        const subscription = internalObservableStore.subject.subscribe((nextValue) => {

            function doUpdateValue(newValue: N) {
                setValue(newValue);
                valueRef.current = newValue;
            }

            const currValue = valueRef.current;

            function isEqual(a: Dict, b: Dict): boolean {
                if (opts.enableShallowEquals) {
                    return Equals.shallow(a, b);
                }

                return Equals.deep(a, b);

            }

            if (keys) {

                // debug("Using keys");

                // we have received an update but we're only interested in a few
                // keys so compare them.

                const nextValueMapped = opts.mapper(pick(nextValue, keys));

                if (! isEqual(currValue, nextValueMapped)) {

                    if (opts.filter && ! opts.filter(currValue, nextValueMapped)) {
                        // the value didn't pass the filter so don't update it...
                        return;
                    }

                    // the internal current in the context is already updated.
                    // debug("values are updated: ", nextValuePicked, currValuePicked);
                    return doUpdateValue(nextValueMapped);

                } else {
                    // debug("values are NOT updated: ", nextValuePicked, currValuePicked);
                }

            } else {

                const currValue = valueRef.current;

                const mapped = opts.mapper(nextValue);

                if (! isEqual(currValue, nextValue)) {
                    // we can STILL do the lazy comparison here and only
                    // update when the value has actually changed.
                    return doUpdateValue(mapped);

                }
            }

        })

        return () => {
            subscription.unsubscribe();
        }

    }, [internalObservableStore.subject, keys, opts]);

    // return the initial value...
    return value;

}

export type InternalStoreContext<V> = [React.Context<ObservableStore<V>>, InternalObservableStore<V>];

export type StoreContext<V> = [React.Context<ObservableStore<V>>, ObservableStore<V>];

function createInternalObservableStore<V>(initialValue: V): InternalObservableStore<V> {

    const subject = new Subject<V>();
    subject.next(initialValue);

    const store: InternalObservableStore<V> = {
        subject,
        current: initialValue
    }

    return store;

}

function createObservableStoreContext<V>(store: InternalObservableStore<V>): InternalStoreContext<V> {
    const context = React.createContext(store as ObservableStore<V>);
    return [context, store];
}

interface ObservableStoreProps<V> {

    readonly children: JSX.Element | Provider<JSX.Element>;

    readonly store?: V;

}

interface ObservableStorePropsWithoutStore<V> {

    readonly children: JSX.Element | Provider<JSX.Element>;

}

export type ObservableStoreProviderComponent<V> = React.FunctionComponent<ObservableStoreProps<V>>;


/**
 * Hook to listen to store changes. Use undefined to not filter for properties
 * but we don't recommend it.
 */
export type UseStoreHook<V, K extends keyof V, N> = (keys: ReadonlyArray<K> | undefined, opts?: IUseStoreHookOpts<V, K, N>) => N;

export type UseContextHook<V> = () => V;

/**
 * Tag interface just for documentation right now.
 */
export interface StoreMutator {

}

const DEFAULT_USE_STORE_MAPPER = <V, K extends keyof V, N>(store: Pick<V, K>) => store;

export type UseStoreMapper<V, K extends keyof V, N> = (store: Pick<V, K>) => N;

const DEFAULT_USE_STORE_FILTER = <V,  K extends keyof V>() => true;

/**
 * Given a store, only render the hook it the value passes the filter.  This is
 * an option for when we want to avoid triggering too many sub-component
 * re-renders by filtering before RXJS is pushed.
 */
export type UseStoreFilter<V, K extends keyof V, N> = (curr: N, next: N) => boolean;

export interface IUseStoreHookOpts<V, K extends keyof V, N> {
    readonly debug?: boolean;
    readonly filter: UseStoreFilter<V, K, N>;
    readonly mapper: UseStoreMapper<V, K, N>;
}

export type ObservableStoreTuple<V, M extends StoreMutator, C> = [
    ObservableStoreProviderComponent<V>,
    // NOTE: it's not possible to use a type for this because V is defined in the tuple
    <K extends keyof V, N>(keys: ReadonlyArray<K> | undefined, opts?: IUseStoreHookOpts<V, K, N>) => N,
    UseContextHook<C>,
    UseContextHook<M>,
];

/**
 * Create the callbacks. Called for every useCallbacks function so that we can
 * call hooks when the callbacks are created. This allows us to use other hooks
 * in our created callbacks.
 */
export type CallbacksFactory<V, M, C> = (storeProvider: Provider<V>, setStore: SetStore<V>, mutator: M) => C;

export type MutatorFactory<V, M> = (storeProvider: Provider<V>, setStore: SetStore<V>) => M;

// TODO: refactor this to take opts and include an initialValue and value ...
// initialValue can be the mock

// TODO: since mutator isn't always needed make it optional and just use defaults
// otherwise

// TODO: since callbacks were designed to work with hooks using it outside of
// a component means it will break.  A mutator can be used if you want to work
// with the store outside of a component.

export interface ObservableStoreOpts<V, M, C> {

    /**
     * The initial value for the store including defaults for every value.
     */
    readonly initialValue: V;

    readonly mutatorFactory: MutatorFactory<V, M>;

    /**
     * Used to create high level callbacks that can be injected into your
     * components with a useXCallbacks hook to mutate your store.  The callback
     * is a singleton and never updated so component memo works.
     */
    readonly callbacksFactory: CallbacksFactory<V, M, C>;

    /**
     * Same functionality as callbacksFactory but used with mocks so that you
     * can work with components using the mock without complex initialization.
     *
     * Used with more production apps so other developers don't need to worry
     * about configuration of our component system.
     *
     * Usually these mocks should just print to the console or perform some
     * action to note that they were called and with what arguments.
     */
    readonly mockCallbacksFactory?: CallbacksFactory<V, M, C>;

    /**
     * Do a shallow equals by default..
     */
    readonly enableShallowEquals?: boolean;

}

type ComponentCallbacksFactory<C> = () => C;

type InitialContextValues<V, M, C> = [
    InternalObservableStore<V>,
    M,
    ComponentCallbacksFactory<C>,
    SetStore<V>
];

/**
 * Create the initial values of the components we're working with (store
 * and callbacks)
 */
function createInitialContextValues<V, M, C>(opts: ObservableStoreOpts<V, M, C>): InitialContextValues<V, M, C> {

    const {initialValue, mutatorFactory, callbacksFactory} = opts;

    const store = createInternalObservableStore(initialValue);

    const setStore = (value: V) => {

        // the current value needs to be set because we have to first update
        // the value for other components which will be created with the
        // internal value
        store.current = value;

        // now we have to send the next value which will cause the
        // subscriber to update, which will increment the state iter, and
        // cause a new render with updated data.
        store.subject.next(value);

    };

    const storeProvider = () => store.current;

    const mutator = mutatorFactory(storeProvider, setStore);

    const componentCallbacksFactory = () => callbacksFactory(storeProvider, setStore, mutator);

    return [store, mutator, componentCallbacksFactory, setStore];

}

export function createObservableStore<V, M, C>(opts: ObservableStoreOpts<V, M, C>): ObservableStoreTuple<V, M, C> {

    const [store, mutator, componentCallbacksFactory, setStore] = createInitialContextValues(opts);

    const [storeContext,] = createObservableStoreContext<V>(store);

    const useStoreHook = <K extends keyof V, N>(keys: ReadonlyArray<K> | undefined,
                                                storeHookOpts: IUseStoreHookOpts<V, K, N>) => {

        return useObservableStore(storeContext, keys, {
            enableShallowEquals: opts.enableShallowEquals || false,
            filter: storeHookOpts.filter,
            mapper: storeHookOpts.mapper
        });

    }

    const callbacksContext = React.createContext<ComponentCallbacksFactory<C>>(componentCallbacksFactory);

    // NOTE: the callbacksFactory should be written with EXACTLY the same
    // semantics as a react hook since it's called directly including useMemo
    // and useCallbacks
    const useCallbacksHook = componentCallbacksFactory;

    const mutatorContext = React.createContext<M>(mutator);

    const useMutatorHook: UseContextHook<M> = () => {
        return React.useContext(mutatorContext);
    }

    const ObservableProviderComponent = (props: ObservableStoreProps<V>) => {

        // FIXME: I think the problem is because we're creating ONE store object so the context is working
        // BUT it means that the store object needs to be recreated each time

        React.useMemo(() => {
            // this is a hack to setStore only on the initial render and only when we have a props.store
            if (props.store !== undefined) {
                setStore(props.store);
            }
        }, [props.store]);

        return (
            <storeContext.Provider value={store}>
                <callbacksContext.Provider value={componentCallbacksFactory}>
                    <mutatorContext.Provider value={mutator}>
                        {props.children}
                    </mutatorContext.Provider>
                </callbacksContext.Provider>
            </storeContext.Provider>
        );

    }

    // FIXME
    // return [ObservableProviderComponent, useStoreHook, useCallbacksHook, useMutatorHook];

    return null!;

}
