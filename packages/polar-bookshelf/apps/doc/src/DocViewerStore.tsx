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
import {IPagemark} from "polar-shared/src/metadata/IPagemark";
import {ScaleLevelTuple} from "./ScaleLevels";
import {PageNavigator} from "./PageNavigator";
import {useLogger} from "../../../web/js/mui/MUILogger";
import {DocViewerSnapshots} from "./DocViewerSnapshots";
import { DocMetas } from '../../../web/js/metadata/DocMetas';

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

    readonly pendingWrites: number

    readonly hasPendingWrites?: boolean;

}

export interface IPagemarkCreateToPoint {

    readonly type: 'create-to-point';

    // where to create the pagemark
    readonly x: number;
    readonly y: number;

    // the width and height of the current page.
    readonly width: number;
    readonly height: number;

    // the page number of the current page.
    readonly pageNum: number;
}

export interface IPagemarkCreateFromPage {

    readonly type: 'create-from-page';

    // where to create the pagemark
    readonly x: number;
    readonly y: number;

    // the width and height of the current page.
    readonly width: number;
    readonly height: number;

    // the page number of the current page.
    readonly pageNum: number;

    readonly fromPage: number;

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

export type IPagemarkMutation = IPagemarkCreateToPoint | IPagemarkCreateFromPage | IPagemarkUpdate | IPagemarkDelete;

/**
 * The type of update for setDocMeta.
 *
 * update: regular / direct store update
 * snapshot: update from a firestore snapshot
 *
 */
export type SetDocMetaType = 'update' | 'snapshot';

export interface IDocViewerCallbacks {

    /**
     * Update the DocMeta in the store after a local mutation including
     * increment the UUID.
     */
    readonly updateDocMeta: (docMeta: IDocMeta) => IDocMeta;
    readonly setDocMeta: (docMeta: IDocMeta, hasPendingWrites: boolean, type: SetDocMetaType) => void;
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
    pendingWrites: 0
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

    const log = useLogger();
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

        function mutatePendingWrites(delta: number) {
            const store = storeProvider();

            const pendingWrites = store.pendingWrites + delta;
            const hasPendingWrites = pendingWrites > 0;

            setStore({...store, pendingWrites, hasPendingWrites});
        }

        try {
            mutatePendingWrites(1);
            await annotationMutations.writeUpdatedDocMetas(updatedDocMetas);
        } finally {
            mutatePendingWrites(-1);
        }

    }

    function updateDocMeta(docMeta: IDocMeta): IDocMeta {
        const updated = DocMetas.updated(docMeta);
        setDocMeta(updated, true, 'update');
        return updated;
    }

    function setDocMeta(docMeta: IDocMeta, hasPendingWrites: boolean, type: 'update' | 'snapshot') {

        Preconditions.assertPresent(docMeta, 'docMeta');

        function doExec() {
            const store = storeProvider();

            const computeDocURL = (): URLStr | undefined => {

                // this is only computed once, when we don't have a store...

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

            setStore({...store, docMeta, docURL, hasPendingWrites});

        }

        const store = storeProvider();

        type UpdateType = 'fresh' | 'stale';

        function computeUpdateType(): UpdateType {
            return DocViewerSnapshots.isStaleUpdate(store.docMeta?.docInfo?.uuid, docMeta.docInfo.uuid) ? 'stale' : 'fresh';
        }

        const updateType = computeUpdateType();

        console.log(`Update for docMeta was ${updateType} for type=${type} - ${store.docMeta?.docInfo?.uuid} vs ${docMeta.docInfo.uuid}`);

        if (updateType === 'stale') {
            return;
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

    function updateStore(docMetas: ReadonlyArray<IDocMeta>): ReadonlyArray<IDocMeta> {
        // this is almost always just ONE item at a time so any type of
        // bulk performance updates are pointless
        return docMetas.map(docMeta => updateDocMeta(docMeta));
    }

    function onPagemark(mutation: IPagemarkMutation) {

        function createPagemarkToPoint(opts: IPagemarkCreateToPoint, start?: number) {

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
                Pagemarks.updatePagemarksForRange(docMeta!, endPageNum, percentage, {start});
            }

            deletePagemark(pageNum);
            createPagemarksForRange(pageNum, percentage);

            writeUpdatedDocMetas([docMeta])
               .catch(err => log.error(err));

        }

        function createPagemarkFromPage(opts: IPagemarkCreateFromPage) {
            createPagemarkToPoint({...opts, type: 'create-to-point'}, opts.fromPage);
        }

        function updatePagemark(mutation: IPagemarkUpdate) {
            const store = storeProvider();
            const docMeta = store.docMeta!;
            Pagemarks.updatePagemark(docMeta, mutation.pageNum, mutation.pagemark);

            updateDocMeta(docMeta);
            writeUpdatedDocMetas([docMeta])
                .catch(err => log.error(err));
        }

        function deletePagemark(mutation: IPagemarkDelete) {

            const store = storeProvider();
            const docMeta = store.docMeta!;
            const {pageNum, pagemark} = mutation;

            Pagemarks.deletePagemark(docMeta, pageNum, pagemark.id);
            updateDocMeta(docMeta);
            writeUpdatedDocMetas([docMeta])
                .catch(err => log.error(err));
        }

        switch (mutation.type) {

            case "create-to-point":
                createPagemarkToPoint(mutation);
                break;

            case "create-from-page":
                createPagemarkFromPage(mutation);
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

        async function doAsync() {
            await doPageJump(page);
        }

        doAsync()
          .catch(err => log.error('Could not handle page jump: ', err));

    }

    async function doPageJump(newPage: number) {

        const store = storeProvider();
        const {pageNavigator, page} = store;

        if (! pageNavigator) {
            return;
        }

        if (newPage <= 0) {
            // invalid page as we requested to jump too low
            return;
        }

        if (newPage > pageNavigator.count) {
            // went past the end.
            return;
        }

        if (newPage === pageNavigator.get()) {
            // noop as this is currently done.
            return;
        }

        await pageNavigator.set(newPage);
        setStore({
            ...store,
            page: newPage
        });

    }

    function doPageNav(delta: number) {

        async function doAsync() {
            const store = storeProvider();
            const {page} = store;
            const newPage = page + delta;
            await doPageJump(newPage);
        }

        doAsync().catch(err => log.error("Could not handle page nav: ", err));

    }

    function onPageNext() {
        doPageNav(1);
    }

    function onPagePrev() {
        doPageNav(-1);
    }

    return {
        updateDocMeta,
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



