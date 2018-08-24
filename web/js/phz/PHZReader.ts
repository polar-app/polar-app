
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
     * @return {Promise<void>}
     */
    async init() {

        // FIXME: migrate this to fs.createReadStream even though this is async it reads all
        // the data into memory. Make sure this method is completely async though.
        let data = await Files.readFileAsync(this.path);

        this.zip = new JSZip();

        await this.zip.loadAsync(data);

    }

    /**
     */
    async getMetadata(): Promise<any> {
        return await this.getCached("metadata.json", "metadata");
    }

    /**
     * Get just the resources from the metadata.
     */
    async getResources(): Promise<Resources> {
        return await this.getCached("resources.json", "resources");
    }

    async getCached(path: string, key: string): Promise<any> {

        let cached = this.cache[key];
        if(cached !== undefined && cached !== null) {
            // return the cache version if it's already read properly.
            return cached;
        }

        let buffer = await this._readAsBuffer(path);

        if(! buffer)
            throw new Error("No buffer for path: " + path);

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
    async _readAsBuffer(path: string): Promise<Buffer> {

        if(this.zip === undefined)
            throw new Error("No zip.");

        let zipFile = await this.zip.file(path);

        if(!zipFile) {
            throw new Error("No zip entry for path: " + path);
        }

        let arrayBuffer = await zipFile.async('arraybuffer');
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

    async close() {
        // we just have to let it GC
        this.zip = undefined;
    }

}
