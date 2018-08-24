/**
 * Holds the cached requests plus other metadata.
 */
import {CachedRequest} from './CachedRequest';

export class CachedRequestsHolder {

    public metadata = {};

    public cachedRequests: {[key: string]: CachedRequest} = {};

    constructor(opts: any) {

        Object.assign(this, opts);

    }

}
