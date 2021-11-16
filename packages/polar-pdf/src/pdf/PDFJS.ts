import {Preconditions} from "polar-shared/src/Preconditions";

const _PDFSJ = require('pdfjs-dist');

export type Transform = number[];

export type TextDirection = "ttb" | "ltr" | "rtl";

export interface ITextItem {
    str: string;
    dir: TextDirection;
    transform: Transform;
    width: number;
    height: number;
    fontName: string;
}

export interface ITextContent {
    items: ITextItem[];
}

export interface IDocumentInitParameters {

}

export interface IPageViewport {
    readonly width: number;
    readonly height: number;
    transform: Transform;
}

interface IGetTextContentParameters {
    normalizeWhitespace?: boolean;
    disableCombineTextItems?: boolean;
}

export interface IPDFPageProxy {

    getViewport(args: {
        scale: number;
        rotate?: number;
        dontFlip?: boolean;
    }): IPageViewport;

    getTextContent(params?: IGetTextContentParameters): Promise<ITextContent>;

}

export interface IMetadata {
    get(name: string): string | null;
}

export interface IMetadataProxy {

    metadata: IMetadata | null;

}

interface Name {
    name: string;
}

export interface Outline {

    title: string;
    bold: boolean;
    italic: boolean;
    dest: Array<Name | string | any[]> | null;
    unsafeUrl?: string;
    url: string | null;
    items: Outline[];

}

export interface IPDFDocumentProxy {

    /**
     * @return {number} Total number of pages the PDF contains.
     */
    numPages: number;

    /**
     * @return {string} A unique ID to identify a PDF. Not guaranteed to be
     * unique.
     */
    fingerprint: string;

    /**
     * @param {number} pageNumber The page number to get. The first page is 1.
     * @return {Promise} A promise that is resolved with a {@link IPDFPageProxy}
     * object.
     */
    getPage(pageNumber: number): Promise<IPDFPageProxy>;

    getMetadata(): Promise<IMetadataProxy>;

    getOutline(): Promise<Outline[] | null>;

}

export interface IDocumentLoadingProgress {
    loaded: number;
    total: number;
}

export type DocumentLoadingProgressCallback = (
    documentLoadingProgress: IDocumentLoadingProgress
) => void;

export interface IPDFDocumentLoadingTask {
    readonly promise: Promise<IPDFDocumentProxy>;

    destroy(): Promise<void>;
    onProgress: DocumentLoadingProgressCallback | null;

}


export interface IGlobalWorkerOptions {
    workerSrc: string;
}

export interface IUtil {

    transform(m1: Transform, m2: Transform): Transform;

}

export interface IPDFJS {

    readonly version: string;
    readonly GlobalWorkerOptions: IGlobalWorkerOptions;

    getDocument(src: string | Uint8Array | IDocumentInitParameters /* | PDFDataRangeTransport */): IPDFDocumentLoadingTask;

}

export interface ILinkTarget {
    readonly BLANK: any;
}

export const Util: IUtil = Preconditions.assertPresent(_PDFSJ.Util);
export const PDFJS: IPDFJS = Preconditions.assertPresent(_PDFSJ);

export const LinkTarget: ILinkTarget = Preconditions.assertPresent(_PDFSJ.LinkTarget);
