import PDFJS, {DocumentInitParameters, PDFDocumentProxy} from 'pdfjs-dist';
import {FilePaths} from "polar-shared/src/util/FilePaths";

import {
    EventBus,
    PDFFindController,
    PDFLinkService,
    PDFViewer,
    PDFViewerOptions
} from 'pdfjs-dist/web/pdf_viewer';
import {DocPreviewURLs} from "polar-webapp-links/src/docs/DocPreviewURLs";
import {
    DocPreviewCached,
    DocPreviews
} from "polar-firebase/src/firebase/om/DocPreviews";
import {AnalyticsInitializer} from "../../web/js/analytics/AnalyticsInitializer";
import {FirestoreCollections} from "../repository/js/reviewer/FirestoreCollections";
import {Version} from 'polar-shared/src/util/Version';
import {Analytics} from "../../web/js/analytics/Analytics";
import {Strings} from "polar-shared/src/util/Strings";
import {Prerenderer} from "./Prerenderer";
import {UserAgents} from "./UserAgents";

PDFJS.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.js';

async function getDocPreview(): Promise<DocPreviewCached> {

    const parsedURL = DocPreviewURLs.parse(document.location.href);

    if (parsedURL) {

        const docPreview = await DocPreviews.get(parsedURL.id);

        if (! docPreview) {
            throw new Error("No doc for: " + parsedURL.id);
        }

        if (! docPreview.cached) {
            throw new Error("Doc not cached: " + parsedURL.id);
        }

        console.log("Working with docPreview: ", docPreview);

        return docPreview;

    }

    const urlHash = '01234';
    const docHash = '56789';
    const datastoreURL = FilePaths.toURL("/Users/burton/projects/polar-app/packages/polar-bookshelf/docs/examples/pdf/availability.pdf");

    return {
        id: urlHash,
        urlHash,
        docHash,
        datastoreURL,
        slug: 'test-slug',
        cached: true,
        url: datastoreURL
    };

}

interface DocMetadata {
    readonly title: string;
    readonly description: string;
}

function traceLoading() {
    const pages = document.querySelectorAll(".page");
    console.log("We have N pages: " + pages.length);

    const textLayers = document.querySelectorAll(".textLayer");
    console.log("We have N textLayers: " + textLayers.length);
}

function onDocumentLoaded() {

    console.log("PDF document loaded");

    Prerenderer.done();

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


const doUpdateRelCanonical = (docPreview: DocPreviewCached) => {

    const link = document.querySelector("head link[rel='canonical']");

    if (! link) {
        console.warn("No rel=canonical link");
        return;
    }

    const href = DocPreviewURLs.create({
        id: docPreview.urlHash,
        category: docPreview.category,
        title: docPreview.title,
        slug: docPreview.slug
    });

    link.setAttribute('href', href);

};

const doUpdateAppVersion = () => {

    const meta = document.querySelector("meta[name='app_version']");

    const version = Version.get();

    if (! meta) {
        console.warn("No app_version meta");
        return;
    }

    meta.setAttribute('content', version);

};

async function doLoad() {

    Prerenderer.loading();

    handleDocLoad();

    const version = Version.get();

    console.log("Running with version: " + version);

    await FirestoreCollections.configure();

    AnalyticsInitializer.doInit();

    Analytics.event2('screen:preview');

    const docPreview = await getDocPreview();
    const url = docPreview.datastoreURL;

    const doUpdateTitle = () => {

        if (docPreview.title) {
            const title = '[PDF] ' + Strings.truncateOnWordBoundary(docPreview.title, 50);
            document.title = title;
        }

    };

    const doUpdateDescription = () => {

        if (docPreview.description) {

            const descriptionElement = document.querySelector("meta[name=description]");

            if (descriptionElement) {
                const description = Strings.truncateOnWordBoundary(docPreview.description, 165);
                descriptionElement.setAttribute('content', description);
            }

        }

    };

    doUpdateTitle();
    doUpdateDescription();
    doUpdateAppVersion();

    doUpdateRelCanonical(docPreview);

    const init: DocumentInitParameters = {
        url,
        cMapPacked: true,
        cMapUrl: '../../node_modules/pdfjs-dist/cmaps/'
    };

    const doc = await PDFJS.getDocument(init).promise;

    // const container = <HTMLDivElement> document.getElementById('viewerContainer')!;
    const container = <HTMLDivElement> document.getElementById('viewer')!;

    // const container = <HTMLDivElement> document.getElementById('viewer')!;

    console.log("Rendering to: ", container);

    if (container === null) {
        throw new Error("No container");
    }

    const page = await doc.getPage(1);

    const eventBus = new EventBus();
    // TODO  this isn't actually exported..
    // const pdfRenderingQueue = new PDFRenderingQueue();

    const linkService = new PDFLinkService({
        eventBus,
    });

    const findController = new PDFFindController({
        linkService,
        eventBus
    });

    // FIXME the page viewport sees is wrong.
    const viewport = page.getViewport({scale: 1.0});

    // NOTE: if we set textLayerMode: 0 no text is rendered.

    if (UserAgents.isPrerender()) {
        Prerenderer.injectCSS();
    }

    const viewerOpts: PDFViewerOptions = {
        container,
        textLayerMode: 2,
        linkService,
        findController,
        eventBus,
        // renderer: "svg",
        renderer: 'canvas'
    };

    const viewer = new PDFViewer(viewerOpts);

    linkService.setViewer(viewer);

    // console.log("pageView width: ", pageView.width);

    // FIXME: title, description, and all other metadata should be shown on the
    // page for proper SEO + user metadata (DOI, author information, etc)

    viewer.setDocument(doc);
    linkService.setDocument(doc, null);

    const pageView = viewer.getPageView(1);

    console.log("pageView: ", pageView);

    const calculateScale = (to: number, from: number) => {
        console.log(`Calculating scale from ${from} to ${to}...`);
        return to / from;
    };

    console.log("page view: ", page.view);
    console.log("viewport: ", viewport);
    console.log("window.innerHeight: ", window.innerHeight);

    console.log("converted: ", viewport.convertToViewportPoint(viewport.width, viewport.height));

    const scale = calculateScale(window.innerWidth, viewport.width);

    console.log("scale: " + scale);

    const pdfMetadata = await doc.getMetadata();

    const docMetadata: DocMetadata = {
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
        // viewer.currentScaleValue = '2';
    };

    console.log("currentScale: ", viewer.currentScale);
    console.log("currentScaleValue: ", viewer.currentScaleValue);

    doResize();

    // viewer.currentScale = 0.5;

    window.addEventListener('resize', () => doResize());

    // eventBus.on("updatefindmatchescount", (evt: any) => {
    //     console.log("TODO: ", evt);
    // });

    // eventBus.on('updatefindcontrolstate', (event: any) => {
    //     console.log("find control state: ", event);
    // });

    // findController.executeCommand('find', {
    //     query: 'Gene',
    //     phraseSearch: false,
    //     caseSensitive: false,
    //     highlightAll: true,
    //     findPrevious: false
    // });

    traceLoading();

}

doLoad()
    .catch(err => console.log(err));
