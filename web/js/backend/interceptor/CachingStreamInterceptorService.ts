import {CacheRegistry} from '../proxyserver/CacheRegistry';
import {Logger} from '../../logger/Logger';
import {CachingStreamInterceptor} from './CachingStreamInterceptor';
import {Protocols} from './Protocols';
import {StreamInterceptors} from './StreamInterceptors';
import {CacheStats} from './CacheStats';

const log = Logger.create();

export class CachingStreamInterceptorService {

    public readonly cacheStats = new CacheStats();

    private readonly cacheRegistry: CacheRegistry;

    private cachingStreamInterceptor: CachingStreamInterceptor;

    constructor(cacheRegistry: CacheRegistry) {
        this.cacheRegistry = cacheRegistry;
        this.cachingStreamInterceptor = new CachingStreamInterceptor(cacheRegistry, this.cacheStats);
    }

    public async start() {

        log.debug("Starting service and registering protocol interceptors.");

        for (const scheme of ['http', 'https']) {

            await Protocols.interceptStreamProtocol(scheme, (request, callback) => {

                StreamInterceptors.withSetTimeout(() => {
                    this.cachingStreamInterceptor.intercept(request, callback);
                });

            });

        }

    }

    public async stop() {
        throw new Error("not implemented");
    }

}
