import React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {Logger} from "polar-shared/src/logger/Logger";
import {
    createObservableStore,
    SetStore
} from "../../../web/spectron0/material-ui/store/ObservableStore";
import {DocAnnotation} from "../../../web/js/annotation_sidebar/DocAnnotation";
import {AnnotationRepoFilters2} from "../../repository/js/annotation_repo/AnnotationRepoFilters2";
import {DocAnnotationSorter} from "../../../web/js/annotation_sidebar/DocAnnotationSorter";

const log = Logger.create();

interface IAnnotationSidebarStore {

    /**
     * The text of the annotations on the right.
     */
    readonly filter: string;

    /**
     * The raw annotations data which is unfiltered, unsorted, and form which
     * the view is derived.
     */
    readonly data: ReadonlyArray<DocAnnotation>;

    /**
     * The annotations to display in the UI which is (optionally) filtered.
     */
    readonly view: ReadonlyArray<DocAnnotation>;

}

interface IAnnotationSidebarCallbacks {

    readonly setFilter: (filter: string) => void;

    // setData must be here because the sidebar manages its own sorting.
    readonly setData: (data: ReadonlyArray<DocAnnotation>) => void;

}

const initialStore: IAnnotationSidebarStore = {
    filter: "",
    data: [],
    view: []
}

namespace mutations {

    export interface ISetFilter {
        readonly mutation: 'set-filter';
        readonly filter: string;
    }

    export interface ISetData {
        readonly mutation: 'set-data',
        readonly data: ReadonlyArray<DocAnnotation>;
    }

    export type IMutation = ISetFilter | ISetData;

}

type IMutation = mutations.ISetFilter | mutations.ISetData;

interface Mutator {
    readonly doUpdate: (mutation: IMutation) => void;
}

function mutatorFactory(storeProvider: Provider<IAnnotationSidebarStore>,
                        setStore: SetStore<IAnnotationSidebarStore>): Mutator {

    function reduce(store: IAnnotationSidebarStore,
                    mutation: IMutation): IAnnotationSidebarStore {

        switch (mutation.mutation) {

            case "set-filter":

                if (mutation.filter !== store.filter) {

                    const view = AnnotationRepoFilters2.execute(store.data, {text: mutation.filter});

                    return {
                        ...store,
                        ...mutation,
                        view
                    };

                } else {
                    return store;
                }

            case "set-data":
                const view = DocAnnotationSorter.sort(mutation.data);
                return {...store, ...mutation, view};

        }

        return store;

    }

    function doUpdate(mutation: mutations.IMutation) {
        const store = storeProvider();

        const newStore = reduce(store, mutation);
        setStore(newStore);

    }

    return {doUpdate};

}

function callbacksFactory(storeProvider: Provider<IAnnotationSidebarStore>,
                          setStore: (store: IAnnotationSidebarStore) => void,
                          mutator: Mutator): IAnnotationSidebarCallbacks {

    function setFilter(text: string) {
        mutator.doUpdate({mutation: 'set-filter', filter: text});
    }

    function setData(data: ReadonlyArray<DocAnnotation>) {
        mutator.doUpdate({mutation: 'set-data', data});
    }

    return {
        setFilter,
        setData
    };

}

export const [AnnotationSidebarStoreProvider, useAnnotationSidebarStore, useAnnotationSidebarCallbacks, useAnnotationSidebarMutator]
    = createObservableStore<IAnnotationSidebarStore, Mutator, IAnnotationSidebarCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });

