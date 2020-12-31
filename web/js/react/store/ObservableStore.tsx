import {Subject} from "rxjs";
import React, {useContext, useState} from "react";
import {Provider} from "polar-shared/src/util/Providers";
import { Equals } from "./Equals";

export function pick<T, K extends keyof T>(value: T, keys: ReadonlyArray<K>): Pick<T, K> {

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

export type StoreProvider<V> = () => V;
export type SetStore<V> = (value: V) => void;
export type Store<V> = [V, SetStore<V>];

interface IUseObservableStoreOpts<V, K extends keyof V> extends IUseStoreHookOpts<V, K> {
    readonly enableShallowEquals: boolean;
}

type Dict = {[key: string]: any};

export type UseStoreReducerFilter<R> = (prev: R, next: R) => boolean;

interface IUseObservableStoreReducerOpts<R> {
    readonly enableShallowEquals?: boolean;
    readonly debug?: boolean;
    readonly filter?: UseStoreReducerFilter<R>;
}

export function useObservableStoreReducer<V, R>(context: React.Context<InternalObservableStore<V>>,
                                                reducer: (value: V) => R,
                                                opts: IUseObservableStoreReducerOpts<R> = {}): R {

    const internalObservableStore = useContext(context) as InternalObservableStore<V>;

    const [value, setValue] = useState<R>(reducer(internalObservableStore.current));
    const valueRef = React.useRef(value);

    React.useEffect(() => {

        const subscription = internalObservableStore.subject.subscribe((nextStore) => {

            function doUpdateValue(newValue: R) {
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

            const nextValue = reducer(nextStore);

            if (! isEqual(currValue, nextValue)) {

                if (opts.filter && ! opts.filter(currValue, nextValue)) {
                    // we HAVE to update the valueRef so that the next filter will work properly

                    valueRef.current = nextValue;
                    // the value didn't pass the filter so don't update it...
                    return;
                }

                // the internal current in the context is already updated.
                // debug("values are updated: ", nextValuePicked, currValuePicked);
                return doUpdateValue(nextValue);

            } else {
                // debug("values are NOT updated: ", nextValuePicked, currValuePicked);
            }

        })

        return () => {
            subscription.unsubscribe();
        }

    }, [internalObservableStore.subject, opts, reducer]);

    // return the initial value...
    return value;

}


export function useObservableStore<V, K extends keyof V>(context: React.Context<InternalObservableStore<V>>,
                                                         keys: ReadonlyArray<K> | undefined,
                                                         opts: IUseObservableStoreOpts<V, K>): Pick<V, K> {

    const internalObservableStore = useContext(context) as InternalObservableStore<V>;

    const [value, setValue] = useState<V>(internalObservableStore.current);
    const valueRef = React.useRef(value);

    React.useEffect(() => {

        const subscription = internalObservableStore.subject.subscribe((nextValue) => {

            function doUpdateValue(newValue: V) {
                setValue(newValue);
                valueRef.current = newValue;
            }

            const currValue = valueRef.current;

            if (nextValue === currValue) {
                // we're already done as it's the same value
                return;
            }

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

                const nextValuePicked = pick(nextValue, keys);
                const currValuePicked = pick(currValue, keys);

                if (! isEqual(currValuePicked, nextValuePicked)) {

                    // console.log("values differ, ", currValuePicked, nextValuePicked);

                    if (opts.filter && ! opts.filter(nextValuePicked)) {
                        // the value didn't pass the filter so don't update it...
                        return;
                    }

                    // the internal current in the context is already updated.
                    // debug("values are updated: ", nextValuePicked, currValuePicked);
                    return doUpdateValue(nextValue);

                } else {
                    // debug("values are NOT updated: ", nextValuePicked, currValuePicked);
                }

            } else {

                const currValue = valueRef.current;

                if (! isEqual(currValue, nextValue)) {
                    // we can STILL do the lazy comparison here and only
                    // update when the value has actually changed.
                    return doUpdateValue(nextValue);

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

export type InternalStoreContext<V> = [React.Context<ObservableStore<V>>];

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

function createObservableStoreContext<V>(store: InternalObservableStore<V>) {
    return React.createContext(store);
}

export interface ObservableStoreProps<V> {

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
export type UseStoreHook<V, K extends keyof V> = (keys: ReadonlyArray<K> | undefined, opts?: IUseStoreHookOpts<V, K>) => Pick<V, K>;

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
export type UseStoreFilter<V, K extends keyof V> = (store: Pick<V, K>) => boolean;

export interface IUseStoreHookOpts<V, K extends keyof V> {
    readonly debug?: boolean;
    readonly filter: UseStoreFilter<V, K>;
    // readonly mapper?: UseStoreMapper<V, K, N>;
}

export type ObservableStoreTuple<V, M extends StoreMutator, C> = [
    ObservableStoreProviderComponent<V>,
    // NOTE: it's not possible to use a type for this because V is defined in the tuple
    <K extends keyof V>(keys: ReadonlyArray<K> | undefined, opts?: IUseStoreHookOpts<V, K>) => Pick<V, K>,
    UseContextHook<C>,
    UseContextHook<M>,
    <R extends any>(reducer: (value: V) => R, opts?: IUseObservableStoreReducerOpts<R>) => R,
    SetStore<V>,
    StoreProvider<V>
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
    M,
    ComponentCallbacksFactory<C>,
    SetStore<V>,
    StoreProvider<V>
];

/**
 * Create the initial values of the components we're working with (store
 * and callbacks)
 */
function createInitialContextValues<V, M, C>(opts: ObservableStoreOpts<V, M, C>,
                                             internalObservableStore: InternalObservableStore<V>): InitialContextValues<V, M, C> {

    const {mutatorFactory, callbacksFactory} = opts;

    const setStore = (value: V) => {

        // the current value needs to be set because we have to first update
        // the value for other components which will be created with the
        // internal value
        internalObservableStore.current = value;

        // now we have to send the next value which will cause the
        // subscriber to update, which will increment the state iter, and
        // cause a new render with updated data.
        internalObservableStore.subject.next(value);

    };

    const storeProvider = () => internalObservableStore.current;

    const mutator = mutatorFactory(storeProvider, setStore);

    const componentCallbacksFactory = () => callbacksFactory(storeProvider, setStore, mutator);

    return [mutator, componentCallbacksFactory, setStore, storeProvider];

}

// FIXME: there is a major bug here because the actually subject backing is
// global even though the context is not.
//
// TODO: a store for EACH component and memoize them but then I can't use useFoo()
//
// FIXME: I could migrate to mobx but then it won't work with our current store
// and I have to completely rewrite it.  Also, I'm not confident enough in it yet
// to it work with 'observer' because that's not always fired.
//
// FIXME rewriting the whole thing is going to be hard... it's probably going to
// be JUST as hard as cutting over to mobx so might as well do it right.
//
// FIXME: I could also bite off migrating to RTL (react testing library) to make
// sure everything works properly and is tested.
//
// FIXME: migrate the current code into master so that I can iterate on it moving
// forward and I won't have to be locked out of the main branch.

// FIXME: I think I have to fix the ObservableStore because if I dont' I'm going
// to have to rewrite ALL the components since it's now global.
//
// see if there's an EASY way to do this by creating the context for each new
// instance... or at least overwrriting them.. .

//
// FIXME: I could create a new context object named SubjectContext which stores the context and then
// I just call useSubjectContext() everywhere which will solve that problem I thinkl
//
// FIXME: it's just createInternalObservableStore that I need to clean up I think.

export function createObservableStore<V, M, C>(opts: ObservableStoreOpts<V, M, C>): ObservableStoreTuple<V, M, C> {

    // FIXME: another idea, just create context here... then , within the provider, perform all the
    // variable creation on mount.

    const internalObservableStore = createInternalObservableStore(opts.initialValue);

    const storeContext = createObservableStoreContext<V>(internalObservableStore);

    const [mutator, componentCallbacksFactory, setStore, storeProvider] = createInitialContextValues(opts, internalObservableStore);

    const useStoreHook = <K extends keyof V>(keys: ReadonlyArray<K> | undefined,
                                             storeHookOpts: IUseStoreHookOpts<V, K> = {
                                                 filter: DEFAULT_USE_STORE_FILTER
                                             }) => {

        return useObservableStore(storeContext, keys, {
            enableShallowEquals: opts.enableShallowEquals || false,
            filter: storeHookOpts.filter
        });

    }

    const useStoreReducerHook = <R extends any>(reducer: (value: V) => R, opts: IUseObservableStoreReducerOpts<R> = {}) => {
        return useObservableStoreReducer(storeContext, reducer, opts);
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
            <storeContext.Provider value={internalObservableStore}>
                <callbacksContext.Provider value={componentCallbacksFactory}>
                    <mutatorContext.Provider value={mutator}>
                        {props.children}
                    </mutatorContext.Provider>
                </callbacksContext.Provider>
            </storeContext.Provider>
        );

    }

    return [ObservableProviderComponent, useStoreHook, useCallbacksHook, useMutatorHook, useStoreReducerHook, setStore, storeProvider];

}
//
// export function createObservableStore2<V, M, C>(opts: ObservableStoreOpts<V, M, C>): ObservableStoreTuple<V, M, C> {
//
//     const storeContext = React.createContext<ObservableStore<V>>(undefined!);
//     const callbacksContext = React.createContext<ComponentCallbacksFactory<C>>(undefined!);
//     const mutatorContext = React.createContext<M>(undefined!);
//
//     const useStoreHook: UseStoreHook<V> = <K extends keyof V>(keys: ReadonlyArray<K> | undefined, opts?: IUseStoreHooksOpts) => {
//         return useObservableStore(storeContext, keys, opts);
//     }
//
//     // NOTE: the callbacksFactory should be written with EXACTLY the same
//     // semantics as a react hook since it's called directly including useMemo
//     // and useCallbacks
//     const useCallbacksHook = componentCallbacksFactory;
//
//     const useMutatorHook: UseContextHook<M> = () => {
//         return React.useContext(mutatorContext);
//     }
//
//     interface ProviderComponentInnerProps<V> {
//         readonly store: InternalObservableStore<V>;
//         readonly callbacks: ComponentCallbacksFactory<C>;
//         readonly mutator: M;
//         readonly children: JSX.Element | Provider<JSX.Element>;
//     }
//
//     const ProviderComponentInner = typedMemo((props: ProviderComponentInnerProps<V>) => {
//
//         return (
//             <storeContext.Provider value={props.store}>
//                 <callbacksContext.Provider value={props.callbacks}>
//                     <mutatorContext.Provider value={props.mutator}>
//                         {props.children}
//                     </mutatorContext.Provider>
//                 </callbacksContext.Provider>
//             </storeContext.Provider>
//         );
//
//     });
//
//     const ProviderComponent = typedMemo((props: ObservableStorePropsWithoutStore<V>) => {
//
//         const [store, mutator, callbacks, setStore] = React.useMemo(() => createInitialContextValues(opts), []);
//
//         return (
//             <>
//                 <ProviderComponentInner store={store}
//                                         callbacks={callbacks}
//                                         mutator={mutator}>
//                     {props.children}
//                 </ProviderComponentInner>
//             </>
//         );
//
//     });
//
//     return [ProviderComponent, useStoreHook, useCallbacksHook, useMutatorHook];
//
// }
//
//


