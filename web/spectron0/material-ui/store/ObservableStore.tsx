import {Subject, Subscription} from "rxjs";
import React, {useContext, useEffect, useState} from "react";
import {Provider} from "polar-shared/src/util/Providers";
import {Preconditions} from "polar-shared/src/Preconditions";

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

export function useObservableStore<V>(context: React.Context<ObservableStore<V>>): V {

    const internalObservableStore = useContext(context) as InternalObservableStore<V>;

    const subscriptionRef = React.useRef<Subscription | undefined>(undefined);

    const [value, setValue] = useState<V>(internalObservableStore.current);

    useEffect(() => {

        // this is effectively componentDidMount
        subscriptionRef.current = internalObservableStore.subject.subscribe((value) => {
            // the internal current in the context is already updated.
            return setValue(value);
        });

        return () => {

            // this is effectively componentWillUnmount... however it's a bit
            // different as the component can't have any reference.  It seems
            // functional component are still referenced don't have this
            // evaluated

            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }

        }

    },[]);

    return value;

}

export type InternalStoreContext<V> = [React.Context<ObservableStore<V>>, InternalObservableStore<V>];

export type StoreContext<V> = [React.Context<ObservableStore<V>>, ObservableStore<V>];

function createObservableStoreContext<V>(initialValue: V): InternalStoreContext<V> {

    const subject = new Subject<V>();
    subject.next(initialValue);

    const store: InternalObservableStore<V> = {
        subject,
        current: initialValue
    }

    const context = React.createContext(store as ObservableStore<V>);

    return [context, store];

}

interface ObservableStoreProps<V> {
    readonly value?: V;
    readonly children: JSX.Element | Provider<JSX.Element>;
}

export type ObservableStoreProviderComponent<V> = (props: ObservableStoreProps<V>) => JSX.Element;

export type UseContextHook<V> = () => V;

export type UseCallbacksHook<C> = () => C;

/**
 * Tag interface just for documentation right now.
 */
export interface StoreMutator {

}

export type ObservableStoreTuple<V, M extends StoreMutator, C> = [
    ObservableStoreProviderComponent<V>,
    UseContextHook<V>,
    UseCallbacksHook<C>,
    M
];

/**
 * Create the callbacks. Called for every useCallbacks function so that we can
 * call hooks when the callbacks are created. This allows us to use other hooks
 * in our created callbacks.
 */
export type CallbacksFactory<V, M, C> = (storeProvider: Provider<V>, setStore: SetStore<V>, mutator: M) => C;

export type MutatorFactory<V, M> = (storeProvider: Provider<V>, setStore: SetStore<V>) => M;

// FIXME: refactor this to take opts and include an initialValue and value ...
// initialValue can be the mock

export function createObservableStore<V, M, C>(initialValue: V,
                                               mutatorFactory: MutatorFactory<V, M>,
                                               callbacksFactory: CallbacksFactory<V, M, C>): ObservableStoreTuple<V, M, C> {

    const [storeContext, store] = createObservableStoreContext(initialValue);

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

    const useContextHook: UseContextHook<V> = () => {
        return useObservableStore(storeContext);
    }

    const storeProvider = () => store.current;

    const mutator = mutatorFactory(storeProvider, setStore);

    const componentCallbacksFactory = () => callbacksFactory(storeProvider, setStore, mutator);
    const callbacksContext = React.createContext(componentCallbacksFactory);

    const useCallbacksHook: UseContextHook<C> = () => {
        const callbacksContextFactory = React.useContext(callbacksContext);
        const callbacks = callbacksContextFactory();
        Preconditions.assertPresent(callbacks, "callbacks");
        return callbacks;
    }

    const provider = (props: ObservableStoreProps<V>) => {

        if (props.value) {
            // change the value to start with...
            setStore(props.value);
        }

        return (
            <storeContext.Provider value={store}>
                <callbacksContext.Provider value={componentCallbacksFactory}>
                    {props.children}
                </callbacksContext.Provider>
            </storeContext.Provider>

        )

    }

    return [provider, useContextHook, useCallbacksHook, mutator];

}


