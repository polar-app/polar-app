import * as React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {
    createObservableStore,
    SetStore
} from "../../../web/js/react/store/ObservableStore";
import {IDocAnnotationRef} from "../../../web/js/annotation_sidebar/DocAnnotation";
import {AnnotationRepoFilters2} from "../../repository/js/annotation_repo/AnnotationRepoFilters2";
import {DocAnnotationSorter} from "../../../web/js/annotation_sidebar/DocAnnotationSorter";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {DocAnnotationLoader2} from "../../../web/js/annotation_sidebar/DocAnnotationLoader2";
import {DocFileResolvers} from "../../../web/js/datastore/DocFileResolvers";
import {usePersistenceLayerContext} from "../../repository/js/persistence_layer/PersistenceLayerApp";
import {Mappers} from "polar-shared/src/util/Mapper";
import {DocAnnotations} from "../../../web/js/annotation_sidebar/DocAnnotations";
import {Preconditions} from "polar-shared/src/Preconditions";
import PageInfoIndex = DocAnnotationSorter.PageInfoIndex;

interface IAnnotationSidebarStore {

    /**
     * The text of the annotations on the right.
     */
    readonly filter: string;

    /**
     * The raw annotations data which is unfiltered, unsorted, and form which
     * the view is derived.
     */
    readonly data: ReadonlyArray<IDocAnnotationRef>;

    /**
     * The annotations to display in the UI which is (optionally) filtered.
     */
    readonly view: ReadonlyArray<IDocAnnotationRef>;

}

interface IAnnotationSidebarCallbacks {

    readonly setFilter: (filter: string) => void;

    // setData must be here because the sidebar manages its own sorting.
    readonly setDocMeta: (docMeta: IDocMeta) => void;

}

const initialStore: IAnnotationSidebarStore = {
    filter: "",
    data: [],
    view: [],
}

namespace mutations {

    export interface ISetFilter {
        readonly mutation: 'set-filter';
        readonly filter: string;
    }

    export interface ISetData {
        readonly mutation: 'set-data',
        readonly data: ReadonlyArray<IDocAnnotationRef>;
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

                const {docMeta} = mutation;

                const columnLayout = docMeta.docInfo.columnLayout || 0;

                function createPageMetaIndex() {
                    const result: PageInfoIndex = {};

                    for (const pageMeta of Object.values(docMeta.pageMetas || {})) {
                        result[pageMeta.pageInfo.num] = pageMeta.pageInfo;
                    }

                    return result;

                }

                const pageMetaIndex = createPageMetaIndex();

                const sorter = DocAnnotationSorter.create<IDocAnnotationRef>(pageMetaIndex, columnLayout);

                const data = mutation.data;
                const view = Mappers.create(data)
                                    // apply sort order
                                    .map(sorter)
                                    // apply current filters
                                    .map(data => AnnotationRepoFilters2.execute(data, {text: store.filter}))
                                    .collect();

                return {
                    ...store,
                    data,
                    view,
                };

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

function useCallbacksFactory(storeProvider: Provider<IAnnotationSidebarStore>,
                             setStore: (store: IAnnotationSidebarStore) => void,
                             mutator: Mutator): IAnnotationSidebarCallbacks {

    const persistenceLayerContext = usePersistenceLayerContext();

    return React.useMemo(() => {

        function setFilter(text: string) {
            mutator.doUpdate({mutation: 'set-filter', filter: text});
        }

        function toAnnotations(docMeta: IDocMeta): ReadonlyArray<IDocAnnotationRef> {
            const {persistenceLayerProvider} = persistenceLayerContext;
            const docFileResolver = DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider);
            return DocAnnotationLoader2.load(docMeta, docFileResolver).map(DocAnnotations.toRef);
        }

        function setDocMeta(docMeta: IDocMeta) {
            Preconditions.assertPresent(docMeta, 'docMeta');
            const data = toAnnotations(docMeta);
            mutator.doUpdate({mutation: 'set-data', data, docMeta});
        }

        return ({
            setFilter,
            setDocMeta
        });

    }, [persistenceLayerContext, mutator])

}

export const [AnnotationSidebarStoreProvider, useAnnotationSidebarStore, useAnnotationSidebarCallbacks, useAnnotationSidebarMutator]
    = createObservableStore<IAnnotationSidebarStore, Mutator, IAnnotationSidebarCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory,
        enableShallowEquals: true
    });

AnnotationSidebarStoreProvider.displayName='AnnotationSidebarStoreProvider';