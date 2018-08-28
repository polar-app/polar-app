import {net, protocol} from 'electron';
import {CacheRegistry} from '../proxyserver/CacheRegistry';
import InterceptBufferProtocolRequest = Electron.InterceptBufferProtocolRequest;
import {Logger} from '../../logger/Logger';

const convertStream = require("convert-stream");

/** @type {Electron.Net} */

const log = Logger.create();


export class CacheInterceptorService {

    private readonly cacheRegistry: CacheRegistry;

    private readonly cacheStats = new CacheStats();

    /**
     *
     * @param cacheRegistry {CacheRegistry}
     */
    constructor(cacheRegistry: CacheRegistry) {

        this.cacheRegistry = cacheRegistry;

    }

    async handleWithCache(request: InterceptBufferProtocolRequest, callback: BufferCallback) {

        ++this.cacheStats.hits;

        log.debug("HIT Going to handle with cache: ", request.url);

        let cacheEntry = this.cacheRegistry.get(request.url);

        let buffer = await cacheEntry.toBuffer();

        log.debug(`Calling callback now for: ${request.url} (${buffer.byteLength} bytes)`);

        callback({
            mimeType: cacheEntry.mimeType,
            data: buffer,
        });

    }

    async handleWithNetRequest(request: Request, callback: BufferCallback) {

        log.debug("Handling request: ", request.url);

        ++this.cacheStats.misses;

        let options = {
            method: request.method,
            url: request.url,
        };

        log.debug("MISS Going to handle with net.request: " + request.url);

        let netRequest = net.request(options)
            .on('response', async (response) => {

                let buffer = await convertStream.toBuffer(response);

                // FIXME: we're currently handling charset encoding improperly and
                // stripping the encoding if it's specified in the charset.  This will be
                // resolved when we migrate to interceptStreamProtocol

                let contentType = CacheInterceptorService.parseContentType(response.headers["content-type"]);

                log.debug(`Using mimeType=${contentType.mimeType} for ${request.url}`)

                callback({
                    mimeType: contentType.mimeType,
                    data: buffer,
                });

            })
            .on('abort', () => {
                log.error(`Request aborted: ${request.url}`);
                callback(-1);
            })
            .on('error', (error) => {
                // TODO: we are getting: net::ERR_CONNECTION_REFUSED... I think
                // we could include this in the callback.
                log.error(`Request error: ${request.url}`, error);
                callback(-1);
            });

        Object.keys(request.headers).forEach(header => {
            // call setHeader for each header needed.
            log.debug("Setting request header: ", header);
            netRequest.setHeader(header, request.headers[header]);
        });

        if(request.uploadData) {

            log.debug("Writing data to request");
            request.uploadData.forEach(current => {
                netRequest.write(current.bytes);
            });

        }

        // TODO: we have to call netRequest.write on all the request.uploadData.
        // not urgent because this isn't really a use case we must support.

        netRequest.end();

    }

    async interceptRequest(request: Request, callback: BufferCallback) {

        log.debug(`intercepted ${request.method} ${request.url}`);

        if(this.cacheRegistry.hasEntry(request.url)) {
            await this.handleWithCache(request, callback);
        } else {
            await this.handleWithNetRequest(request, callback);
        }

    };

    async interceptBufferProtocol(scheme: string, handler: any) {

        return new Promise((resolve, reject) => {

            protocol.interceptBufferProtocol(scheme, handler, (error) => {

                if (error) {
                    reject(error);
                }

                resolve();

            });

        });

    }

    async start() {

        log.debug("Starting service and registering protocol interceptors.");

        await this.interceptBufferProtocol('http', this.interceptRequest.bind(this));
        await this.interceptBufferProtocol('https', this.interceptRequest.bind(this));

    }

    async stop() {

        // we have to call protocol.uninterceptProtocol()
        throw new Error("not implemented");

    }

    /**
     * Parse the content-type header and include information about the charset too.
     */
    static parseContentType(contentType: string | string[]) {

        // https://www.w3schools.com/html/html_charset.asp

        // html4 is ISO-8859-1 and HTML5 is UTF-8

        // https://stackoverflow.com/questions/8499930/how-to-identify-html5

        // text/html; charset=utf-8

        let mimeType = "text/html";

        let value: string;

        if(contentType instanceof Array) {
            // when given as response headers we're given an array of strings
            // since headers can have multiple values but there's no reason
            // contentType should have more than one.
            value = contentType[0];
        } else {
            value = contentType;
        }

        if(! value) {
            value = mimeType;
        }

        let charset;
        let match;

        if(match = value.match("^([a-zA-Z]+/[a-zA-Z+]+)")) {
            mimeType = match[1];
        }

        if(match = value.match("; charset=([^ ;]+)")) {
            charset = match[1];
        }

        return {
            mimeType,
            charset
        }

    }

}

class CacheStats {
    public hits = 0;
    public misses = 0;

}

interface BufferProtocolHandler {
    (request: InterceptBufferProtocolRequest, callback: BufferCallback): void;
}

interface BufferCallback {
    (buffer?: Buffer | CallbackData | number): void
}

interface CallbackData {
    mimeType: string,
    data: Buffer
}

// NOTE that Electron says that buffer protocols don't send headers but I think
// that's not correct.
interface Request {
    url: string;
    headers: {[name: string]: string};
    referrer: string;
    method: string;
    uploadData: Electron.UploadData[];
}

