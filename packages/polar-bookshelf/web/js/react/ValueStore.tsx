import * as React from "react";
import {action, autorun, computed, makeObservable, observable} from "mobx";

export interface IValueStore<V> {
    readonly value: V;
    readonly setValue: (value: V) => void;
}

/**
 * Keeps a single value in a store so that subscribers can read from it easily.
 *
 * To handle null or undefined, declare the type as supporting undefined and then
 * make the initialValue undefined.
 *
 */
export class ValueStore<V> implements IValueStore<V> {

    @observable _value: V;

    constructor(initialValue: V) {
        this._value = initialValue;
        makeObservable(this);
    }

    /**
     * Get the value just by using a getter.
     */
    @computed get value() {
        return this._value;
    }

    /**
     * Allow an external user set the value.
     */
    @action setValue(value: V) {
        this._value = value;
    }

}

export interface ValueStoreProviderProps<V> {
    readonly initialStore: V;
}

export type ValueStoreProvider<V> = React.FC<ValueStoreProviderProps<V>>;

export type UseValueStore<V> = () => V;

export type ValueStoreTuple<V> = Readonly<[
    ValueStoreProvider<V>,
    UseValueStore<V>
]>;



/**
 * Create a ValueStore which is a much cleaner way to share values and update
 * them without having to use react context and re-render an entire tree.
 *
 * This internally uses MobX and autorun to allow each component to easily
 * and efficiently share a value across an entire react tree.
 *
 * In order to use this you must use the provider at the root, and anywhere
 * within that subtree you can the useValueStore hook.
 *
 * This tries to solve a number of anti-patterns I found in the past including:
 *
 * - The value generic type V should never include undefined.  The user should
 * define that and if they want it initially defined they just set an
 * initialValue.  The reason this is done is that internally we should be blind
 * to null or undefined because those could have value to the user of the API.
 *
 *  - We NEVER set an initial value when creating the context store object.  It
 *  should only be set with the provider as an initialValue property otherwise
 *  a global value can leak across react trees.
 */
export function createValueStore<V>(): ValueStoreTuple<V> {

    const Context = React.createContext<ValueStore<V>>(null!);

    const ValueStoreProvider: React.FC<ValueStoreProviderProps<V>> = React.memo(function ValueStoreProvider(props) {

        const store = React.useMemo(() => new ValueStore(props.initialStore), []);

        return (
            <Context.Provider value={store}>
                {props.children}
            </Context.Provider>
        );

    });

    const useValueStore = (): V => {

        const valueStore = React.useContext(Context);
        const [value, setValue] = React.useState(valueStore.value);

        React.useEffect(() => {

            return autorun(() => {
                setValue(valueStore.value);
            })

        }, [valueStore, setValue])

        return value;

    }

    return [ValueStoreProvider, useValueStore];

}
