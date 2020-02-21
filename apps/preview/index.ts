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

    return FilePaths.toURL("/Users/burton/projects/polar-app/packages/polar-bookshelf/docs/examples/pdf/availability.pdf");

}

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

    // viewer.currentScale = scale;

}

doLoad2().catch(err => console.log(err));
