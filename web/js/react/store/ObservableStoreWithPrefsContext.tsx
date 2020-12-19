import * as React from 'react';
import {
    createObservableStore, createPrefsHandler,
    ObservableStoreOpts, ObservableStoreProps,
    ObservableStoreTuple,
    PrefsReader,
    PrefsWriter
} from "./ObservableStore";
import {usePrefsContext} from "../../../../apps/repository/js/persistence_layer/PrefsContext2";

/**
 * Uses usePrefsContext, and a key, to create a PrefsHandler and the setStore on init
 * @param opts the options for the main observable store.
 * @param pref the key to use to store data in the prefs
 * @param keys the keys in the store to use.
 */
export function createObservableStoreWithPrefsContext<V, M, C, P extends keyof V>(opts: ObservableStoreOpts<V, M, C>,
                                                                                  pref: string,
                                                                                  keys: ReadonlyArray<P>): ObservableStoreTuple<V, M, C> {

    const prefsContext = usePrefsContext();

    const p = prefsContext.fetch(pref);

    const reader: PrefsReader<V, P> = () => {

        if (p) {

            try {
                return JSON.parse(p.value);
            } catch (e) {
                console.error("Unable to read prefs");
            }

        }

        return undefined;

    }

    const writer: PrefsWriter<V, P> = (prefs: Pick<V, P>) => {
        prefsContext.set(pref, JSON.stringify(prefs));
        prefsContext.commit().catch(err => console.error("Unable to persist prefs with store: ", err));
    }

    const prefsHandler = createPrefsHandler(keys, reader, writer);

    const [StoreProvider, useStore, useCallbacks, useMutator, useStoreReducer, setStore, storeProvider] = createObservableStore<V, M, C>({...opts, prefsHandler});

    // this is the last step... how do we set the store?

    const StoreProviderWithPrefs = React.memo((props: ObservableStoreProps<V>) => {

        React.useEffect(() => {
            const store = storeProvider();
            setStore(prefsHandler.createInitialStoreWithPrefs(store));
        }, [])

        return (
            <StoreProvider {...props}>
                {props.children}
            </StoreProvider>
        );

    });

    return [StoreProviderWithPrefs, useStore, useCallbacks, useMutator, useStoreReducer, setStore, storeProvider];

}
