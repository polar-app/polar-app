import * as React from 'react';
import {
    Destination,
    EventBus,
    IEventBus,
    IPDFFindController,
    IPDFLinkService,
    IPDFRenderingQueue,
    IPDFViewer,
    IPDFViewerOptions,
    PDFFindController,
    PDFLinkService,
    PDFRenderingQueue,
    PDFViewer
} from 'polar-pdf/src/pdf/PDFJSViewer';
import {IPDFDocumentLoadingTask, IPDFDocumentProxy, LinkTarget, Outline} from 'polar-pdf/src/pdf/PDFJS'
import {URLStr} from "polar-shared/src/util/Strings";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {Callback1} from "polar-shared/src/util/Functions";
import {Finder} from "../../Finders";
import {PDFFindControllers} from "./PDFFindControllers";
import {ProgressMessages} from "../../../../../web/js/ui/progress_bar/ProgressMessages";
import {ProgressTracker} from "polar-shared/src/util/ProgressTracker";
import {ScaleLevelTuple, ScaleLevelTuples, ScaleLevelTuplesMap} from "../../ScaleLevels";
import {IDocDescriptor, IDocScale, useDocViewerCallbacks,} from "../../DocViewerStore";
import {useDocFindCallbacks} from "../../DocFindStore";
import {PageNavigator} from "../../PageNavigator";
import {PDFDocs} from "polar-pdf/src/pdf/PDFDocs";
import 'pdfjs-dist/web/pdf_viewer.css';
import './PDFDocument.css';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {Pagemarks} from "polar-shared/src/metadata/Pagemarks";
import {Scrollers} from "polar-pagemarks-auto/src/Scrollers";
import {usePersistenceLayerContext,} from "../../../../repository/js/persistence_layer/PersistenceLayerApp";
import {ExtendPagemark} from "polar-pagemarks-auto/src/AutoPagemarker";
import {useLogger} from "../../../../../web/js/mui/MUILogger";
import {KnownPrefs} from "../../../../../web/js/util/prefs/KnownPrefs";
import {DocumentInit} from "../DocumentInitHook";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {IOutlineItem} from "../../outline/IOutlineItem";
import {IOutline} from "../../outline/IOutline";
import {Numbers} from "polar-shared/src/util/Numbers";
import {Nonces} from "polar-shared/src/util/Nonces";
import {useStateRef} from "../../../../../web/js/hooks/ReactHooks";
import {usePrefsContext} from "../../../../repository/js/persistence_layer/PrefsContext2";
import {usePDFUpgrader} from './PDFUpgrader';
import {ViewerElements} from "../ViewerElements";
import {useDocumentViewerVisibleElemFocus} from '../UseSidenavDocumentChangeCallbackHook';
import {AnnotationPopup} from '../../annotations/annotation_popup/AnnotationPopup';
import {AreaHighlightCreator} from '../../annotations/AreaHighlightDrawer';
import {useTaskEventReporterHandler} from "../../../../../web/js/analytics/Analytics";

interface DocViewer {
    readonly eventBus: IEventBus;
    readonly findController: IPDFFindController;
    readonly viewer: IPDFViewer;
    readonly linkService: IPDFLinkService;
    readonly renderingQueue: IPDFRenderingQueue;
    readonly containerElement: HTMLElement;
}

