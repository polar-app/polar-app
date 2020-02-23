import PDFJS, {DocumentInitParameters} from 'pdfjs-dist';
import {FilePaths} from "polar-shared/src/util/FilePaths";

import {PDFSinglePageViewer} from 'pdfjs-dist/web/pdf_viewer';
import {DocPreviewURLs} from "polar-webapp-links/src/docs/DocPreviewURLs";
import {
    DocPreview,
    DocPreviews
} from "polar-firebase/src/firebase/om/DocPreviews";

PDFJS.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.js';

function getURL(): string {

    const parseURL = new URL(document.location.href);

    const url = parseURL.searchParams.get('url') ||
                parseURL.searchParams.get('file');

    if (url) {
        return url;
    }

    // FIXME: this URL should not be local but should be something in cloud storage
    return FilePaths.toURL("/Users/burton/projects/polar-app/packages/polar-bookshelf/docs/examples/pdf/availability.pdf");

}

async function getDocPreview(): Promise<DocPreview> {

    const parsedURL = DocPreviewURLs.parse(document.location.href);

    if (parsedURL) {

        const docPreview = await DocPreviews.get(parsedURL.hashcode);

        if (! docPreview) {
            throw new Error("No doc for: " + parsedURL.hashcode);
        }

        return docPreview;

    }

    const hashcode = '12345';
    const datastoreURL = FilePaths.toURL("/Users/burton/projects/polar-app/packages/polar-bookshelf/docs/examples/pdf/availability.pdf");

    return {
        cached: true,
        fingerprint: hashcode,
        hashcode,
        datastoreURL
    };

}

interface DocMetadata {
    readonly title: string;
    readonly description: string;
}

// FIXME: get the DocInfo from either the URL command line or firebase.

async function doLoad2() {

    // FIXME: accept a URL to render..

    const url = getURL();

    const init: DocumentInitParameters = {
        url,
        cMapPacked: true,
        cMapUrl: '../../node_modules/pdfjs-dist/cmaps/'
    };

    const doc = await PDFJS.getDocument(init).promise;

    const container = <HTMLDivElement> document.getElementById('viewerContainer')!;

    // const container = <HTMLDivElement> document.getElementById('viewer')!;

    console.log("Rendering to: ", container);

    if (container === null) {
        throw new Error("No container");
    }

    const page = await doc.getPage(1);

    // FIXME the page viewport sees wrong.
    const viewport = page.getViewport({scale: 1.0});

    // NOTE: if we set textLayerMode: 0 no text is rendered.

    const viewer = new PDFSinglePageViewer({
        container,
        textLayerMode: 2,
        removePageBorders: true,
        // defaultViewport: viewport
    });

    // console.log("pageView width: ", pageView.width);

    // FIXME: title, description, and all other metadata should be shown on the
    // page for proper SEO + user metadata (DOI, author information, etc)

    // TODO: other approaches for pre-rendering:
    //
    // - store the textlayer in firestore, and then assemble the HTML on the
    //   backend in realtime including the metadata like title, link, description,
    //   etc

    viewer.setDocument(doc);

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

    function doResize() {
        // console.log('resizing');
        viewer.currentScaleValue = 'page-width';
    }

    console.log("currentScale: ", viewer.currentScale);
    console.log("currentScaleValue: ", viewer.currentScaleValue);

    doResize();

    window.addEventListener('resize', () => doResize());

}

doLoad2()
    .catch(err => console.log(err));
