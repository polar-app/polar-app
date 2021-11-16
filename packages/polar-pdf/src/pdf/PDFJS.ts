
const _PDFJS = require('pdfjs-dist');

export namespace IPDFJS {

    /**
     * Document initialization / loading parameters object.
     *
     * @typedef {Object} DocumentInitParameters
     * @property {string}     url   - The URL of the PDF.
     * @property {TypedArray|Array|string} data - Binary PDF data. Use typed arrays
     *   (Uint8Array) to improve the memory usage. If PDF data is BASE64-encoded,
     *   use atob() to convert it to a binary string first.
     * @property {Object}     httpHeaders - Basic authentication headers.
     * @property {boolean}    withCredentials - Indicates whether or not cross-site
     *   Access-Control requests should be made using credentials such as cookies
     *   or authorization headers. The default is false.
     * @property {string}     password - For decrypting password-protected PDFs.
     * @property {TypedArray} initialData - A typed array with the first portion or
     *   all of the pdf data. Used by the extension since some data is already
     *   loaded before the switch to range requests.
     * @property {number}     length - The PDF file length. It's used for progress
     *   reports and range requests operations.
     * @property {PDFDataRangeTransport} range
     * @property {number}     rangeChunkSize - Optional parameter to specify
     *   maximum number of bytes fetched per range request. The default value is
     *   2^16 = 65536.
     * @property {PDFWorker}  worker - The worker that will be used for the loading
     *   and parsing of the PDF data.
     * @property {boolean} postMessageTransfers - (optional) Enables transfer usage
     *   in postMessage for ArrayBuffers. The default value is `true`.
     * @property {number} verbosity - (optional) Controls the logging level; the
     *   constants from {VerbosityLevel} should be used.
     * @property {string} docBaseUrl - (optional) The base URL of the document,
     *   used when attempting to recover valid absolute URLs for annotations, and
     *   outline items, that (incorrectly) only specify relative URLs.
     * @property {string} nativeImageDecoderSupport - (optional) Strategy for
     *   decoding certain (simple) JPEG images in the browser. This is useful for
     *   environments without DOM image and canvas support, such as e.g. Node.js.
     *   Valid values are 'decode', 'display' or 'none'; where 'decode' is intended
     *   for browsers with full image/canvas support, 'display' for environments
     *   with limited image support through stubs (useful for SVG conversion),
     *   and 'none' where JPEG images will be decoded entirely by PDF.js.
     *   The default value is 'decode'.
     * @property {string} cMapUrl - (optional) The URL where the predefined
     *   Adobe CMaps are located. Include trailing slash.
     * @property {boolean} cMapPacked - (optional) Specifies if the Adobe CMaps are
     *   binary packed.
     * @property {Object} CMapReaderFactory - (optional) The factory that will be
     *   used when reading built-in CMap files. Providing a custom factory is useful
     *   for environments without `XMLHttpRequest` support, such as e.g. Node.js.
     *   The default value is {DOMCMapReaderFactory}.
     * @property {boolean} stopAtErrors - (optional) Reject certain promises, e.g.
     *   `getOperatorList`, `getTextContent`, and `RenderTask`, when the associated
     *   PDF data cannot be successfully parsed, instead of attempting to recover
     *   whatever possible of the data. The default value is `false`.
     * @property {number} maxImageSize - (optional) The maximum allowed image size
     *   in total pixels, i.e. width * height. Images above this value will not be
     *   rendered. Use -1 for no limit, which is also the default value.
     * @property {boolean} isEvalSupported - (optional) Determines if we can eval
     *   strings as JS. Primarily used to improve performance of font rendering,
     *   and when parsing PDF functions. The default value is `true`.
     * @property {boolean} disableFontFace - (optional) By default fonts are
     *   converted to OpenType fonts and loaded via font face rules. If disabled,
     *   fonts will be rendered using a built-in font renderer that constructs the
     *   glyphs with primitive path commands. The default value is `false`.
     * @property {boolean} disableRange - (optional) Disable range request loading
     *   of PDF files. When enabled, and if the server supports partial content
     *   requests, then the PDF will be fetched in chunks.
     *   The default value is `false`.
     * @property {boolean} disableStream - (optional) Disable streaming of PDF file
     *   data. By default PDF.js attempts to load PDFs in chunks.
     *   The default value is `false`.
     * @property {boolean} disableAutoFetch - (optional) Disable pre-fetching of PDF
     *   file data. When range requests are enabled PDF.js will automatically keep
     *   fetching more data even if it isn't needed to display the current page.
     *   The default value is `false`.
     *   NOTE: It is also necessary to disable streaming, see above,
     *         in order for disabling of pre-fetching to work correctly.
     * @property {boolean} disableCreateObjectURL - (optional) Disable the use of
     *   `URL.createObjectURL`, for compatibility with older browsers.
     *   The default value is `false`.
     * @property {boolean} pdfBug - (optional) Enables special hooks for debugging
     *   PDF.js (see `web/debugger.js`). The default value is `false`.
     */


}

