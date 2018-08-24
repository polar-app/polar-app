/**
 * Metadata about an object registered in the cache.
 */
import {CachedRequest} from './CachedRequest';

export class CacheMeta {

    public url: string;
    public requestConfig: CachedRequest;

    /**
     */
    constructor(url: string, requestConfig: CachedRequest) {
        this.url = url;
        this.requestConfig = requestConfig;
    }

}
