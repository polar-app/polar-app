const electron = require('electron');
const app = electron.app;
const protocol = electron.protocol;
const convertStream = require("convert-stream");

/** @type {Electron.Net} */
const net = electron.net;
const BrowserWindow = electron.BrowserWindow;

const log = require("../../logger/Logger").create();

class CacheInterceptorService {

    /**
     *
     * @param cacheRegistry {CacheRegistry}
     */
    constructor(cacheRegistry) {
        this.cacheRegistry = cacheRegistry;
    }

    async handleWithCache(request, callback) {
        log.debug("Going to handle with cache: ", options);

        let cacheEntry = this.cacheRegistry.get(request.url);

        callback({
            mimeType: cacheEntry.mimeType,
            data: buffer.toBuffer(),
        });

    }

    async handleWithNetRequest(request, callback) {

        let options = {
            method: request.method,
            url: request.url,
        };

        log.debug("Going to handle with net.request: ", options);

        let netRequest = net.request(options)
            .on('response', async (response) => {

                let buffer = await convertStream.toBuffer(response);

                // FIXME: we're currently handling charset encoding improperly and
                // stripping the encoding if it's specified in the charset.  This will be
                // resolved when we migrate to interceptStreamProtocol
                let contentType = CacheInterceptorService.parseContentType(headers["content-type"][0]);

                log.debug(`Using mimeType=${contentType.mimeType} for ${request.url}`)

                callback({
                    mimeType: contentType.mimeType,
                    data: buffer,
                });

            })
            .on('abort', () => {
                log.error("Request aborted: ");
                callback(-1);
            })
            .on('error', (error) => {
                log.error("Request error: ", error);
                callback(-1);
            });

        Object.keys(request.headers).forEach(header => {
            // call setHeader for each header needed.
            netRequest.setHeader(header, request.headers[header]);
        });

        // TODO: we have to call netRequest.write on all the request.uploadData.
        // not urgent because this isn't really a use case we must support.

        netRequest.end();

    }

    async interceptRequest(request, callback) {

        log.info(`intercepted ${request.method} ${request.url}`);

        if(this.cacheRegistry.hasEntry(request.url)) {
            await this.handleWithCache(request, callback);
        } else {
            await this.handleWithNetRequest(request, callback);
        }

    };

    async interceptBufferProtocol(scheme, func) {
        return new Promise((resolve, reject) => {

            protocol.interceptBufferProtocol(scheme, func, (error) => {

                if (error) {
                    reject(error);
                }

                resolve();

            });

        });
    }

    async start() {

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
    static parseContentType(contentType) {

        // https://www.w3schools.com/html/html_charset.asp

        // html4 is ISO-8859-1 and HTML5 is UTF-8

        // https://stackoverflow.com/questions/8499930/how-to-identify-html5

        // text/html; charset=utf-8

        let mimeType = "text/html";

        if(! contentType) {
            contentType = mimeType;
        }

        let charset;
        let match;

        if(match = contentType.match("^([a-zA-Z]+/[a-zA-Z+]+)")) {
            mimeType = match[1];
        }

        if(match = contentType.match("; charset=([^ ;]+)")) {
            charset = match[1];
        }

        return {
            mimeType,
            charset
        }

    }

}

module.exports.CacheInterceptor = CacheInterceptorService;
