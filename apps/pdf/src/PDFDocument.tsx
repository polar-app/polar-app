import * as React from 'react';
import {
    EventBus,
    PDFFindController,
    PDFLinkService,
    PDFViewer
} from 'pdfjs-dist/web/pdf_viewer';
import PDFJS, {DocumentInitParameters, PDFDocumentProxy} from "pdfjs-dist";
import {URLStr} from "polar-shared/src/util/Strings";
import { Logger } from 'polar-shared/src/logger/Logger';

const log = Logger.create();

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
}

function createDocViewer(): DocViewer {

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

    const container = document.getElementById('viewer')! as HTMLDivElement;

    if (container === null) {
        throw new Error("No container");
    }

    const viewerOpts = {
        container,
        textLayerMode: 2,
        linkService, // FIXME: setting the linkServices causes errors.
        findController,
        eventBus,
        // removePageBorders: true,
        // defaultViewport: viewport
    };

    const viewer = new PDFViewer(viewerOpts);

    linkService.setViewer(viewer);

    return {eventBus, findController, viewer, linkService};

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
            cMapUrl: '../../node_modules/pdfjs-dist/cmaps/'
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

        setTimeout(() => {
            console.log("FIXME: setting page to page-width");
            docViewer.viewer.currentScaleValue = 'page-width';
        }, 3000 );

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
