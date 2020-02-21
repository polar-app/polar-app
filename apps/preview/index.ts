import PDFJS, {PDFPageProxy, DocumentInitParameters} from 'pdfjs-dist';
import {FilePaths} from "polar-shared/src/util/FilePaths";

import {PDFSinglePageViewer, TextLayerMode} from 'pdfjs-dist/web/pdf_viewer';

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

    console.log("Rendering to: ", container)

    if (container === null) {
        throw new Error("No container");
    }

    // NOTE: if we set textLayerMode: 0 no text is rendered.

    const viewer = new PDFSinglePageViewer({
        container,
        // textLayerMode: 1
    });

    // FIXME: title, description, and all other metadata should be shown on the
    // page for proper SEO + user metadata (DOI, author information, etc)

    viewer.setDocument(doc);

    const calculateScale = (to: number, from: number) => {
        return to / from;
    };

    const scale = calculateScale(window.innerHeight, container.offsetHeight);

    console.log("scale: " + scale);

    const pdfMetadata = await doc.getMetadata();

    const docMetadata: DocMetadata = {
        title: pdfMetadata.info.Title || '',
        description: pdfMetadata.info.Description || ''
    };

    console.log("pdfMetadata: ", pdfMetadata);
    console.log("pdfMetadata.metadata: ", pdfMetadata.metadata);

    console.log("docMetadata: ", docMetadata);

    // viewer.currentScale = scale;

}

doLoad2()
    .catch(err => console.log(err));
