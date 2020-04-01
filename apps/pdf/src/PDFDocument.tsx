import * as React from 'react';
import {
    EventBus,
    PDFFindController,
    PDFLinkService,
    PDFViewer,
    PDFRenderingQueue,
} from 'pdfjs-dist/web/pdf_viewer';

import * as foo from 'pdfjs-dist/web/pdf_viewer';
import PDFJS, {DocumentInitParameters, PDFDocumentProxy, PDFViewerOptions} from "pdfjs-dist";
import {URLStr} from "polar-shared/src/util/Strings";
import { Logger } from 'polar-shared/src/logger/Logger';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

const log = Logger.create();

console.log("FIXME PDFRenderingQueue: ", PDFRenderingQueue);
console.log("FIXME foo: ", foo);

PDFJS.GlobalWorkerOptions.workerSrc = '../../../node_modules/pdfjs-dist/build/pdf.worker.js';

namespace pdfjs {

    export interface FindCommandState {
        query: string;
        phraseSearch: boolean;
        caseSensitive: boolean;
        highlightAll: boolean;
        findPrevious: boolean;
    }

    export interface IFindController {
        reset(): void;
        nextMatch(): void;
        executeCommand(cmd: string, state: FindCommandState): void;
        setDocument(doc: PDFDocumentProxy): void;

    }

    export interface ILinkService {
        setDocument(doc: PDFDocumentProxy, baseURL: string | null): void;
    }

}

interface DocViewer {
    readonly eventBus: EventBus;
    readonly findController: PDFFindController;
    readonly viewer: PDFViewer;
    readonly linkService: PDFLinkService;
    readonly renderingQueue: PDFRenderingQueue;
}

function createDocViewer(): DocViewer {

    const eventBus = new EventBus({dispatchToDOM: false});
    // TODO  this isn't actually exported..
    const renderingQueue = new PDFRenderingQueue();

    const linkService = new PDFLinkService({
        eventBus,
    });

    const findController = new PDFFindController({
        linkService,
        eventBus
    });

    const containerElement = document.getElementById('viewerContainer')! as HTMLDivElement;

    if (containerElement === null) {
        throw new Error("No containerElement");
    }

    const viewerElement = document.getElementById('viewer')! as HTMLDivElement;

    if (viewerElement === null) {
        throw new Error("No viewerElement");
    }

    // FIXME: use the proper render mode...

    const viewerOpts: PDFViewerOptions = {
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
        // renderer: "svg",
        // renderingQueue, // this isn't actually needed when its in a scroll container
        maxCanvasPixels: 16777216,
        enablePrintAutoRotate: false,
        // renderer: RendererType.SVG,
        // renderer: RenderType
        // removePageBorders: true,
        // defaultViewport: viewport
    };

    const viewer = new PDFViewer(viewerOpts);

    linkService.setViewer(viewer);
    renderingQueue.setViewer(viewer);

    (renderingQueue as any).onIdle = () => {
        viewer.cleanup();

    };

    return {eventBus, findController, viewer, linkService, renderingQueue};

}

interface LoadedDoc {
    readonly doc: PDFJS.PDFDocumentProxy;
    readonly scale: number | string;
}

interface IProps {
    readonly target: string;
    readonly url: URLStr;
}

interface IState {
    readonly loadedDoc?: LoadedDoc;
}

export class PDFDocument extends React.Component<IProps, IState> {

    private docViewer: DocViewer | undefined;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.doLoad = this.doLoad.bind(this);

        this.state = {};

    }

    public componentDidMount(): void {
        this.docViewer = createDocViewer();

        this.doLoad(this.docViewer)
            .catch(err => log.error("Could not load PDF: ", err));

    }

    private async doLoad(docViewer: DocViewer) {

        const {url} = this.props;

        const init: DocumentInitParameters = {
            url,
            cMapPacked: true,
            cMapUrl: '../../node_modules/pdfjs-dist/cmaps/',
            disableAutoFetch: true,
        };

        const doc = await PDFJS.getDocument(init).promise;
        const page = await doc.getPage(1);
        const viewport = page.getViewport({scale: 1.0});

        const calculateScale = (to: number, from: number) => {
            console.log(`Calculating scale from ${from} to ${to}...`);
            return to / from;
        };

        const scale = calculateScale(window.innerWidth, viewport.width);

        docViewer.viewer.setDocument(doc);
        (docViewer.linkService as pdfjs.ILinkService).setDocument(doc, null);

        // docViewer.viewer.update();

        setTimeout(() => {

            // FIXME the PDF version of this viewer doesn't seem to handle CPU
            // properly and continues to composite this on the GPU using 100%
            // of resources while scrolling.  This is probably the issue we
            // had with react-pdf

            //
            // FIXME: it seems that chrome with pdfjs tends to run
            // "composite layers" too often.  Not sure why.


            console.log("FIXME: setting page to page-width");
            docViewer.viewer.currentScaleValue = 'page-width';
            // docViewer.viewer.currentScaleValue = '2';

        }, 1 );

        this.setState({
            loadedDoc: {
                scale, doc
            }
        });

        // FIXME: now I need a way to render the pages with react-window ...
        // right now it just renders them all and with out having a component
        // on top of every page I can't easily add context menus and so forth
        // I think.


    }

    public render() {
        // console.log("FIXME: render");
        // TODO render single pages...
        return null;
    }

}

//
// export const PDFDocument = () => {
//
//     const [state, setState] = useState<IState>(createState());
//
//     return (
//         <div>
//             state.active: {state.active}
//             <button onClick={() => setState({...state, active: ! state.active})}>toggle</button>
//         </div>
//     );
//
// };
