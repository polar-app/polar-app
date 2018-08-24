import {CacheEntry, DataCallback} from './CacheEntry';

/**
 * Cache entry which is just buffered in memory.
 */
export class BufferedCacheEntry extends CacheEntry {

    public data: Buffer;

    constructor(opts: any) {
        super(opts);
        this.data = opts.data;
    }

    public async handleData(callback: DataCallback): Promise<boolean> {
        callback(this.data);
        return false;
    }

    public async toBuffer(): Promise<Buffer> {
        return this.data;
    }

}

