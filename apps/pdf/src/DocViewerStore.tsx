import React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {
    createObservableStore,
    SetStore
} from "../../../web/spectron0/material-ui/store/ObservableStore";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {URLStr} from "polar-shared/src/util/Strings";
import {DocMetaFileRefs} from "../../../web/js/datastore/DocMetaRef";
import {Backend} from 'polar-shared/src/datastore/Backend';
import {usePersistenceLayerContext} from "../../repository/js/persistence_layer/PersistenceLayerApp";
import {useAnnotationSidebarCallbacks} from './AnnotationSidebarStore';
import {useDocMetaContext} from "../../../web/js/annotation_sidebar/DocMetaContextProvider";
import {
    AnnotationMutationCallbacks,
    AnnotationMutationsContextProvider,
    IAnnotationMutationCallbacks
} from "../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Percentages} from "polar-shared/src/util/Percentages";
import {Pagemarks} from "../../../web/js/metadata/Pagemarks";
import {Preconditions} from "polar-shared/src/Preconditions";
import {Logger} from "polar-shared/src/logger/Logger";
import {IPagemark} from "polar-shared/src/metadata/IPagemark";

const log = Logger.create();

export interface IDocViewerStore {

    /**
     * The DocMeta currently being managed.
     */
    readonly docMeta?: IDocMeta;

    /**
     * True when the document we're viewing assert that it has loaded.
     */
    readonly docLoaded: boolean;

    /**
     * The storage URL for the document this docMeta references.
     */
    readonly docURL?: URLStr;

}

export interface IPagemarkCreate {

    readonly type: 'create';

    // where to create the pagemark
    readonly x: number;
    readonly y: number;

    // the width and height of the current page.
    readonly width: number;
    readonly height: number;

    // the page number of the current page.
    readonly pageNum: number;
}

export interface IPagemarkUpdate {
    readonly type: 'update',
    readonly page: number;
    readonly pagemark: IPagemark;
}

export type IPagemarkMutation = IPagemarkCreate | IPagemarkUpdate;

export interface IDocViewerCallbacks {

    readonly setDocMeta: (docMeta: IDocMeta) => void;
    readonly setDocLoaded: (docLoaded: false) => void;
    readonly annotationMutations: IAnnotationMutationCallbacks;

    onPagemark(opts: IPagemarkMutation): void;

    // FIXME: where do we put the callback for injecting content from the
    // annotation control into the main doc.

}

const initialStore: IDocViewerStore = {
    docLoaded: false
}

interface Mutator {

}

function mutatorFactory(storeProvider: Provider<IDocViewerStore>,
                        setStore: SetStore<IDocViewerStore>): Mutator {

    function reduce(): IDocViewerStore | undefined {
        return undefined;
    }

    return {};

}

type IDocMetaProvider = () => IDocMeta | undefined;

function callbacksFactory(storeProvider: Provider<IDocViewerStore>,
                          setStore: (store: IDocViewerStore) => void,
                          mutator: Mutator): IDocViewerCallbacks {

    const docMetaContext = useDocMetaContext();
    const persistenceLayerContext = usePersistenceLayerContext();
    const annotationSidebarCallbacks = useAnnotationSidebarCallbacks();

    const docMetaProvider = React.useMemo<IDocMetaProvider>(() => {

        return () => {
            const store = storeProvider();
            return store.docMeta;
        }

    }, []);

    async function writeUpdatedDocMetas(updatedDocMetas: ReadonlyArray<IDocMeta>) {
        return annotationMutations.writeUpdatedDocMetas(updatedDocMetas);
    }

    function setDocMeta(docMeta: IDocMeta) {

        function doExec() {
            const store = storeProvider();

            const computeDocURL = (): URLStr | undefined => {

                if (docMeta) {

                    const docMetaFileRef = DocMetaFileRefs.createFromDocMeta(docMeta);
                    const persistenceLayer = persistenceLayerContext.persistenceLayerProvider();

                    if (docMetaFileRef.docFile) {
                        const file = persistenceLayer.getFile(Backend.STASH, docMetaFileRef.docFile);
                        return file.url;
                    }

                }

                return undefined;

            };

            const docURL = store.docURL || computeDocURL();

            setStore({...store, docMeta, docURL});

        }

        // update the main store.
        doExec();

        docMetaContext.setDoc({docMeta, mutable: true});

        // update the annotation sidebar
        annotationSidebarCallbacks.setDocMeta(docMeta);

    }

    function setDocLoaded(docLoaded: boolean) {
        const store = storeProvider();
        setStore({...store, docLoaded});
    }

    const annotationMutations = AnnotationMutationCallbacks.create(updateStore, NULL_FUNCTION);

    function updateStore(docMetas: ReadonlyArray<IDocMeta>) {
        // this is almost always just ONE item at a time so any type of
        // bulk performance updates are pointless
        docMetas.map(setDocMeta);
    }

    function onPagemark(mutation: IPagemarkMutation) {

        function createPagemarkToPoint(opts: IPagemarkCreate) {

            const store = storeProvider();
            const {docMeta} = store;

            if (!docMeta) {
                return;
            }

            const {pageNum} = opts;

            const verticalOffsetWithinPageElement = opts.y;

            const pageHeight = opts.height;

            const percentage = Percentages.calculate(verticalOffsetWithinPageElement,
                                                     pageHeight,
                                                     {noRound: true});

            console.log("percentage for pagemark: ", percentage);

            function erasePagemark(pageNum: number) {

                Preconditions.assertNumber(pageNum, "pageNum");

                Pagemarks.deletePagemark(docMeta!, pageNum);

            }

            function createPagemarksForRange(endPageNum: number, percentage: number) {
                Pagemarks.updatePagemarksForRange(docMeta!, endPageNum, percentage);
            }

            erasePagemark(pageNum);
            createPagemarksForRange(pageNum, percentage);

            // FIXME: this isn't writing it to storage
            writeUpdatedDocMetas([docMeta])
               .catch(err => log.error(err));
        }

        function updatePagemark(mutation: IPagemarkUpdate) {
            const store = storeProvider();
            const docMeta = store.docMeta!;
            console.log("FIXME: newPagemark: ", mutation.pagemark)
            Pagemarks.updatePagemark(docMeta, mutation.page, mutation.pagemark);
            console.log("FIXME: docmeta after: ", docMeta);

            setDocMeta(docMeta);
            writeUpdatedDocMetas([docMeta])
                .catch(err => log.error(err));
        }

        switch (mutation.type) {

            case "create":
                createPagemarkToPoint(mutation);
                break;
            case "update":
                updatePagemark(mutation);
                break;

        }

    }

    return {
        setDocMeta,
        setDocLoaded,
        annotationMutations,
        onPagemark
    };

}

export const [DocViewerStoreProviderDelegate, useDocViewerStore, useDocViewerCallbacks, useDocViewerMutator]
    = createObservableStore<IDocViewerStore, Mutator, IDocViewerCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });

interface IProps {
    readonly children: React.ReactElement;
}

const DocViewerStoreInner = React.memo((props: IProps) => {

    const docViewerCallbacks = useDocViewerCallbacks();

    return (
        <AnnotationMutationsContextProvider value={docViewerCallbacks.annotationMutations}>
            {props.children}
        </AnnotationMutationsContextProvider>
    );
});


export const DocViewerStore = React.memo((props: IProps) => {
    return (
        <DocViewerStoreProviderDelegate>
            <DocViewerStoreInner>
                {props.children}
            </DocViewerStoreInner>
        </DocViewerStoreProviderDelegate>
    );
});



