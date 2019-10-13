import PDFJS, {PDFPageProxy, DocumentInitParameters} from 'pdfjs-dist';
import {FilePaths} from "polar-shared/src/util/FilePaths";

import {PDFSinglePageViewer, TextLayerMode} from 'pdfjs-dist/web/pdf_viewer';

PDFJS.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.js';
// (<any> PDFJS).cMapUrl = '../../node_modules/pdfjs-dist/cmaps/';
// (<any> PDFJS).cMapPacked = true;

console.log("FIXME: ", PDFJS);

async function doLoad() {

    const url = FilePaths.toURL("/home/burton/projects/polar-app/packages/polar-bookshelf/docs/examples/pdf/availability.pdf");

    const doc = await PDFJS.getDocument(url).promise;

    const page = await doc.getPage(1);

    // const scale = 1;
    // const viewport = page.getViewport({ scale: scale, });


    const calculateScale = (page: PDFPageProxy, desiredWidth: number) => {
        const viewport = page.getViewport({ scale: 1, });
        console.log("FIXME: viewport width: " + viewport.width);

        return desiredWidth / viewport.width;
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

    // FIXME: this KIND of works and only renders a single page BUT what happens is that
    // the fonts look like crap and scaled down they will probably look worse.

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

    // FIXME: compute the scale from the height or the width (whichever is larger)
    const calculateScaleFromWidth = (page: PDFPageProxy, desiredWidth: number) => {
        const viewport = page.getViewport({ scale: 1, });
        return calculateScale(desiredWidth, viewport.width);
    };

    const calculateScaleFromHeight = (page: PDFPageProxy, desiredHeight: number) => {
        const viewport = page.getViewport({ scale: 1, });
        console.log("FIXME: viewport.height: " + viewport.height);

        return calculateScale(desiredHeight, viewport.height);
    };

    const calculateScale = (to: number, from: number) => {
        return to / from;
    };

    const page = await doc.getPage(1);

    // const width = document.body.clientWidth;
    // const width = window.innerWidth;
    // console.log("FIXME: width: " + width);
    // const scale = calculateScaleFromWidth(page, width) - 1;

    // const height = window.innerHeight;
    // const height = ;
    // console.log("FIXME: height: " + height);
    const scale = calculateScale(window.innerHeight, container.offsetHeight);
    console.log("FIXME: scale: " + scale);


    viewer.currentScale = scale;

}

doLoad2().catch(err => console.log(err));
