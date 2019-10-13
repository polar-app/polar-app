import PDFJS, {PDFPageProxy} from 'pdfjs-dist';
import {FilePaths} from "polar-shared/src/util/FilePaths";

import {PDFSinglePageViewer} from 'pdfjs-dist/web/pdf_viewer'

PDFJS.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.js';
// PDFJS.cMapUrl = '../../node_modules/pdfjs-dist/cmaps/';
// PDFJS.cMapPacked = true;

async function doLoad() {

    const url = FilePaths.toURL("/home/burton/projects/polar-app/packages/polar-bookshelf/docs/examples/pdf/availability.pdf");

    const doc = await PDFJS.getDocument(url).promise;

    const page = await doc.getPage(1);

    // const scale = 1;
    // const viewport = page.getViewport({ scale: scale, });

    const calculateScale = (page: PDFPageProxy, desiredWidth: number) => {
        const viewport = page.getViewport({ scale: 1, });
        const scale = desiredWidth / viewport.width;
        return scale;
    };

    const scale = calculateScale(page, 1024);
    const viewport = page.getViewport({ scale});

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: context,
        viewport: viewport
    };

    page.render(renderContext);

    document.body.appendChild(canvas);

}

async function doLoad2() {

    const url = FilePaths.toURL("/home/burton/projects/polar-app/packages/polar-bookshelf/docs/examples/pdf/availability.pdf");

    const doc = await PDFJS.getDocument(url).promise;

    const container = <HTMLDivElement> document.getElementById('viewer')!;

    const viewer = new PDFSinglePageViewer({
        container,
        // FIXME: textLayerMode: TextLayerMode.DISABLE
    });

    viewer.setDocument(doc);

}

doLoad2().catch(err => console.log(err));