function createDocViewer(docID: string): DocViewer {

    const eventBus = new EventBus({dispatchToDOM: false});
    // TODO  this isn't actually exported..
    const renderingQueue = new PDFRenderingQueue();

    const linkService = new PDFLinkService({
        eventBus,
        externalLinkTarget: LinkTarget.BLANK
    });

    const findController = new PDFFindController({
        linkService,
        eventBus
    });

    const {containerElement, viewerElement} = ViewerElements.find(docID);

    const viewerOpts: IPDFViewerOptions = {
        container: containerElement,
        viewer: viewerElement,
        textLayerMode: 2,
        linkService,
        findController,
        eventBus,
        // useOnlyCssZoom: false,
        // enableWebGL: false,
        // renderInteractiveForms: false,
        // pdfBugEnabled: false,
        // disableRange: false,
        // disableStream: false,
        // disableAutoFetch: false,
        // disableFontFace: false,
        // // renderer: "svg",
        // // renderingQueue, // this isn't actually needed when its in a scroll container
        // maxCanvasPixels: 16777216,
        // enablePrintAutoRotate: false,
        // renderer: RendererType.SVG,
        // renderer: RenderType
        // removePageBorders: true,
        // defaultViewport: viewport
    };

    const viewer = new PDFViewer(viewerOpts);

    linkService.setViewer(viewer);
    renderingQueue.setViewer(viewer);

    (renderingQueue as any).onIdle = () => {
        viewer.cleanup();
    };

    return {eventBus, findController, viewer, linkService, renderingQueue, containerElement};

}

export type OnFinderCallback = Callback1<Finder>;

interface IProps {
    readonly docURL: URLStr;
    readonly docMeta: IDocMeta;
    readonly children: React.ReactNode;
}

