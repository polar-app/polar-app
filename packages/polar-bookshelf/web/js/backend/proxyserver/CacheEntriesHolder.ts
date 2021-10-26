/**
 * Holds the cached requests plus other metadata.
 */
import {CacheEntry} from './CacheEntry';

export class CacheEntriesHolder {

    public cacheEntries: {readonly [key: string]: CacheEntry} = {};

    public metadata: any = {};

    constructor(opts: any) {

        this.metadata = {};

        Object.assign(this, opts);
    }

}
