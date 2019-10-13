import PDFJS from 'pdfjs-dist';
import {FilePaths} from "polar-shared/src/util/FilePaths";

async function doLoad() {

    const url = FilePaths.toURL("/home/burton/projects/polar-app/packages/polar-bookshelf/docs/examples/pdf/availability.pdf");

    const doc = await PDFJS.getDocument(url).promise;

    const page = await doc.getPage(1);

    const scale = 1;
    const viewport = page.getViewport({ scale: scale, });

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

doLoad().catch(err => console.log(err));

export=null;