export const PDFDocument = deepMemo(function PDFDocument(props: IProps) {

    const {docURL} = props;
    const [active, setActive, activeRef] = useStateRef(false);

    const docViewerRef = React.useRef<DocViewer | undefined>(undefined);
    const scaleRef = React.useRef<ScaleLevelTuple>(ScaleLevelTuples[1]);
    const docRef = React.useRef<IPDFDocumentProxy | undefined>(undefined);
    const pageNavigatorRef = React.useRef<PageNavigator | undefined>(undefined);
    const pdfUpgrader = usePDFUpgrader();

    const docLoadEventReporterHandler = useTaskEventReporterHandler('docLoad', {type: 'pdf'});

    const log = useLogger();

    const {setDocDescriptor, setPageNavigator, setResizer, setScaleLeveler,
           setDocScale, setPage, setOutline, setOutlineNavigator, docMetaProvider, setScale: setStoreScale}
        = useDocViewerCallbacks();

    const {setFinder} = useDocFindCallbacks();
    const {persistenceLayerProvider} = usePersistenceLayerContext();
    const prefs = usePrefsContext();
    const hasPagesInitRef = React.useRef(false);
    const hasLoadRef = React.useRef(false);

    const hasLoadStartedRef = React.useRef(false);

    const handleActive = React.useCallback(() => {

        if (hasPagesInitRef.current && hasLoadRef.current) {
            if (! activeRef.current) {
                setActive(true);
            }
        }

    }, [activeRef, setActive]);

    const onPagesInit = React.useCallback(() => {
        hasPagesInitRef.current = true;
        handleActive();
    }, [handleActive]);

    const onLoaded = React.useCallback(() => {
        hasLoadRef.current = true;
        handleActive();

    }, [handleActive]);

    const dispatchPDFDocMeta = React.useCallback(() => {

        if (docRef.current && docViewerRef.current) {

            const docDescriptor: IDocDescriptor = {
                // title: docRef.current.title,
                // scale: scaleRef.current,
                // scaleValue: docViewerRef.current.viewer.currentScale,
                nrPages: docRef.current.numPages,
                fingerprint: props.docMeta.docInfo.fingerprint
            };

            setDocDescriptor(docDescriptor);

            if (pageNavigatorRef.current) {
                setPage(pageNavigatorRef.current.get());
            } else {
                log.warn("No pageNavigatorRef")
            }

        }

    }, [log, props.docMeta.docInfo.fingerprint, setDocDescriptor, setPage]);

    const setScale = React.useCallback((scale: ScaleLevelTuple) => {

        if (docViewerRef.current) {
            scaleRef.current = scale;
            docViewerRef.current.viewer.currentScaleValue = scale.value;

            dispatchPDFDocMeta();

            return docViewerRef.current.viewer.currentScale;

        }

        throw new Error("No viewer");

    }, [dispatchPDFDocMeta]);

    const scaleLeveler = React.useCallback((scale: ScaleLevelTuple) => {
        return setScale(scale);
    }, [setScale]);

    const resize = React.useCallback((): number => {

        if (['page-width', 'page-fit'].includes(scaleRef.current.value)) {
            setScale(scaleRef.current);
            setStoreScale(scaleRef.current);
        }

        if (docViewerRef.current) {
            return docViewerRef.current.viewer.currentScale;
        } else {
            throw new Error("No viewer");
        }

    }, [setScale, setStoreScale]);

    const loadingTaskRef = React.useRef<IPDFDocumentLoadingTask | undefined>();

    const createProgressTracker = React.useCallback((total: number) => {

        return new ProgressTracker({
            id: 'pdf-download-' + props.docMeta.docInfo.fingerprint,
            total: total
        })

    }, [props.docMeta.docInfo.fingerprint]);

    const progressTrackerRef = React.useRef<ProgressTracker | undefined>(undefined);

    const doLoad = React.useCallback(async (docViewer: DocViewer) => {

        if (! docViewer.containerElement) {
            // fixes a bug where this is registered as an eventListener and gets
            // closed after the document is loaded.
            console.warn("No container element");
            return;
        }

        loadingTaskRef.current = PDFDocs.getDocument({url: docURL, docBaseURL: docURL});

        loadingTaskRef.current.onProgress = (progress) => {

            if (! progressTrackerRef.current) {
                progressTrackerRef.current = createProgressTracker(progress.total);
            }

            if (progress.loaded > progress.total) {
                return;
            }

            ProgressMessages.broadcast(progressTrackerRef.current!.abs(progress.loaded));

        };

        docRef.current = await loadingTaskRef.current.promise;

        const page = await docRef.current.getPage(1);

        docViewer.viewer.setDocument(docRef.current);
        docViewer.linkService.setDocument(docRef.current, null);

        const finder = PDFFindControllers.createFinder(docViewer.eventBus,
            docViewer.findController);
        setFinder(finder);

        docViewer.eventBus.on('pagesinit', () => {
            onPagesInit();
        });

        const resizeDebouncer = Debouncers.create(() => resize());

        window.addEventListener('resize', resizeDebouncer, {passive: true});

        const viewerContainer = document.getElementById("viewerContainer");

        if (viewerContainer) {
            viewerContainer.addEventListener("resize", resizeDebouncer);
        } else {
            log.warn("No viewer container");
            return;
        }

        setResizer(resizeDebouncer);

        // do first resize async
        setTimeout(() => resize(), 1 );

        async function createOutline(): Promise<IOutline | undefined> {

            function toOutline(outline: Outline): IOutlineItem {

                const id = Numbers.toString(nonceFactory());

                return {
                    id,
                    title: outline.title,
                    destination: outline.dest,
                    children: outline.items.map(toOutline)
                };

            }

            const nonceFactory = Nonces.createFactory();

            const outline = await docRef.current!.getOutline();

            if (! outline) {
                return undefined;
            }

            const items = outline.map(toOutline);
            return {items};

        }

        const outline = await createOutline();
        setOutline(outline);

        setOutlineNavigator(async (destination: any) => docViewer.linkService.goToDestination(destination as Destination));

        function createPageNavigator(pdfDocumentProxy: IPDFDocumentProxy): PageNavigator {

            const count = pdfDocumentProxy.numPages;

            function get(): number {
                return docViewer.viewer.currentPageNumber;
            }

            async function jumpToPage(page: number) {
                docViewer.viewer.currentPageNumber = page;
            }

            return {count, jumpToPage, get};

        }

        pageNavigatorRef.current = createPageNavigator(docRef.current);

        dispatchPDFDocMeta();

        setPageNavigator(pageNavigatorRef.current);

        const handleScroll = Debouncers.create(() => {
            dispatchPDFDocMeta();
        });

        docViewer.containerElement.addEventListener('scroll', () => {
            handleScroll();
        }, {passive: true});

        class PDFDocScale implements IDocScale {

            get scale(): ScaleLevelTuple {
                const currentScaleValue = docViewerRef.current!.viewer.currentScaleValue;
                const result = ScaleLevelTuplesMap[currentScaleValue];

                if (! result) {
                    return ScaleLevelTuplesMap["page width"];
                }

                return result;

            }

            get scaleValue(): number {
                return docViewerRef.current!.viewer.currentScale;
            }

        }

        setDocScale(new PDFDocScale());
        setScaleLeveler(scaleLeveler);

        function enableAutoPagemarks() {

            if (prefs.get(KnownPrefs.AUTO_PAGEMARKS).getOrElse('false') !== 'true') {
                // only enable this via prefs now...
                return;
            }

            console.log("Auto pagemarks enabled");

            function onPagemarkExtend(extendPagemark: ExtendPagemark) {

                const docMeta = docMetaProvider();

                if (! docMeta) {
                    return;
                }

                const extender = Pagemarks.createExtender(docMeta);

                // perform the mutation of the docMeta now...
                extender(extendPagemark);

                // then persist it back out..
                const doAsync = async () => {
                    const persistenceLayer = persistenceLayerProvider();
                    await persistenceLayer.writeDocMeta(docMeta);
                }

                docLoadEventReporterHandler(doAsync)
                    .catch(err => log.error("Unable to write docMeta: ", err));

            }

            // start the auto-pagemark system.
            Scrollers.register(onPagemarkExtend, {mode: 'full'});

        }

        enableAutoPagemarks();

        async function doUpgrade() {
            const docMeta = docMetaProvider();

            if (docMeta) {
                await pdfUpgrader(docMeta);
            }

        }

        await doUpgrade();

        onLoaded()

    }, [createProgressTracker, dispatchPDFDocMeta, docMetaProvider, docURL, log, onLoaded, onPagesInit,
        pdfUpgrader, persistenceLayerProvider, prefs, resize, scaleLeveler, setDocScale, setFinder,
        setOutline, setOutlineNavigator, setPageNavigator, setResizer, setScaleLeveler,
        docLoadEventReporterHandler]);

    React.useEffect(() => {

        if (hasLoadStartedRef.current) {
            return;
        }

        hasLoadStartedRef.current = true;

        const docID = props.docMeta.docInfo.fingerprint;
        docViewerRef.current = createDocViewer(docID);

        doLoad(docViewerRef.current)
            .catch(err => log.error("PDFDocument: Could not load PDF: ", err));

    }, [doLoad, log, props.docMeta.docInfo.fingerprint]);

    React.useEffect(() => {

        return () => {

            async function doAsync() {

                if (loadingTaskRef.current) {

                    console.log("Terminating PDF loading task...")

                    try {
                        await loadingTaskRef.current.destroy()
                        console.log("Terminating PDF loading task...done")
                    } finally {

                        if (progressTrackerRef.current) {
                            console.log("Terminating PDF progress tracker.")
                            ProgressMessages.broadcast(progressTrackerRef.current.terminate());
                        } else {
                            console.warn("No PDF progress tracker to terminate");
                        }

                    }

                } else {
                    console.warn("No PDF loading task to terminate.");
                }

            }

            doAsync()
                .catch(err => console.error("Unable to destroy loading task: ", err));

        }
    }, []);

    useDocumentViewerVisibleElemFocus(
        props.docMeta.docInfo.fingerprint,
        docViewerRef.current?.containerElement,
    );

    return active && (
        <>
            <AreaHighlightCreator />
            <AnnotationPopup/>
            <DocumentInit/>
            {props.children}
        </>
    ) || null;

});