// export const DocumentInitParameters: IPDFJS.DocumentInitParameters = _PDFJS.DocumentInitParameters;

export interface DocumentInitParameters {
    url?: string;
    data?: Uint8Array | ArrayLike<number> | ArrayBufferLike | string;
    headers?: Headers;
    withCredentials?: boolean;
    password?: string;
    initialData?: Uint8Array;
    length?: number;
    // range?: PDFDataRangeTransport;
    rangeChunkSize?: number;
    // worker?: PDFWorker;
    postMessageTransfers?: boolean;
    // verbosity?: VerbosityLevel;
    docBaseUrl?: string;
    // nativeImageDecoderSupport?: NativeImageDecoding;
    cMapUrl?: string;
    cMapPacked?: boolean;
    // CMapReaderFactory?: CMapReaderFactory;
    stopAtErrors?: boolean;
    maxImageSize?: number;
    isEvalSupported?: boolean;
    disableFontFace?: boolean;
    disableRange?: boolean;
    disableStream?: boolean;
    disableAutoFetch?: boolean;
    disableCreateObjectURL?: boolean;
    pdfBug?: boolean;
}


/**
 * Proxy to a PDFDocument in the worker thread. Also, contains commonly used
 * properties that can be read synchronously.
 * @class
 * @alias PDFDocumentProxy
 */
interface PDFDocumentProxy {
    loadingTask: PDFDocumentLoadingTask;
    pdfInfo: {
        encrypted?: boolean;
        fingerprint: string;
        numPages: number;
    };

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
     * @return {Promise} A promise that is resolved with a {@link PDFPageProxy}
     * object.
     */
    getPage(pageNumber: number): Promise<PDFPageProxy>;

    /**
     * @param {{num: number, gen: number}} ref The page reference. Must have
     *   the 'num' and 'gen' properties.
     * @return {Promise} A promise that is resolved with the page index that is
     * associated with the reference.
     */
    getPageIndex(ref: Ref): Promise<PageIndex>;

    /**
     * @return {Promise} A promise that is resolved with a lookup table for
     * mapping named destinations to reference numbers.
     *
     * This can be slow for large documents: use getDestination instead
     */
    getDestinations(): Promise<Destination>;

    /**
     * @param {string} id The named destination to get.
     * @return {Promise} A promise that is resolved with all information
     * of the given named destination.
     */
    getDestination(id: string): Promise<DestinationTarget | null>;

    /**
     * @return {Promise} A promise that is resolved with:
     *   an Array containing the pageLabels that correspond to the pageIndexes,
     *   or `null` when no pageLabels are present in the PDF file.
     */
    getPageLabels(): Promise<PageLabels[] | null>;

    /**
     * @return {Promise} A promise that is resolved with a {string} containing
     *   the PageMode name.
     */
    getPageMode(): Promise<string>;

