const viewer = require('pdfjs-dist/web/pdf_viewer');

export interface FindCommandState {
    query: string;
    phraseSearch: boolean;
    caseSensitive: boolean;
    highlightAll: boolean;
    findPrevious: boolean;
}

export namespace LinkTarget {

    export const NONE: LinkTarget;
    export const SELF: LinkTarget;
    export const BLANK: LinkTarget;
    export const PARENT: LinkTarget;
    export const TOP: LinkTarget;

}

export interface IPDFFindController {
    reset(): void;
    nextMatch(): void;
    executeCommand(cmd: string, state: FindCommandState): void;

}

interface PDFFindControllerOptions {
    pdfViewer: PDFViewer;
}

export interface PDFFindControllerConstructor {
    new(opts: PDFFindControllerOptions): IEventBus;
}

export interface IEventBus {
}

interface EventBusOpts {
    readonly dispatchToDOM?: boolean;
}

export interface EventBusConstructor {
    new(opts?: EventBusOpts): IEventBus;
}

export const EventBus: EventBusConstructor = viewer.EventBus;
export const PDFFindController: PDFFindControllerConstructor = viewer.PDFFindControllerConstructor;

export const PDFPageView: any = viewer.PDFPageView; // FIXME

export interface PDFPageViewOptions {

    container: HTMLDivElement;
    eventBus: any; // FIXME
    id: number;
    scale: number;
    defaultViewport: any; // FIXME
    // renderingQueue?: PDFRenderingQueue;
    textLayerMode: 'canvas' | number;
    renderInteractiveForms: boolean;
    renderer: 'svg' | 'canvas';
    // annotationLayerFactory?: IPDFAnnotationLayerFactory;
    // textLayerFactory?: IPDFTextLayerFactory;
    imageResourcesPath?: string;
    enableWebGL?: boolean;
    useOnlyCssZoom?: boolean;
    maxCanvasPixels?: number;

    // TODO not sure if this is needed or not.
    // l10n?: IL10n;

}
