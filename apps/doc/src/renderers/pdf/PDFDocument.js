"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFDocument = void 0;
const React = __importStar(require("react"));
const pdf_viewer_1 = require("pdfjs-dist/web/pdf_viewer");
const pdfjs_dist_1 = require("pdfjs-dist");
const Debouncers_1 = require("polar-shared/src/util/Debouncers");
const PDFFindControllers_1 = require("./PDFFindControllers");
const ProgressMessages_1 = require("../../../../../web/js/ui/progress_bar/ProgressMessages");
const ProgressTracker_1 = require("polar-shared/src/util/ProgressTracker");
const ScaleLevels_1 = require("../../ScaleLevels");
const ReactLifecycleHooks_1 = require("../../../../../web/js/hooks/ReactLifecycleHooks");
const DocViewerStore_1 = require("../../DocViewerStore");
const DocFindStore_1 = require("../../DocFindStore");
const PDFDocs_1 = require("polar-pdf/src/pdf/PDFDocs");
require("pdfjs-dist/web/pdf_viewer.css");
require("./PDFDocument.css");
const Pagemarks_1 = require("../../../../../web/js/metadata/Pagemarks");
const Scrollers_1 = require("polar-pagemarks-auto/src/Scrollers");
const PersistenceLayerApp_1 = require("../../../../repository/js/persistence_layer/PersistenceLayerApp");
const MUILogger_1 = require("../../../../../web/js/mui/MUILogger");
const KnownPrefs_1 = require("../../../../../web/js/util/prefs/KnownPrefs");
const AnnotationBarHooks_1 = require("../../AnnotationBarHooks");
const DocumentInitHook_1 = require("../DocumentInitHook");
const DocViewerAnnotationHook_1 = require("../../DocViewerAnnotationHook");
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
const Numbers_1 = require("polar-shared/src/util/Numbers");
const Nonces_1 = require("polar-shared/src/util/Nonces");
function createDocViewer() {
    const eventBus = new pdf_viewer_1.EventBus({ dispatchToDOM: false });
    const renderingQueue = new pdf_viewer_1.PDFRenderingQueue();
    const linkService = new pdf_viewer_1.PDFLinkService({
        eventBus,
        externalLinkTarget: pdfjs_dist_1.LinkTarget.BLANK
    });
    const findController = new pdf_viewer_1.PDFFindController({
        linkService,
        eventBus
    });
    const containerElement = document.getElementById('viewerContainer');
    if (containerElement === null) {
        throw new Error("No containerElement");
    }
    const viewerElement = document.getElementById('viewer');
    if (viewerElement === null) {
        throw new Error("No viewerElement");
    }
    const viewerOpts = {
        container: containerElement,
        viewer: viewerElement,
        textLayerMode: 2,
        linkService,
        findController,
        eventBus,
        useOnlyCssZoom: false,
        enableWebGL: false,
        renderInteractiveForms: false,
        pdfBugEnabled: false,
        disableRange: false,
        disableStream: false,
        disableAutoFetch: false,
        disableFontFace: false,
        maxCanvasPixels: 16777216,
        enablePrintAutoRotate: false,
    };
    const viewer = new pdf_viewer_1.PDFViewer(viewerOpts);
    linkService.setViewer(viewer);
    renderingQueue.setViewer(viewer);
    renderingQueue.onIdle = () => {
        viewer.cleanup();
    };
    return { eventBus, findController, viewer, linkService, renderingQueue, containerElement };
}
exports.PDFDocument = ReactUtils_1.deepMemo((props) => {
    const { docURL } = props;
    const [active, setActive] = React.useState(false);
    const docViewerRef = React.useRef(undefined);
    const scaleRef = React.useRef(ScaleLevels_1.ScaleLevelTuples[1]);
    const docRef = React.useRef(undefined);
    const pageNavigatorRef = React.useRef(undefined);
    const log = MUILogger_1.useLogger();
    const { setDocDescriptor, setPageNavigator, setResizer, setScaleLeveler, setDocScale, setPage, setOutline, setOutlineNavigator, docMetaProvider } = DocViewerStore_1.useDocViewerCallbacks();
    const { setFinder } = DocFindStore_1.useDocFindCallbacks();
    const { persistenceLayerProvider } = PersistenceLayerApp_1.usePersistenceLayerContext();
    const prefs = PersistenceLayerApp_1.usePrefsContext();
    const annotationBarInjector = AnnotationBarHooks_1.useAnnotationBar();
    DocViewerAnnotationHook_1.useDocViewerPageJumpListener();
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        docViewerRef.current = createDocViewer();
        doLoad(docViewerRef.current)
            .catch(err => console.error("PDFDocument: Could not load PDF: ", err));
    });
    const doLoad = (docViewer) => __awaiter(void 0, void 0, void 0, function* () {
        const loadingTask = PDFDocs_1.PDFDocs.getDocument({ url: docURL, docBaseURL: docURL });
        let progressTracker;
        loadingTask.onProgress = (progress) => {
            if (!progressTracker) {
                progressTracker = new ProgressTracker_1.ProgressTracker({
                    id: 'pdf-download',
                    total: progress.total
                });
            }
            if (progress.loaded > progress.total) {
                return;
            }
            ProgressMessages_1.ProgressMessages.broadcast(progressTracker.abs(progress.loaded));
        };
        docRef.current = yield loadingTask.promise;
        const page = yield docRef.current.getPage(1);
        docViewer.viewer.setDocument(docRef.current);
        docViewer.linkService.setDocument(docRef.current, null);
        const finder = PDFFindControllers_1.PDFFindControllers.createFinder(docViewer.eventBus, docViewer.findController);
        setFinder(finder);
        docViewer.eventBus.on('pagesinit', () => {
            annotationBarInjector();
            if (!active) {
                setActive(true);
            }
        });
        const resizeDebouncer = Debouncers_1.Debouncers.create(() => resize());
        window.addEventListener('resize', resizeDebouncer, { passive: true });
        document.getElementById("viewerContainer")
            .addEventListener("resize", resizeDebouncer);
        setResizer(resizeDebouncer);
        setTimeout(() => resize(), 1);
        function createOutline() {
            return __awaiter(this, void 0, void 0, function* () {
                function toOutline(outline) {
                    const id = Numbers_1.Numbers.toString(nonceFactory());
                    return {
                        id,
                        title: outline.title,
                        destination: outline.dest,
                        children: outline.items.map(toOutline)
                    };
                }
                const nonceFactory = Nonces_1.Nonces.createFactory();
                const outline = yield docRef.current.getOutline();
                if (!outline) {
                    return undefined;
                }
                const items = outline.map(toOutline);
                return { items };
            });
        }
        const outline = yield createOutline();
        setOutline(outline);
        setOutlineNavigator((destination) => __awaiter(void 0, void 0, void 0, function* () { return docViewer.linkService.navigateTo(destination); }));
        function createPageNavigator(pdfDocumentProxy) {
            const count = pdfDocumentProxy.numPages;
            function get() {
                return docViewer.viewer.currentPageNumber;
            }
            function jumpToPage(page) {
                return __awaiter(this, void 0, void 0, function* () {
                    docViewer.viewer.currentPageNumber = page;
                });
            }
            return { count, jumpToPage, get };
        }
        pageNavigatorRef.current = createPageNavigator(docRef.current);
        dispatchPDFDocMeta();
        setPageNavigator(pageNavigatorRef.current);
        const handleScroll = Debouncers_1.Debouncers.create(() => {
            dispatchPDFDocMeta();
        });
        docViewer.containerElement.addEventListener('scroll', () => {
            handleScroll();
        }, { passive: true });
        const scaleLeveler = (scale) => {
            return setScale(scale);
        };
        setScaleLeveler(scaleLeveler);
        class PDFDocScale {
            get scale() {
                const currentScaleValue = docViewerRef.current.viewer.currentScaleValue;
                const result = ScaleLevels_1.ScaleLevelTuplesMap[currentScaleValue];
                if (!result) {
                    return ScaleLevels_1.ScaleLevelTuplesMap["page width"];
                }
                return result;
            }
            get scaleValue() {
                return docViewerRef.current.viewer.currentScale;
            }
        }
        setDocScale(new PDFDocScale());
        function enableAutoPagemarks() {
            if (prefs.get(KnownPrefs_1.KnownPrefs.AUTO_PAGEMARKS) !== 'true') {
                return;
            }
            console.log("Auto pagemarks enabled");
            function onPagemarkExtend(extendPagemark) {
                const docMeta = docMetaProvider();
                if (!docMeta) {
                    return;
                }
                const extender = Pagemarks_1.Pagemarks.createExtender(docMeta);
                extender(extendPagemark);
                function doAsync(docMeta) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const persistenceLayer = persistenceLayerProvider();
                        yield persistenceLayer.writeDocMeta(docMeta);
                    });
                }
                doAsync(docMeta)
                    .catch(err => log.error("Unable to write docMeta: ", err));
            }
            Scrollers_1.Scrollers.register(onPagemarkExtend, { mode: 'full' });
        }
        enableAutoPagemarks();
    });
    function resize() {
        if (['page-width', 'page-fit'].includes(scaleRef.current.value)) {
            setScale(scaleRef.current);
        }
        if (docViewerRef.current) {
            return docViewerRef.current.viewer.currentScale;
        }
        else {
            throw new Error("No viewer");
        }
    }
    function setScale(scale) {
        if (docViewerRef.current) {
            scaleRef.current = scale;
            docViewerRef.current.viewer.currentScaleValue = scale.value;
            dispatchPDFDocMeta();
            return docViewerRef.current.viewer.currentScale;
        }
        throw new Error("No viewer");
    }
    function dispatchPDFDocMeta() {
        if (docRef.current && docViewerRef.current) {
            const docDescriptor = {
                nrPages: docRef.current.numPages,
                fingerprint: docRef.current.fingerprint
            };
            setPage(pageNavigatorRef.current.get());
            setDocDescriptor(docDescriptor);
        }
    }
    return active && (React.createElement(React.Fragment, null,
        React.createElement(DocumentInitHook_1.DocumentInit, null),
        props.children)) || null;
});
//# sourceMappingURL=PDFDocument.js.map