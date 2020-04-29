import {Subject} from "rxjs";
import React, {useContext, useState} from "react";

interface InternalObservableStore<V> {

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

export function useObservableStore<V>(context: React.Context<ObservableStore<V>>): Store<V> {

    const internalObservableStore = useContext(context) as InternalObservableStore<V>;

    const iter = React.useRef(0);
    const [, setIter] = useState();

    // FIXMEL must have component unmount support...

    React.useEffect(() => {
        internalObservableStore.subject.subscribe(value => {
            setIter(++iter.current);
        })
    }, [])

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

export type StoreContext<V> = [React.Context<ObservableStore<V>>, ObservableStore<V>];

// TODO: consider returning an component like ObservableStore value= with just the
// raw value.
export function createObservableStoreContext<V>(initialValue: V): StoreContext<V> {

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

type ObservableStoreComponent<V> = (props: ObservableStoreProps<V>) => JSX.Element;

export function createObservableStore<V>(initialValue: V): ObservableStoreComponent<V> {

    return (props: ObservableStoreProps<V>) => {

        const [context, store] = createObservableStoreContext(initialValue);

        const value: ObservableStore<V> = props.value ? {...store, current: props.value} : store;

        return (
            <context.Provider value={value}>
                {props.children}
            </context.Provider>

        )

    }

}


