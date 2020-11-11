"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdfjs_dist_1 = __importDefault(require("pdfjs-dist"));
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const pdf_viewer_1 = require("pdfjs-dist/web/pdf_viewer");
const DocPreviewURLs_1 = require("polar-webapp-links/src/docs/DocPreviewURLs");
const DocPreviews_1 = require("polar-firebase/src/firebase/om/DocPreviews");
const AnalyticsInitializer_1 = require("../../web/js/analytics/AnalyticsInitializer");
const FirestoreCollections_1 = require("../repository/js/reviewer/FirestoreCollections");
const Version_1 = require("polar-shared/src/util/Version");
const Analytics_1 = require("../../web/js/analytics/Analytics");
const Strings_1 = require("polar-shared/src/util/Strings");
const Prerenderer_1 = require("./Prerenderer");
const UserAgents_1 = require("./UserAgents");
pdfjs_dist_1.default.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.js';
function getDocPreview() {
    return __awaiter(this, void 0, void 0, function* () {
        const parsedURL = DocPreviewURLs_1.DocPreviewURLs.parse(document.location.href);
        if (parsedURL) {
            const docPreview = yield DocPreviews_1.DocPreviews.get(parsedURL.id);
            if (!docPreview) {
                throw new Error("No doc for: " + parsedURL.id);
            }
            if (!docPreview.cached) {
                throw new Error("Doc not cached: " + parsedURL.id);
            }
            console.log("Working with docPreview: ", docPreview);
            return docPreview;
        }
        const urlHash = '01234';
        const docHash = '56789';
        const datastoreURL = FilePaths_1.FilePaths.toURL("/Users/burton/projects/polar-app/packages/polar-bookshelf/docs/examples/pdf/availability.pdf");
        return {
            id: urlHash,
            urlHash,
            docHash,
            datastoreURL,
            slug: 'test-slug',
            cached: true,
            url: datastoreURL
        };
    });
}
function traceLoading() {
    const pages = document.querySelectorAll(".page");
    console.log("We have N pages: " + pages.length);
    const textLayers = document.querySelectorAll(".textLayer");
    console.log("We have N textLayers: " + textLayers.length);
}
function onDocumentLoaded() {
    console.log("PDF document loaded");
    Prerenderer_1.Prerenderer.done();
}
function handleDocLoad() {
    document.addEventListener('textlayerrendered', function (e) {
        const pages = document.querySelectorAll(".page");
        const textLayers = document.querySelectorAll(".textLayer");
        if (pages.length === textLayers.length || textLayers.length > 5) {
            onDocumentLoaded();
        }
    }, true);
}
const doUpdateRelCanonical = (docPreview) => {
    const link = document.querySelector("head link[rel='canonical']");
    if (!link) {
        console.warn("No rel=canonical link");
        return;
    }
    const href = DocPreviewURLs_1.DocPreviewURLs.create({
        id: docPreview.urlHash,
        category: docPreview.category,
        title: docPreview.title,
        slug: docPreview.slug
    });
    link.setAttribute('href', href);
};
const doUpdateAppVersion = () => {
    const meta = document.querySelector("meta[name='app_version']");
    const version = Version_1.Version.get();
    if (!meta) {
        console.warn("No app_version meta");
        return;
    }
    meta.setAttribute('content', version);
};
function doLoad() {
    return __awaiter(this, void 0, void 0, function* () {
        Prerenderer_1.Prerenderer.loading();
        handleDocLoad();
        const version = Version_1.Version.get();
        console.log("Running with version: " + version);
        yield FirestoreCollections_1.FirestoreCollections.configure();
        AnalyticsInitializer_1.AnalyticsInitializer.doInit();
        Analytics_1.Analytics.event2('screen:preview');
        const docPreview = yield getDocPreview();
        const url = docPreview.datastoreURL;
        const doUpdateTitle = () => {
            if (docPreview.title) {
                const title = '[PDF] ' + Strings_1.Strings.truncateOnWordBoundary(docPreview.title, 50);
                document.title = title;
            }
        };
        const doUpdateDescription = () => {
            if (docPreview.description) {
                const descriptionElement = document.querySelector("meta[name=description]");
                if (descriptionElement) {
                    const description = Strings_1.Strings.truncateOnWordBoundary(docPreview.description, 165);
                    descriptionElement.setAttribute('content', description);
                }
            }
        };
        doUpdateTitle();
        doUpdateDescription();
        doUpdateAppVersion();
        doUpdateRelCanonical(docPreview);
        const init = {
            url,
            cMapPacked: true,
            cMapUrl: '../../node_modules/pdfjs-dist/cmaps/'
        };
        const doc = yield pdfjs_dist_1.default.getDocument(init).promise;
        const container = document.getElementById('viewer');
        console.log("Rendering to: ", container);
        if (container === null) {
            throw new Error("No container");
        }
        const page = yield doc.getPage(1);
        const eventBus = new pdf_viewer_1.EventBus();
        const linkService = new pdf_viewer_1.PDFLinkService({
            eventBus,
        });
        const findController = new pdf_viewer_1.PDFFindController({
            linkService,
            eventBus
        });
        const viewport = page.getViewport({ scale: 1.0 });
        if (UserAgents_1.UserAgents.isPrerender()) {
            Prerenderer_1.Prerenderer.injectCSS();
        }
        const viewerOpts = {
            container,
            textLayerMode: 2,
            linkService,
            findController,
            eventBus,
            renderer: 'canvas'
        };
        const viewer = new pdf_viewer_1.PDFViewer(viewerOpts);
        linkService.setViewer(viewer);
        viewer.setDocument(doc);
        linkService.setDocument(doc, null);
        const pageView = viewer.getPageView(1);
        console.log("pageView: ", pageView);
        const calculateScale = (to, from) => {
            console.log(`Calculating scale from ${from} to ${to}...`);
            return to / from;
        };
        console.log("page view: ", page.view);
        console.log("viewport: ", viewport);
        console.log("window.innerHeight: ", window.innerHeight);
        console.log("converted: ", viewport.convertToViewportPoint(viewport.width, viewport.height));
        const scale = calculateScale(window.innerWidth, viewport.width);
        console.log("scale: " + scale);
        const pdfMetadata = yield doc.getMetadata();
        const docMetadata = {
            title: pdfMetadata.info.Title || '',
            description: pdfMetadata.info.Description || ''
        };
        console.log("pdfMetadata: ", pdfMetadata);
        console.log("pdfMetadata.metadata: ", pdfMetadata.metadata);
        console.log("docMetadata: ", docMetadata);
        const doResize = () => {
            const computeZoomLevel = () => {
                const parsedURL = new URL(document.location.href);
                const zoom = parsedURL.searchParams.get('zoom');
                return zoom || 'page-width';
            };
            viewer.currentScaleValue = computeZoomLevel();
        };
        console.log("currentScale: ", viewer.currentScale);
        console.log("currentScaleValue: ", viewer.currentScaleValue);
        doResize();
        window.addEventListener('resize', () => doResize());
        traceLoading();
    });
}
doLoad()
    .catch(err => console.log(err));
//# sourceMappingURL=index.js.map