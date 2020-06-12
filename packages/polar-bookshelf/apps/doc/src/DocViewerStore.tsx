import React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {
    createObservableStore,
    SetStore
} from "../../../web/js/react/store/ObservableStore";
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
import {ScaleLevelTuple} from "./ScaleLevels";
import {PageNavigator} from "./PageNavigator";

const log = Logger.create();
/**
 * Lightweight metadata describing the currently loaded document.
 */
export interface IDocDescriptor {

    readonly nrPages: number;

    readonly fingerprint: IDStr;

}

export interface IDocScale {

    readonly scale: ScaleLevelTuple;

    /**
     * The applied scale value derived from a string like 'page-width' but
     * actually computed as something like 1.2
     */
    readonly scaleValue: number;

}

export type ScaleValue = number;

export type Resizer = () => void;

/**
 * Scale us and then return the new scale as a numbers
 */
export type ScaleLeveler = (scale: ScaleLevelTuple) => ScaleValue;

export interface IDocViewerStore {

    /**
     * The DocMeta currently being managed.
     */
    readonly docMeta?: IDocMeta;

    /**
     * The current page number we're on.
     */
    readonly page: number;

    /**
     * True when the document we're viewing assert that it has loaded.
     */
    readonly docLoaded: boolean;

    readonly docDescriptor?: IDocDescriptor;

    /**
     * The storage URL for the document this docMeta references.
     */
    readonly docURL?: URLStr;

    readonly pageNavigator?: PageNavigator;

    /**
     * Resizer that forces the current doc to fit inside its container properly
     */
    readonly resizer?: Resizer;

    readonly docScale?: IDocScale;

    readonly scaleLeveler?: ScaleLeveler;

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
    readonly pageNum: number;
    readonly pagemark: IPagemark;
}

export interface IPagemarkDelete {
    readonly type: 'delete',
    readonly pageNum: number;
    readonly pagemark: IPagemark;
}

export type IPagemarkMutation = IPagemarkCreate | IPagemarkUpdate | IPagemarkDelete;

export interface IDocViewerCallbacks {

    readonly setDocMeta: (docMeta: IDocMeta) => void;
    readonly setDocDescriptor: (docDescriptor: IDocDescriptor) => void;
    readonly setDocScale: (docScale: IDocScale) => void;
    readonly setDocLoaded: (docLoaded: false) => void;
    readonly setResizer: (resizer: Resizer) => void;
    readonly setScaleLeveler: (scaleLeveler: ScaleLeveler) => void;
    readonly annotationMutations: IAnnotationMutationCallbacks;
    readonly onPageJump: (page: number) => void;
    readonly setScale: (scaleLevel: ScaleLevelTuple) => void;
    // readonly getAnnotationsFromDocMeta: (refs: ReadonlyArray<IAnnotationRef>) => void;

    onPagemark(opts: IPagemarkMutation): void;
    setPageNavigator(pageNavigator: PageNavigator): void;

    onPagePrev(): void;
    onPageNext(): void;

    // FIXME: where do we put the callback for injecting content from the
    // annotation control into the main doc.

}

const initialStore: IDocViewerStore = {
    page: 1,
    docLoaded: false,
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

    function setDocScale(docScale: IDocScale) {
        const store = storeProvider();
        setStore({...store, docScale});
    }

    function setDocLoaded(docLoaded: boolean) {
        const store = storeProvider();
        setStore({...store, docLoaded});
    }

    function setResizer(resizer: Resizer) {
        const store = storeProvider();
        setStore({...store, resizer});
    }

    function setScaleLeveler(scaleLeveler: ScaleLeveler) {
        const store = storeProvider();
        setStore({...store, scaleLeveler});
    }

    function setScale(scaleLevel: ScaleLevelTuple) {
        const store = storeProvider();

        const {scaleLeveler} = store;

        if (scaleLeveler) {

            const scaleValue = scaleLeveler(scaleLevel);

            const docScale: IDocScale = {
                scale: scaleLevel,
                scaleValue,
            }

            setDocScale(docScale);

        }

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

            function deletePagemark(pageNum: number) {

                Preconditions.assertNumber(pageNum, "pageNum");

                Pagemarks.deletePagemark(docMeta!, pageNum);

            }

            function createPagemarksForRange(endPageNum: number, percentage: number) {
                Pagemarks.updatePagemarksForRange(docMeta!, endPageNum, percentage);
            }

            deletePagemark(pageNum);
            createPagemarksForRange(pageNum, percentage);

            // FIXME: this isn't writing it to storage
            writeUpdatedDocMetas([docMeta])
               .catch(err => log.error(err));
        }

        function updatePagemark(mutation: IPagemarkUpdate) {
            const store = storeProvider();
            const docMeta = store.docMeta!;
            Pagemarks.updatePagemark(docMeta, mutation.pageNum, mutation.pagemark);

            setDocMeta(docMeta);
            writeUpdatedDocMetas([docMeta])
                .catch(err => log.error(err));
        }

        function deletePagemark(mutation: IPagemarkDelete) {

            const store = storeProvider();
            const docMeta = store.docMeta!;
            const {pageNum, pagemark} = mutation;

            Pagemarks.deletePagemark(docMeta, pageNum, pagemark.id);
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
            case "delete":
                deletePagemark(mutation);
                break;

        }

    }

    function setPageNavigator(pageNavigator: PageNavigator) {
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

        const store = storeProvider();
        const {pageNavigator, page} = store;

        if (! pageNavigator) {
            return;
        }

        const newPage = page + delta;

        if (newPage <= 0) {
            // invalid page as we requested to jump too low
            return;
        }

        if (newPage > pageNavigator.count) {
            // went past the end.
            return;
        }

        pageNavigator.set(newPage);
        setStore({
            ...store,
            page: newPage
        });

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
        setDocScale,
        setDocLoaded,
        setPageNavigator,
        annotationMutations,
        onPagemark,
        onPageJump,
        onPagePrev,
        onPageNext,
        setResizer,
        setScaleLeveler,
        setScale
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



