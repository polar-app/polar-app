/**
 * A cache entry backed by a phz file.
 */
import {CacheEntry, DataCallback} from "./CacheEntry";
import {PHZReader} from '../../phz/PHZReader';
import {Preconditions} from '../../Preconditions';
import {ResourceEntry} from '../../phz/ResourceEntry';

export class PHZCacheEntry extends CacheEntry {

    public phzReader: PHZReader;

    public resourceEntry: ResourceEntry;

    constructor(opts: any) {

        super(opts);

        this.phzReader = opts.phzReader;
        this.resourceEntry = opts.resourceEntry;

        Object.assign(this, opts);

        Preconditions.assertNotNull(this.phzReader, "phzReader");
        Preconditions.assertNotNull(this.resourceEntry, "resourceEntry");

        Object.defineProperty(this, 'phzReader', {
            value: this.phzReader,
            enumerable: false
        });

    }

    public async handleData(callback: DataCallback): Promise<boolean> {

        const buffer = await this.phzReader.getResource(this.resourceEntry);
        callback(buffer);
        return false;

    }

    public async toBuffer(): Promise<Buffer> {
        return await this.phzReader.getResource(this.resourceEntry);
    }

    public async toStream(): Promise<NodeJS.ReadableStream> {
        return await this.phzReader.getResourceAsStream(this.resourceEntry);
    }

}



