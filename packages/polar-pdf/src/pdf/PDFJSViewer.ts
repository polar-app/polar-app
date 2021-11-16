/* eslint-disable functional/prefer-readonly-type */

import {ILinkTarget, IPageViewport, IPDFDocumentProxy, IPDFPageProxy} from "./PDFJS";
import {Preconditions} from "polar-shared/src/Preconditions";

const viewer = require('pdfjs-dist/web/pdf_viewer');


export interface Destination {

}

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
    pdfViewer?: IPDFViewer;
    linkService: IPDFLinkService;
    eventBus: IEventBus;
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
    eventBus: IEventBus;
    id: number;
    scale: number;
    defaultViewport: IPageViewport;
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

export interface IPDFViewer {

    /**
     * @param {number} val - Scale of the pages in percents.
     */
    currentScale: number;

    /**
     * @param val - The scale of the pages (in percent or predefined value).
     */
    currentScaleValue: string;

    /**
     * @param {number} val - The page number.
     */
    currentPageNumber: number;

    setDocument(pdfDocument: IPDFDocumentProxy): void;

    cleanup(): void;

}

export interface IPDFViewerOptions {

}

export interface IPDFViewerConstructor {
    new(opts: IPDFViewerOptions): IPDFViewer;
}

export interface IPDFLinkService {
    goToDestination(dest: Destination): void;
    setDocument(doc: IPDFDocumentProxy, baseURL: string | null): void;
    setViewer(pdfViewer: IPDFViewer): void;
}

export interface IPDFLinkServiceOptions {
    eventBus?: IEventBus;
    externalLinkTarget?: ILinkTarget;
    externalLinkRel?: string;
}

export interface IPDFLinkServiceConstructor {
    new(options: IPDFLinkServiceOptions): IPDFLinkService;
}

export interface IPDFRenderingQueue {
    setViewer(pdfViewer: IPDFViewer): void;
}

export interface IPDFRenderingQueueConstructor {
    new(): IPDFRenderingQueue;
}

export const PDFFindController: PDFFindControllerConstructor = Preconditions.assertPresent(viewer.PDFFindController);
export const EventBus: EventBusConstructor = Preconditions.assertPresent(viewer.EventBus);
export const PDFPageView: IPDFPageViewConstructor = Preconditions.assertPresent(viewer.PDFPageView);
export const PDFViewer: IPDFViewerConstructor = Preconditions.assertPresent(viewer.PDFViewer);
export const PDFLinkService: IPDFLinkServiceConstructor = Preconditions.assertPresent(viewer.PDFLinkService);
export const PDFRenderingQueue: IPDFRenderingQueueConstructor = Preconditions.assertPresent(viewer.PDFRenderingQueue);