    /**
     * @return {Promise} A promise that is resolved with a lookup table for
     * mapping named attachments to their content.
     */
    getAttachments(): Promise<Attachments | null>;

    /**
     * @return {Promise} A promise that is resolved with an {Array} of all the
     * JavaScript strings in the name tree, or `null` if no JavaScript exists.
     */
    getJavaScript(): Promise<string[] | null>;

    /**
     * @return {Promise} A promise that is resolved with an {Array} that is a
     * tree outline (if it has one) of the PDF. The tree is in the format of:
     * [
     *  {
     *   title: string,
     *   bold: boolean,
     *   italic: boolean,
     *   color: rgb Uint8Array,
     *   dest: dest obj,
     *   url: string,
     *   items: array of more items like this
     *  },
     *  ...
     * ].
     */
    getOutline(): Promise<Outline[] | null>;

    /**
     * @return {Promise} A promise that is resolved with an {Object} that has
     * info and metadata properties.  Info is an {Object} filled with anything
     * available in the information dictionary and similarly metadata is a
     * {Metadata} object with information from the metadata section of the PDF.
     */
    getMetadata(): Promise<MetadataProxy>;

    /**
     * @return {Promise} A promise that is resolved with a TypedArray that has
     * the raw data from the PDF.
     */
    getData(): Promise<Uint8Array>;

    /**
     * @return {Promise} A promise that is resolved when the document's data
     * is loaded. It is resolved with an {Object} that contains the length
     * property that indicates size of the PDF data in bytes.
     */
    getDownloadInfo(): Promise<DownloadInfo>;

    /**
     * @return {Promise} A promise this is resolved with current stats about
     * document structures (see {@link PDFDocumentStats}).
     */
    getStats(): Promise<PDFDocumentStats>;

    /**
     * Cleans up resources allocated by the document, e.g. created @font-face.
     */
    cleanup(): void;

    /**
     * Destroys current document instance and terminates worker.
     */
    destroy(): Promise<void>;
}


interface PDFDocumentLoadingTask {
    /**
     * Unique document loading task id -- used in MessageHandlers.
     * @type {string}
     */
    docId: string;

    /**
     * Shows if loading task is destroyed.
     * @type {boolean}
     */
    destroyed: boolean;

    // /**
    //  * Callback to request a password if wrong or no password was provided.
    //  * The callback receives two parameters: function that needs to be called
    //  * with new password and reason (see {PasswordResponses}).
    //  */
    // onPassword: passwordCallback | null;

    // /**
    //  * Callback to be able to monitor the loading progress of the PDF file
    //  * (necessary to implement e.g. a loading bar). The callback receives
    //  * an {Object} with the properties: {number} loaded and {number} total.
    //  */
    // onProgress: documentLoadingProgressCallback | null;

    // /**
    //  * Callback to when unsupported feature is used. The callback receives
    //  * an {UNSUPPORTED_FEATURES} argument.
    //  */
    // onUnsupportedFeature: unsupportedFeatureCallback | null;

    // /**
    //  * @type {Promise<PDFDocumentProxy>}
    //  */
    // promise: Promise<PDFDocumentProxy>;

    /**
     * Aborts all network requests and destroys worker.
     * @return {Promise} A promise that is resolved after destruction activity
     *                   is completed.
     */
    destroy(): Promise<void>;

    /**
     * Registers callbacks to indicate the document loading completion.
     *
     * @param {function} onFulfilled The callback for the loading completion.
     * @param {function} onRejected The callback for the loading failure.
     * @return {Promise} A promise that is resolved after the onFulfilled or
     *                   onRejected callback.
     */
    then<R1, R2>(
        onFulfilled?: (value?: PDFDocumentProxy) => R1 | PromiseLike<R1>,
        onRejected?: (reason?: Error) => R2 | PromiseLike<R2>
    ): Promise<R1 | R2>;
}
