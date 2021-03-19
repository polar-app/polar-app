import React, {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState
} from 'react';
import Button from "@material-ui/core/Button";

interface Ref<V> {
    readonly current: V;
}

interface MutableRef<V> {
    current: V;
}

export type StoreValue<V> = Ref<V>;
export type StoreSetValue<V> = (value: V) => void;

export type Store<V> = [StoreValue<V>, StoreSetValue<V>];

export function createStore<V>(initialValue: V): Store<V> {

    const [state] = useState((): MutableRef<V> => {
        return {current: initialValue};
    })

    const [iter, setIter] = useState(0);

    const setState = useCallback((newState: V) => {
        state.current = newState;
        setIter(Date.now());
    }, [state]);

    return [state, setState];

}

export type StoreContext<V> = React.Context<V>;

export type ContextStore<V> = [StoreContext<V>, Store<V>];

type ContextStoreType<V> = Store<V> | undefined;

export function createContextStore<V>(initialValue: V): React.Context<ContextStoreType<V>> {

    return createContext<ContextStoreType<V>>(undefined);

}

const MyCallbacks = () => {
    // now from here I can create a bunch of functions, that
    // access setState,
}

interface MyInvitations {
    readonly alice: string;
    readonly bob: string;
    readonly carol: string;
}

const MyContextStore = createContextStore({alice: 'no', bob: 'no', carol: 'no'});

export function useMyContextStore() {
    return useContext(MyContextStore);
}

const MyActionsComponent = () => {

    const store = useMyContextStore();

    const value = store?.[0];
    const setValue = store?.[1];

    const computeNewValue = (invitations: MyInvitations): MyInvitations => {
        return {
            ...invitations,
            alice: invitations.alice === 'yes' ? 'no' : 'yes'
        };
    }

    return (
        <div>
            hello world:

            {value && setValue && (

                <div>
                    alice: {value.current?.alice}

                    <Button variant="contained"
                            onClick={() => setValue(computeNewValue(value.current))}>
                        toggle
                    </Button>
                </div>

            )}

        </div>
    )

}

// FIXME: how would this share across localstorage and/or persist values long
// term

//
// problems with this design...
//  - all intermediate components get re-rendered
//  - what if we could use context to distribute an initial reactive value
//    to which we could subscribe and subscribe to individual components?

export const MyContextStoreComponent = () => {

    console.log("MyContextStoreComponent: rendering");

    const store = createStore({
        alice: 'yes',
        bob: 'yes',
        carol: 'yes'
    });

    return (
        <MyContextStore.Provider value={store}>
            <MyActionsComponent/>
        </MyContextStore.Provider>
    );

}
