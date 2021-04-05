import * as React from 'react';
import {
    createObservableStore,
    ObservableStoreOpts, ObservableStoreProps,
    ObservableStoreTuple, pick,
} from "./ObservableStore";
import {usePrefsContext} from "../../../../apps/repository/js/persistence_layer/PrefsContext2";

/**
 * A handler that the internal store uses when reading the initial store and
 * writing the prefs.
 */
export interface IPrefsHandler<V> {

    /**
     * Create the initial story by applying the prefs.
     */
    readonly createInitialStoreWithPrefs: (store: V) => V;

    readonly writePrefs: (store: V) => void;

}

/**
 * The raw prefs reader that reads the values from Firestore, etc.
 *
 * We return undefined if there are no prefs so that must be handled properly.
 */
export type PrefsReader<V, P extends keyof V> = () => Pick<V, P> | undefined

/**
 * The raw prefs writer that stores the values in Firestore, etc
 */
export type PrefsWriter<V, P extends keyof V> = (prefs: Pick<V, P>) => void;

interface IPrefsBacking<V, P extends keyof V> {
    readonly reader: PrefsReader<V, P>,
    readonly writer: PrefsWriter<V, P>
}

function usePrefsBackingUsingLocalStorage<V, P extends keyof V>(pref: string): IPrefsBacking<V , P> {

    const reader: PrefsReader<V, P> = React.useCallback(() => {

        const p = localStorage.getItem('pref:' + pref);

        if (p) {

            try {
                return JSON.parse(p);
            } catch (e) {
                console.error("Unable to read prefs");
            }

        }

        return undefined;

    }, [pref]);

    const writer: PrefsWriter<V, P> = React.useCallback((prefs: Pick<V, P>) => {

        localStorage.setItem('pref:' + pref, JSON.stringify(prefs));

    }, [pref]);

    return {reader, writer};

}

function usePrefsBackingUsingPrefsContext<V, P extends keyof V>(pref: string): IPrefsBacking<V , P> {

    const prefsContext = usePrefsContext();

    const reader: PrefsReader<V, P> = React.useCallback(() => {

        const p = prefsContext.fetch(pref);

        if (p) {

            try {
                return JSON.parse(p.value);
            } catch (e) {
                console.error("Unable to read prefs");
            }

        }

        return undefined;

    }, [pref, prefsContext]);

    const writer: PrefsWriter<V, P> = React.useCallback((prefs: Pick<V, P>) => {

        prefsContext.set(pref, JSON.stringify(prefs));

        prefsContext.commit()
            .catch(err => console.error("Unable to persist prefs with store: ", err));

    }, [pref, prefsContext]);

    return {reader, writer};

}

function usePrefsHandler<V, P extends keyof V>(pref: string, keys: ReadonlyArray<P>): IPrefsHandler<V> {

    const {reader, writer} = usePrefsBackingUsingLocalStorage<V, P>(pref);

    const createInitialStoreWithPrefs = React.useCallback((store: V): V => {

        const prefs = reader();

        if (prefs) {

            const newStore = {...store};

            for (const key of keys) {

                if (prefs[key]) {
                    newStore[key] = prefs[key];
                }

            }

            return newStore;

        }

        return store;

    }, [keys, reader]);

    const writePrefs = React.useCallback((store: V) => {
        const prefs = pick(store, keys);
        writer(prefs);
    }, [keys, writer]);

    return {createInitialStoreWithPrefs, writePrefs};

}

/**
 * Uses usePrefsContext, and a key, to create a PrefsHandler and the setStore on init
 *
 * @param opts the options for the main observable store.
 * @param pref the key to use to store data in the prefs
 * @param keys the keys in the store to use.
 */
export function createObservableStoreWithPrefsContext<V, M, C>(opts: ObservableStoreOpts<V, M, C>,
                                                               pref: string,
                                                               keys: ReadonlyArray<keyof V>): ObservableStoreTuple<V, M, C> {

    const [StoreProvider, useStore, useCallbacks, useMutator, useStoreReducer, useSetStore, useStoreProvider] = createObservableStore<V, M, C>({...opts});

    // this is the last step... how do we set the store?

    const WithMountedStore = React.memo(function WithMountedStore(props: ObservableStoreProps<V>) {

        const {createInitialStoreWithPrefs, writePrefs} = usePrefsHandler<V, keyof V>(pref, keys);

        const [initialized, setInitialized] = React.useState(false);
        const setStore = useSetStore();
        const storeProvider = useStoreProvider();

        const store = useStore(undefined);
        const storeIter = React.useRef(0);

        const writeUpdatedPrefs = React.useCallback(() => {

            if (storeIter.current > 0) {
                writePrefs(store);
            }

            ++storeIter.current;

        }, [store, writePrefs]);

        React.useEffect(() => {
            writeUpdatedPrefs();
        }, [store, writePrefs, writeUpdatedPrefs]);

        React.useEffect(() => {

            if (! initialized) {

                const store = storeProvider();
                const initialStore = createInitialStoreWithPrefs(store);
                setStore(initialStore);
                // once the store has been set , trigger setInit to true...
                setInitialized(true);

            }

        }, [createInitialStoreWithPrefs, initialized, setStore, storeProvider])

        return (
            <>
                {initialized && props.children}
            </>
        );

    });


    const StoreProviderWithPrefs = React.memo(function StoreProviderWithPrefs(props: ObservableStoreProps<V>) {

        return (
            <StoreProvider {...props}>
                <WithMountedStore>
                    {props.children}
                </WithMountedStore>
            </StoreProvider>
        );

    });

    return [StoreProviderWithPrefs, useStore, useCallbacks, useMutator, useStoreReducer, useSetStore, useStoreProvider];

}
