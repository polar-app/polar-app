import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {URLStr} from "polar-shared/src/util/Strings";
import PDFJS from 'pdfjs-dist';
import {Numbers} from "polar-shared/src/util/Numbers";

console.log("Running with pdf.js version: " + PDFJS.version);

// TODO: I'm not sure this is the safest way to find the worker path.
PDFJS.GlobalWorkerOptions.workerSrc = '../../../node_modules/pdfjs-dist/build/pdf.worker.js';

const log = Logger.create();

export class PDFViewer extends React.Component<IProps, IState> {

    // https://mozilla.github.io/pdf.js/examples/
    constructor(props: IProps, context: any) {
        super(props, context);

        this.doRender = this.doRender.bind(this);

        this.state = {

        };

        this.doRender().catch(err => log.error(err));

    }

    private async doRender() {

        // TODO: determine the primary page that the user is viewing and only render N +- 10 pages
        //
        // TODO: use the same CSS elements and classes
        //
        // TODO: sidebar
        //
        // TODO: zoom in / out and page width , page height.

        // TODO: search UI to search within the document

        // TODO: center + change page height when the browser reloads


        const loadingTask = PDFJS.getDocument('../../../docs/examples/pdf/bigtable.pdf');

        const pdf = await loadingTask.promise;

        const page = await pdf.getPage(1);

        var scale = 1;
        var viewport = page.getViewport({ scale: scale});

        const canvas = document.querySelector('#pdf canvas') as HTMLCanvasElement | null;

        if (! canvas) {
            throw new Error("No canvas");
        }

        const context = canvas.getContext('2d')!;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        page.render(renderContext);

    }

    public render() {


        const RenderPages = () => {

            const nrPages = this.state.nrPages || 1;
            const range = Numbers.range(1, nrPages);

            return <div>
                {range.map(page =>
                    <div className="page" data-page-num={page} key={page}>
                        <canvas/>
                    </div>)}
            </div>

        };

        return (

            <div id="pdf">
                <RenderPages/>
            </div>

        );

    }

}

export interface IProps {
    readonly src: URLStr;
}

interface IState {
    readonly nrPages?: number;
}

