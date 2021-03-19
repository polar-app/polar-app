import * as React from 'react';
import {Subject} from "rxjs";
import { Provider } from 'polar-shared/src/util/Providers';
import {typedMemo, useRefValue} from "../../hooks/ReactHooks";
import {useComponentWillUnmount} from "../../hooks/ReactLifecycleHooks";

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

function createInternalObservableStore<V>(initialValue: V): InternalObservableStore<V> {

    const subject = new Subject<V>();
    subject.next(initialValue);

    const store: InternalObservableStore<V> = {
        subject,
        current: initialValue
    }

    return store;

}

export function createRXJSStore<V>(): [ProviderComponent<V>, UseSetStore<V>, UseStoreListener<V>] {

    const Context = React.createContext<InternalObservableStore<any>>(null!);

    const useSetStore: UseSetStore<V> = () => {

        const context = React.useContext(Context);

        return (value) => {
            context.current = value;
            context.subject.next(value);
        }

    };

    const useStoreListener = () => {

        const context = React.useContext(Context);
        const [state, setState] = React.useState(context.current);
        const stateRef = useRefValue(state);

        const subscriptionRef = React.useRef(context.subject.subscribe((nextValue) => {

            if (stateRef.current !== nextValue) {
                // TODO: isn't this technically setting the state during render???
                setState(nextValue);
            }

        }));

        useComponentWillUnmount(() => {

            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }

        });

        return state;
    }

    const Provider = typedMemo((props: IProviderProps<V>) => {

        const store = React.useMemo(() => createInternalObservableStore(props.initialValue), [props.initialValue]);

        return (
            <Context.Provider value={store}>
                {props.children}
            </Context.Provider>

        );

    });

    return [Provider, useSetStore, useStoreListener]

}

