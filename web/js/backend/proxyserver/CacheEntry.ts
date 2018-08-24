
// https://expressjs.com/en/4x/api.html#req
// https://expressjs.com/en/4x/api.html#res

export abstract class CacheEntry {

    public method = "GET";

    /**
     * The URL to request.
     */
    public url: string;

    /**
     * The request headers.
     *
     * @type {{}}
     */
    public headers = {};

    /**
     * The status code for this cache entry.
     */
    public statusCode = 200;

    /**
     * The status message.
     */
    public statusMessage = "OK";

    /**
     *
     * The content type of this content.  Default is text/html.  We use
     * extensions of the files based on the content type.
     *
     * @type {string}
     */
    public contentType = "text/html";

    public mimeType = "text/html";

    public encoding = "UTF-8";

    /**
     * The content length of the data, if known
     */
    public contentLength?: number;

    protected constructor(options: any) {

        this.method = "GET";

        this.url = options.url;

        Object.assign(this, options);

    }

    /**
     * Handle data for this request.  The callback is called as a function
     * with one 'data' parameter which is a buffer of data to write.
     *
     * The handleData should return false when there is no more data to handle.
     *
     */
    public abstract async handleData(callback: DataCallback): Promise<boolean>;

    /**
     */
    public abstract async toBuffer(): Promise<Buffer>;


}

export interface DataCallback {
    (data: Buffer): void
}
