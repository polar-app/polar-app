import * as React from 'react';
import {Subject} from "rxjs";
import {Provider} from 'polar-shared/src/util/Providers';
import {typedMemo} from "../../hooks/ReactHooks";

export type ProviderComponent<V> = (props: IProviderProps<V>) => JSX.Element;

export type SetStore<V> = (value: V) => void;

export type UseSetStore<V> = () => (value: V) => void;

export type UseStoreListener<V> = () => V;

interface IProviderProps<V> {
    readonly initialValue: V;
    readonly children: JSX.Element | Provider<JSX.Element>;
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

function createInternalSubscriberStore<V>(initialValue: V): InternalObservableStore<V> {

    const subject = new Subject<V>();
    subject.next(initialValue);

    const store: InternalObservableStore<V> = {
        subject,
        current: initialValue
    }

    return store;

}

export function createSubscriberStore<V>(): [ProviderComponent<V>, UseSetStore<V>, UseStoreListener<V>] {

    const storeContext = React.createContext<InternalObservableStore<V>>(null!);

    const useSetter: UseSetStore<V> = () => {

        const context = React.useContext(storeContext);

        return (value) => {
            context.current = value;
            context.subject.next(value);
        }

    };

    const useGetter = () => {

        const context = React.useContext(storeContext);
        const [state, setState] = React.useState(context.current);

        React.useEffect(() => {

            const subscription = context.subject.subscribe((nextValue) => {
                setState(nextValue);
            });

            return () => {
                return subscription.unsubscribe();
            };

        }, [context.subject]);

        return state;

    }

    const Provider = typedMemo((props: IProviderProps<V>) => {

        const store = React.useMemo(() => createInternalSubscriberStore(props.initialValue), [props.initialValue]);

        return (
            <storeContext.Provider value={store}>
                {props.children}
            </storeContext.Provider>

        );

    });

    return [Provider, useSetter, useGetter]

}

