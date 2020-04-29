import {Subject, Subscription} from "rxjs";
import React, {useContext, useEffect, useState} from "react";

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


interface ObservableStore<V> {

    /**
     * The current value, used for the the initial render of each component.
     */
    readonly current: V;

}

export type SetStore<V> = (value: V) => void;
export type Store<V> = [V, SetStore<V>];

function useComponentDidMount<T>(delegate: () => void) {
    // https://dev.to/trentyang/replace-lifecycle-with-hooks-in-react-3d4n

    // will only execute the first time.
    useEffect(() => delegate(), []);
}

function useComponentWillUnmount(delegate: () => void) {
    // if we return a function it will only execute on unmount
    useEffect(() => delegate, []);
}


export function useObservableStore<V>(context: React.Context<ObservableStore<V>>): Store<V> {

    const internalObservableStore = useContext(context) as InternalObservableStore<V>;

    const iterRef = React.useRef(0);
    const subscriptionRef = React.useRef<Subscription | undefined>(undefined);
    const [, setIter] = useState();

    useComponentDidMount(() => {

        subscriptionRef.current = internalObservableStore.subject.subscribe(() => {
            // the internal current in the context is already updated.
            setIter(++iterRef.current);
        });

    });

    useComponentWillUnmount(() => {

        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
        }

    })

    // FIXME: this shold NOT return a setter here, I think, as the store, itself
    // should export it's own setters/mutators
    const setStore = React.useMemo(() => {

        return (value: V) => {

            // the current value needs to be set because we have to first update
            // the value for other components which will be created with the
            // internal value
            internalObservableStore.current = value;

            // now we have to send the next value which will cause the
            // subscriber to update, which will increment the state iter, and
            // cause a new render with updated data.
            internalObservableStore.subject.next(value);

        };

    }, []);

    return [internalObservableStore.current, setStore];

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
    readonly children: React.ReactNode;
}

export type ObservableStoreProvider<V> = (props: ObservableStoreProps<V>) => JSX.Element;

export type ObservableStoreTuple<V> = [ObservableStoreProvider<V>, React.Context<ObservableStore<V>>, SetStore<V>];

// FIXME: this doesn't return a setter so we're unable to make our core
// mutator functions there...
export function createObservableStore<V>(initialValue: V): ObservableStoreTuple<V> {

    const [context, store] = createObservableStoreContext(initialValue);

    const setStore = () => {

        return (value: V) => {

            // the current value needs to be set because we have to first update
            // the value for other components which will be created with the
            // internal value
            store.current = value;

            // now we have to send the next value which will cause the
            // subscriber to update, which will increment the state iter, and
            // cause a new render with updated data.
            store.subject.next(value);

        };

    };

    const provider = (props: ObservableStoreProps<V>) => {

        const value: ObservableStore<V> = props.value ? {...store, current: props.value} : store;

        return (
            <context.Provider value={value}>
                {props.children}
            </context.Provider>

        )

    }

    return [provider, context, setStore];

}


