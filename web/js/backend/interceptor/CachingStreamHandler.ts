import {BufferCallback, CacheStats} from './CacheInterceptorService';
import {Logger} from '../../logger/Logger';
import {CacheRegistry} from '../proxyserver/CacheRegistry';
import {CorrectStreamProtocolResponse, StreamInterceptors, StreamProtocolCallback} from './StreamInterceptors';
import InterceptStreamProtocolRequest = Electron.InterceptStreamProtocolRequest;

const log = Logger.create();

export class CachingStreamHandler {

    private readonly cacheStats = new CacheStats();

    private readonly cacheRegistry: CacheRegistry;

    constructor(cacheRegistry: CacheRegistry) {
        this.cacheRegistry = cacheRegistry;
    }

    public async intercept(request: InterceptStreamProtocolRequest, callback: StreamProtocolCallback) {

        log.debug(`intercepted ${request.method} ${request.url}`);

        if (this.cacheRegistry.hasEntry(request.url)) {
            await this.interceptWithCache(request, callback);
        } else {
            await StreamInterceptors.handleWithNetRequest(request, callback);
        }

    }

    public async interceptWithCache(request: InterceptStreamProtocolRequest, callback: StreamProtocolCallback) {

        log.debug("HIT Going to handle with cache: ", request.url);

        const cacheEntry = this.cacheRegistry.get(request.url);

        const stream = await cacheEntry.toStream();

        log.debug(`Calling callback now for: ${request.url}`);

        const streamProtocolResponse: CorrectStreamProtocolResponse = {
            headers: cacheEntry.headers,
            data: stream,
            statusCode: cacheEntry.statusCode
        };

        callback(streamProtocolResponse);

    }

}
