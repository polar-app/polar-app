"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const Logger_1 = require("../../logger/Logger");
const convertStream = require("convert-stream");
const log = Logger_1.Logger.create();
class CacheInterceptorService {
    constructor(cacheRegistry) {
        this.cacheStats = new CacheStats();
        this.cacheRegistry = cacheRegistry;
    }
    handleWithCache(request, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            ++this.cacheStats.hits;
            log.info("HIT Going to handle with cache: ", request.url);
            let cacheEntry = this.cacheRegistry.get(request.url);
            let buffer = yield cacheEntry.toBuffer();
            log.info(`Calling callback now for: ${request.url} (${buffer.byteLength} bytes)`);
            callback({
                mimeType: cacheEntry.mimeType,
                data: buffer,
            });
        });
    }
    handleWithNetRequest(request, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info("Handling request: ", request.url);
            ++this.cacheStats.misses;
            let options = {
                method: request.method,
                url: request.url,
            };
            log.info("MISS Going to handle with net.request: " + request.url);
            let netRequest = electron_1.net.request(options)
                .on('response', (response) => __awaiter(this, void 0, void 0, function* () {
                let buffer = yield convertStream.toBuffer(response);
                let contentType = CacheInterceptorService.parseContentType(response.headers["content-type"]);
                log.debug(`Using mimeType=${contentType.mimeType} for ${request.url}`);
                callback({
                    mimeType: contentType.mimeType,
                    data: buffer,
                });
            }))
                .on('abort', () => {
                log.error(`Request aborted: ${request.url}`);
                callback(-1);
            })
                .on('error', (error) => {
                log.error(`Request error: ${request.url}`, error);
                callback(-1);
            });
            Object.keys(request.headers).forEach(header => {
                log.info("Setting request header: ", header);
                netRequest.setHeader(header, request.headers[header]);
            });
            if (request.uploadData) {
                log.info("Writing data to request");
                request.uploadData.forEach(current => {
                    netRequest.write(current.bytes);
                });
            }
            netRequest.end();
        });
    }
    interceptRequest(request, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info(`intercepted ${request.method} ${request.url}`);
            if (this.cacheRegistry.hasEntry(request.url)) {
                yield this.handleWithCache(request, callback);
            }
            else {
                yield this.handleWithNetRequest(request, callback);
            }
        });
    }
    ;
    interceptBufferProtocol(scheme, handler) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                electron_1.protocol.interceptBufferProtocol(scheme, handler, (error) => {
                    if (error) {
                        reject(error);
                    }
                    resolve();
                });
            });
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            log.info("Starting service and registering protocol interceptors.");
            yield this.interceptBufferProtocol('http', this.interceptRequest.bind(this));
            yield this.interceptBufferProtocol('https', this.interceptRequest.bind(this));
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("not implemented");
        });
    }
    static parseContentType(contentType) {
        let mimeType = "text/html";
        let value;
        if (contentType instanceof Array) {
            value = contentType[0];
        }
        else {
            value = contentType;
        }
        if (!value) {
            value = mimeType;
        }
        let charset;
        let match;
        if (match = value.match("^([a-zA-Z]+/[a-zA-Z+]+)")) {
            mimeType = match[1];
        }
        if (match = value.match("; charset=([^ ;]+)")) {
            charset = match[1];
        }
        return {
            mimeType,
            charset
        };
    }
}
exports.CacheInterceptorService = CacheInterceptorService;
class CacheStats {
    constructor() {
        this.hits = 0;
        this.misses = 0;
    }
}
//# sourceMappingURL=CacheInterceptorService.js.map