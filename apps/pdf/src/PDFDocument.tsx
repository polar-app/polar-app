import * as React from 'react';
import {
    EventBus,
    PDFFindController,
    PDFLinkService,
    PDFRenderingQueue,
    PDFViewer
} from 'pdfjs-dist/web/pdf_viewer';
import PDFJS, {DocumentInitParameters, PDFViewerOptions} from "pdfjs-dist";
import {URLStr} from "polar-shared/src/util/Strings";
import {Logger} from 'polar-shared/src/logger/Logger';
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {Callback1} from "polar-shared/src/util/Functions";
import {FindManager, Finder} from "./Finders";
import {PDFFindControllers} from "./PDFFindControllers";
import {ProgressMessages} from "../../../web/js/ui/progress_bar/ProgressMessages";
import {ProgressTracker} from "polar-shared/src/util/ProgressTracker";

const log = Logger.create();

PDFJS.GlobalWorkerOptions.workerSrc = '../../../node_modules/pdfjs-dist/build/pdf.worker.js';

interface DocViewer {
    readonly eventBus: EventBus;
    readonly findController: PDFFindController;
    readonly viewer: PDFViewer;
    readonly linkService: PDFLinkService;
    readonly renderingQueue: PDFRenderingQueue;
    readonly containerElement: HTMLElement;
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

    return {eventBus, findController, viewer, linkService, renderingQueue, containerElement};

}

interface LoadedDoc {
    readonly doc: PDFJS.PDFDocumentProxy;
    readonly scale: number | string;
}

type OnFinderCallback = Callback1<Finder>;

interface IProps {
    readonly target: string;
    readonly url: URLStr;
    readonly onFinder: OnFinderCallback;
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

        // FIXME: remove listeners...

    }

    private async doLoad(docViewer: DocViewer) {

        const {url} = this.props;

        const init: DocumentInitParameters = {
            url,
            cMapPacked: true,
            cMapUrl: '../../node_modules/pdfjs-dist/cmaps/',
            disableAutoFetch: true,
        };

        const loadingTask = PDFJS.getDocument(init);

        let progressTracker: ProgressTracker | undefined;
        loadingTask.onProgress = (progress) => {

            if (! progressTracker) {
                progressTracker = new ProgressTracker({
                    id: 'pdf-download',
                    total: progress.total
                });
            }

            ProgressMessages.broadcast(progressTracker!.abs(progress.loaded));

        };

        const doc = await loadingTask.promise;
        const page = await doc.getPage(1);
        const viewport = page.getViewport({scale: 1.0});

        const calculateScale = (to: number, from: number) => {
            console.log(`Calculating scale from ${from} to ${to}...`);
            return to / from;
        };

        const scale = calculateScale(window.innerWidth, viewport.width);

        docViewer.viewer.setDocument(doc);
        docViewer.linkService.setDocument(doc, null);

        const finder = PDFFindControllers.createFinder(docViewer.eventBus,
                                                       docViewer.findController);

        this.props.onFinder(finder);

        const doResize = () => {
            docViewer.viewer.currentScaleValue = 'page-width';
        };

        const resizeDebouncer = Debouncers.create(() => doResize());

        window.addEventListener('resize', () => {
            resizeDebouncer();
        });

        setTimeout(() => {
            doResize();
        }, 1 );

        this.setState({
            loadedDoc: {
                scale, doc
            }
        });

    }

    public render() {
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
