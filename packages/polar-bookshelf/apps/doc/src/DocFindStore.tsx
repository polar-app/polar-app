import React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {
    createObservableStore,
    SetStore
} from "../../../web/js/react/store/ObservableStore";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {
    Finder,
    FindHandler,
    IFindOpts,
    IFindOptsBase,
    IMatches
} from "./Finders";

export interface IDocFindStore {

    readonly active: boolean;

    /**
     * The finder used when searching documents.  This is set once the document
     * is loaded.
     */
    readonly finder?: Finder;

    readonly findHandler?: FindHandler;

    /**
     * The number of matches we have.
     */
    readonly matches?: IMatches;

    /**
     * The find options being used
     */
    readonly opts: IFindOptsBase;

}

export interface IDocFindCallbacks {

    readonly setFinder: (finder: Finder) => void;

    readonly setActive: (findActive: boolean) => void;

    readonly setFindHandler: (findHandler: FindHandler | undefined) => void;

    readonly doFindNext: () => void;

    doFind(opts: IFindOpts): void;
    setMatches(matches: IMatches | undefined): void;
    setOpts(opts: IFindOptsBase | undefined): void;

    /**
     * Whether to keep the bar active or not
     */
    reset(active?: boolean): void;

}

const initialStore: IDocFindStore = {
    active: false,
    opts: {
        query: "",
        caseSensitive: false
    }
}

interface Mutator {

}

function mutatorFactory(storeProvider: Provider<IDocFindStore>,
                        setStore: SetStore<IDocFindStore>): Mutator {

    function reduce(): IDocFindStore | undefined {
        return undefined;
    }

    return {};

}

type IDocMetaProvider = () => IDocMeta | undefined;

function callbacksFactory(storeProvider: Provider<IDocFindStore>,
                          setStore: (store: IDocFindStore) => void,
                          mutator: Mutator): IDocFindCallbacks {

    function setFinder(finder: Finder) {
        const store = storeProvider();
        setStore({...store, finder});
    }

    function setFindHandler(findHandler: FindHandler | undefined) {
        const store = storeProvider();
        setStore({...store, findHandler});
    }

    function setActive(active: boolean) {

        const store = storeProvider();

        if (active) {
            setStore({...store, active})
        } else {
            if (store.findHandler) {
                store.findHandler!.cancel();
            }
            setStore({...store, active, findHandler: undefined})
        }

    }

    function doFind(opts: IFindOpts) {

        const store = storeProvider();
        const {finder} = store;

        const doHandle = (opts: IFindOpts) => {

            if (store.findHandler) {
                store.findHandler.cancel();
            }

            if (finder) {

                setStore({...store, matches: undefined, opts})
                const findHandler = finder!.exec(opts);
                setFindHandler(findHandler);

            } else {
                console.warn("No finder: ", finder);
            }

        };

        doHandle(opts);

    }

    function doFindNext() {

        const store = storeProvider();

        if (store.findHandler) {
            store.findHandler.next();
        }

    }

    function setMatches(matches: IMatches | undefined) {

        const store = storeProvider();

        if ( !store.active) {
            return;
        }

        setStore({...store, matches});

    }

    function setOpts(opts: IFindOptsBase): void {
        const store = storeProvider();
        setStore({...store, opts});
    }

    function reset(active: boolean = false) {

        const store = storeProvider();

        const findHandler = store.findHandler;

        setStore({
            ...store,
            matches: undefined,
            opts: {...store.opts, query: ""},
            active,
            findHandler: undefined
        });

        if (findHandler) {
            findHandler.cancel();
        }

    }

    // TODO: migrate to useMemo

    return {
        setActive,
        setFinder,
        setFindHandler,
        doFind,
        setMatches,
        setOpts,
        reset,
        doFindNext
    };

}

export const [DocFindStoreProviderDelegate, useDocFindStore, useDocFindCallbacks, useDocFindMutator]
    = createObservableStore<IDocFindStore, Mutator, IDocFindCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });

interface IProps {
    readonly children: React.ReactElement;
}

export const DocFindStore = React.memo(function DocFindStore(props: IProps) {
    return (
        <DocFindStoreProviderDelegate>
            {props.children}
        </DocFindStoreProviderDelegate>
    );
});

DocFindStore.displayName='DocFindStore';

