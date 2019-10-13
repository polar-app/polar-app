import PDFJS, {PDFPageProxy, DocumentInitParameters} from 'pdfjs-dist';
import {FilePaths} from "polar-shared/src/util/FilePaths";

import {PDFSinglePageViewer, TextLayerMode} from 'pdfjs-dist/web/pdf_viewer';

PDFJS.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.js';

async function doLoad2() {

    // FIXME: accept a URL to render..

    const url = FilePaths.toURL("/home/burton/projects/polar-app/packages/polar-bookshelf/docs/examples/pdf/availability.pdf");

    const init: DocumentInitParameters = {
        url,
        cMapPacked: true,
        cMapUrl: '../../node_modules/pdfjs-dist/cmaps/'
    };

    const doc = await PDFJS.getDocument(init).promise;

    const container = <HTMLDivElement> document.getElementById('viewerContainer')!;

    if (container === null) {
        throw new Error("No container");
    }

    const viewer = new PDFSinglePageViewer({
        container,
        textLayerMode: 0
    });

    viewer.setDocument(doc);

    const calculateScale = (to: number, from: number) => {
        return to / from;
    };

    const scale = calculateScale(window.innerHeight, container.offsetHeight);

    viewer.currentScale = scale;

}

doLoad2().catch(err => console.log(err));
