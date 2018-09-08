
import JSZip from 'jszip';
import {Resources} from './Resources';
import {ResourceEntry} from './ResourceEntry';
import {Files} from '../util/Files';

export class PHZReader {

    public path: string;

    public zip?: JSZip;

    public metadata: any = {};

    public resources: Resources = new Resources();

    private cache: {[key: string]: string} = {};

    constructor(path: string) {
        this.path = path;
    }

    /**
     * Init must be called to load the entries which we can work with.
     *
     */
    public async init() {

        // FIXME: migrate this to fs.createReadStream even though this is async it reads all
        // the data into memory. Make sure this method is completely async though.
        const data = await Files.readFileAsync(this.path);

        this.zip = new JSZip();

        await this.zip.loadAsync(data);

    }

    public async getMetadata(): Promise<any | null> {

        try {
            return await this.getCached("metadata.json", "metadata");
        } catch (e) {
            return Promise.resolve(null);
        }

    }

    /**
     * Get just the resources from the metadata.
     */
    public async getResources(): Promise<Resources> {

        try {
            return await this.getCached("resources.json", "resources");
        } catch (e) {
            return Promise.resolve(new Resources());
        }

    }

    public async getCached(path: string, key: string): Promise<any> {

        let cached = this.cache[key];
        if (cached !== undefined && cached !== null) {
            // return the cache version if it's already read properly.
            return cached;
        }

        const buffer = await this._readAsBuffer(path);

        if (! buffer) {
            throw new Error("No buffer for path: " + path);
        }

        cached = JSON.parse(buffer.toString("UTF-8"));

        this.cache[key] = cached;

        return cached;

    }

    /**
     * Return a raw buffer with no encoding.
     *
     * @param path
     * @return {Promise<Buffer>}
     * @private
     */
    public async _readAsBuffer(path: string): Promise<Buffer> {

        if (this.zip === undefined) {
            throw new Error("No zip.");
        }

        const zipFile = await this.zip.file(path);

        if (!zipFile) {
            throw new CachingException("No zip entry for path: " + path);
        }

        const arrayBuffer = await zipFile.async('arraybuffer');
        return Buffer.from(arrayBuffer);

    }

    /**
     * Read a resource from disk and call the callback with the new content once
     * it's ready for usage.
     *
     */
    public async getResource(resourceEntry: ResourceEntry): Promise<Buffer> {

        // FIXME: I think we can call nodeStream to get this in chunks for less
        // UI latency.  We should probably move in that directly.

        return await this._readAsBuffer(resourceEntry.path);
    }

    public async close() {
        // we just have to let it GC
        this.zip = undefined;
    }

}

export class CachingException extends Error {

    public constructor(message: string) {
        super(message);
    }

}
