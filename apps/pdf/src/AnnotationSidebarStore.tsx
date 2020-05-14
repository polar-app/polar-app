import React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {Logger} from "polar-shared/src/logger/Logger";
import {
    createObservableStore,
    SetStore
} from "../../../web/spectron0/material-ui/store/ObservableStore";
import {IDocAnnotation} from "../../../web/js/annotation_sidebar/DocAnnotation";
import {AnnotationRepoFilters2} from "../../repository/js/annotation_repo/AnnotationRepoFilters2";
import {DocAnnotationSorter} from "../../../web/js/annotation_sidebar/DocAnnotationSorter";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {DocAnnotationLoader2} from "../../../web/js/annotation_sidebar/DocAnnotationLoaders";
import {DocFileResolvers} from "../../../web/js/datastore/DocFileResolvers";
import {usePersistenceLayerContext} from "../../repository/js/persistence_layer/PersistenceLayerApp";
import {Mappers} from "polar-shared/src/util/Mapper";

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
    readonly data: ReadonlyArray<IDocAnnotation>;

    /**
     * The annotations to display in the UI which is (optionally) filtered.
     */
    readonly view: ReadonlyArray<IDocAnnotation>;

}

interface IAnnotationSidebarCallbacks {

    readonly setFilter: (filter: string) => void;

    // setData must be here because the sidebar manages its own sorting.
    readonly setDocMeta: (docMeta: IDocMeta) => void;

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
        readonly data: ReadonlyArray<IDocAnnotation>;
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

                const data = mutation.data;
                const view = Mappers.create(data)
                                    // apply sort order
                                    .map(DocAnnotationSorter.sort)
                                    // apply current filters
                                    .map(data => AnnotationRepoFilters2.execute(data, {text: store.filter}))
                                    .collect();

                console.log("FIXME3: set-data");

                return {...store, data, view};

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

    const persistenceLayerContext = usePersistenceLayerContext();

    function setFilter(text: string) {
        mutator.doUpdate({mutation: 'set-filter', filter: text});
    }

    function toAnnotations(docMeta: IDocMeta) {
        const {persistenceLayerProvider} = persistenceLayerContext;
        const docFileResolver = DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider);
        return DocAnnotationLoader2.load(docMeta, docFileResolver);
    }

    function setDocMeta(docMeta: IDocMeta) {
        const data = toAnnotations(docMeta);
        mutator.doUpdate({mutation: 'set-data', data});
    }

    return {
        setFilter,
        setDocMeta
    };

}

export const [AnnotationSidebarStoreProvider, useAnnotationSidebarStore, useAnnotationSidebarCallbacks, useAnnotationSidebarMutator]
    = createObservableStore<IAnnotationSidebarStore, Mutator, IAnnotationSidebarCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });

