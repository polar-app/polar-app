import {Objects} from "polar-shared/src/util/Objects";

export abstract class CacheEntry implements ICacheEntry {

    public method: string;
    public url: string;
    public headers: {readonly [key: string]: string | readonly string[]} = {};
    public statusCode = 200;
    public statusMessage = "OK";
    public contentType = "text/html";
    public mimeType = "text/html";
    public encoding = "UTF-8";
    public contentLength?: number;
    public docTypeFormat?: DocTypeFormat;

    protected constructor(options: ICacheEntry) {

        this.method = "GET";

        this.url = options.url;

        Object.assign(this, options);

        // make sure we have defaults for everything.
        Objects.defaults(this, {
            method: "GET",
            headers: {},
            statusCode: 200,
            statusMessage: "OK",
            contentType: "text/html",
            mimeType: "text/html",
            encoding: "UTF-8",
        });

    }

    /**
     * Handle data for this request.  The callback is called as a function
     * with one 'data' parameter which is a buffer of data to write.
     *
     * The handleData should return false when there is no more data to handle.
     *
     */
    public abstract handleData(callback: DataCallback): Promise<boolean>;

    /**
     */
    public abstract toBuffer(): Promise<Buffer>;

    public abstract toStream(): Promise<NodeJS.ReadableStream>;

}

export interface DataCallback {
    // noinspection TsLint
    (data: Buffer): void;
}

export interface ICacheEntry {

    readonly method: string;

    /**
     * The URL to request.
     */
    readonly url: string;

    /**
     * The request headers.
     *
     */
    readonly headers: {readonly [key: string]: string | readonly string[]};

    /**
     * The status code for this cache entry.
     */
    readonly statusCode: number;

    /**
     * The status message.
     */
    readonly statusMessage: string;

    /**
     *
     * The content type of this content.  Default is text/html.  We use
     * extensions of the files based on the content type.
     *
     * @type {string}
     */
    readonly contentType: string;

    /**
     * The decoded mine type. The contentType can include an encoding so
     * contentType can be broken down into mimeType + encoding.
     *
     */
    readonly mimeType: string;

    readonly encoding: string;

    /**
     * The content length of the data, if known
     */
    readonly contentLength?: number;

    readonly docTypeFormat?: DocTypeFormat;

}

/**
 * Return the document format of the underlying document by determining if
 * it's XML or HTML
 */
export type DocTypeFormat = 'html' | 'xml';
