import {IPDFPageProxy} from "./PDFJS";

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


export interface IPDFPageView {

    width: number;
    height: number;

    setPdfPage(pdfPage: IPDFPageProxy): void;

    destroy(): void;
    draw(): Promise<void>;

}

export interface IPDFPageViewOptions {

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

export interface IPDFPageViewConstructor {
    new(opts: IPDFPageViewOptions): IPDFPageView;
}

// TODO: this is the proper way to define a class type so that it behaves like an interface.
export const PDFFindController: PDFFindControllerConstructor = viewer.PDFFindController;
export const EventBus: EventBusConstructor = viewer.EventBus;


// TODO: these are using any types and not proper constructor types.
export const PDFPageView: IPDFPageViewConstructor = viewer.PDFPageView; // FIXME
export const PDFViewer: any = viewer.PDFViewer; // FIXME
export const PDFLinkService: any = viewer.PDFLinkService; // FIXME
export const PDFRenderingQueue: any = viewer.PDFRenderingQueue; // FIXME

