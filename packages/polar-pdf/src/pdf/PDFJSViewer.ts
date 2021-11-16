const viewer = require('pdfjs-dist/web/pdf_viewer');

export type IPDFViewer = any;
export type IPDFLinkService = any;
export type IPDFRenderingQueue = any;

export type IPDFViewerOptions = any;
export type Outline = any;
export type Destination = any;

export interface FindCommandState {
    query: string;
    phraseSearch: boolean;
    caseSensitive: boolean;
    highlightAll: boolean;
    findPrevious: boolean;
}

export interface IPDFFindController {
    reset(): void;
    nextMatch(): void;
    executeCommand(cmd: string, state: FindCommandState): void;

}

interface PDFFindControllerOptions {
    pdfViewer?: any;
    linkService: any;
    eventBus: any;
}

export interface PDFFindControllerConstructor {
    new(opts: PDFFindControllerOptions): IPDFFindController;
}

export interface IEventBus {
    on(eventName: string, listener: (...args: any[]) => void): void;
    off(eventName: string, listener: (...args: any[]) => void): void;
    dispatch(eventName: string, ...args: any[]): void;
}

interface EventBusOpts {
    readonly dispatchToDOM?: boolean;
}

export interface EventBusConstructor {
    new(opts?: EventBusOpts): IEventBus;
}

export const EventBus: any = viewer.EventBus;
export const PDFFindController: PDFFindControllerConstructor = viewer.PDFFindControllerConstructor;

export const PDFPageView: any = viewer.PDFPageView; // FIXME
export const PDFViewer: any = viewer.PDFViewer; // FIXME
export const PDFLinkService: any = viewer.PDFLinkService; // FIXME
export const PDFRenderingQueue: any = viewer.PDFRenderingQueue; // FIXME

export const LinkTarget: any = viewer.LinkTarget; // FIXME

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
