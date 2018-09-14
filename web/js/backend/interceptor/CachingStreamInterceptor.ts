import {Logger} from '../../logger/Logger';
import {CacheRegistry} from '../proxyserver/CacheRegistry';
import {CorrectStreamProtocolResponse, StreamInterceptors, StreamProtocolCallback} from './StreamInterceptors';
import InterceptStreamProtocolRequest = Electron.InterceptStreamProtocolRequest;
import {CacheStats} from './CacheStats';

const log = Logger.create();

export class CachingStreamInterceptor {

    private readonly cacheRegistry: CacheRegistry;
    private readonly cacheStats: CacheStats;

    constructor(cacheRegistry: CacheRegistry, cacheStats: CacheStats) {
        this.cacheRegistry = cacheRegistry;
        this.cacheStats = cacheStats;
    }

    public intercept(request: InterceptStreamProtocolRequest, callback: StreamProtocolCallback) {

        log.debug(`intercepted ${request.method} ${request.url}`);

        if (this.cacheRegistry.hasEntry(request.url)) {

            ++this.cacheStats.hits;

            this.interceptWithCache(request, callback)
                .catch(err => log.error("Unable to handle request: ", err));

        } else {
            ++this.cacheStats.misses;

            StreamInterceptors.handleWithNetRequest(request, callback);
        }

    }

    private async interceptWithCache(request: InterceptStreamProtocolRequest, callback: StreamProtocolCallback) {

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
