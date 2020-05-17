import React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {
    createObservableStore,
    SetStore
} from "../../../web/spectron0/material-ui/store/ObservableStore";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IDStr, URLStr} from "polar-shared/src/util/Strings";
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
import {PDFPageNavigator} from "./PDFDocument";
import {PDFScaleLevelTuple} from "./PDFScaleLevels";

const log = Logger.create();
/**
 * Lightweight metadata describing the currently loaded document.
 */
export interface IDocDescriptor {
    readonly scale: PDFScaleLevelTuple;

    /**
     * The applied scale value derived from a string like 'page-width' but
     * actually computed as something like 1.2
     */
    readonly scaleValue: number;
    readonly nrPages: number;
    readonly fingerprint: IDStr;
}

export type Resizer = () => void;

export interface IDocViewerStore {

    /**
     * The DocMeta currently being managed.
     */
    readonly docMeta?: IDocMeta;

    /**
     * True when the document we're viewing assert that it has loaded.
     */
    readonly docLoaded: boolean;

    readonly docDescriptor?: IDocDescriptor;

    /**
     * The storage URL for the document this docMeta references.
     */
    readonly docURL?: URLStr;

    readonly pageNavigator?: PDFPageNavigator;

    /**
     * Resizer that forces the current doc to fit inside its container properly
     */
    readonly resizer?: Resizer;

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
    readonly setDocDescriptor: (docDescriptor: IDocDescriptor) => void;
    readonly setDocLoaded: (docLoaded: false) => void;
    readonly setResizer: (resizer: Resizer) => void;
    readonly annotationMutations: IAnnotationMutationCallbacks;
    readonly onPageJump: (page: number) => void;

    onPagemark(opts: IPagemarkMutation): void;
    setPageNavigator(pageNavigator: PDFPageNavigator): void;

    onPagePrev(): void;
    onPageNext(): void;

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

    function setDocDescriptor(docDescriptor: IDocDescriptor) {
        const store = storeProvider();
        setStore({...store, docDescriptor});
    }

    function setDocLoaded(docLoaded: boolean) {
        const store = storeProvider();
        setStore({...store, docLoaded});
    }

    function setResizer(resizer: Resizer) {
        const store = storeProvider();
        setStore({...store, resizer});
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
            Pagemarks.updatePagemark(docMeta, mutation.page, mutation.pagemark);

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

    function setPageNavigator(pageNavigator: PDFPageNavigator) {
        const store = storeProvider();
        setStore({...store, pageNavigator})
    }

    function onPageJump(page: number) {

        const {pageNavigator} = storeProvider();

        if (pageNavigator) {
            pageNavigator.set(page);
        } else {
            log.warn("No page navigator");
        }

    }

    function doPageNav(delta: number) {

        const {pageNavigator, docDescriptor} = storeProvider();

        if (! pageNavigator|| ! docDescriptor) {
            return;
        }

        const page = pageNavigator.get() + delta;

        if (page <= 0) {
            // invalid page as we requested to jump too low
            return;
        }

        if (page > docDescriptor.nrPages) {
            // went past the end.
            return;
        }

        pageNavigator.set(page);

    }

    function onPageNext() {
        doPageNav(1);
    }

    function onPagePrev() {
        doPageNav(-1);
    }

    return {
        setDocMeta,
        setDocDescriptor,
        setDocLoaded,
        setPageNavigator,
        annotationMutations,
        onPagemark,
        onPageJump,
        onPagePrev,
        onPageNext,
        setResizer,
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



