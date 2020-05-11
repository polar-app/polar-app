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
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {DocAnnotationLoader2} from "../../../web/js/annotation_sidebar/DocAnnotationLoaders";
import {DocFileResolvers} from "../../../web/js/datastore/DocFileResolvers";
import {usePersistence} from "../../repository/js/persistence_layer/PersistenceLayerApp";
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
    readonly data: ReadonlyArray<DocAnnotation>;

    /**
     * The annotations to display in the UI which is (optionally) filtered.
     */
    readonly view: ReadonlyArray<DocAnnotation>;

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
        readonly mutation: 'set-doc-meta',
        readonly docMeta: IDocMeta;
    }

    export type IMutation = ISetFilter | ISetData;

}

type IMutation = mutations.ISetFilter | mutations.ISetData;

interface Mutator {
    readonly doUpdate: (mutation: IMutation) => void;
}

function mutatorFactory(storeProvider: Provider<IAnnotationSidebarStore>,
                        setStore: SetStore<IAnnotationSidebarStore>): Mutator {

    const persistence = usePersistence();

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

            case "set-doc-meta":

                const {persistenceLayerProvider} = persistence;
                const docFileResolver = DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider);

                const data = DocAnnotationLoader2.load(mutation.docMeta, docFileResolver);
                const view = Mappers.create(data)
                                    // apply sort order
                                    .map(DocAnnotationSorter.sort)
                                    // apply current filters
                                    .map(data => AnnotationRepoFilters2.execute(data, {text: store.filter}))
                                    .collect();

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

    function setFilter(text: string) {
        mutator.doUpdate({mutation: 'set-filter', filter: text});
    }

    function setDocMeta(docMeta: IDocMeta) {
        mutator.doUpdate({mutation: 'set-doc-meta', docMeta});
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

