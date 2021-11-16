const viewer = require('pdfjs-dist/web/pdf_viewer');

// FIXME: this is a class with a constructor
export interface IEventBus {

}
//
// EventBus,
// PDFPageView,
//     PDFPageViewOptions

export const EventBus: any = viewer.EventBus;
export const PDFPageView: any = viewer.PDFPageView;

export interface PDFPageViewOptions {

    container: HTMLDivElement;
    eventBus: any;
    id: number;
    scale: number;
    defaultViewport: any;
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
