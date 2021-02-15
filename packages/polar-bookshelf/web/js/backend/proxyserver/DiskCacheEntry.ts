import {CacheEntry, DataCallback} from './CacheEntry';

import fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;

/**
 * Cache entry which is just buffered in memory.
 */
export class DiskCacheEntry extends CacheEntry {

    /**
     * The data we should serve.
     */
    public path: string;

    constructor(options: any) {

        super(options);

        this.path = options.path;

        if (this.path === undefined) {
            throw new Error("No path");
        }

    }

    public async handleData(callback: DataCallback) {

        return new Promise<boolean>((resolve, reject) => {

            // TODO: in the future migrate to a stream

            fs.readFile(this.path, (err: NodeJS.ErrnoException | null, data: Buffer) => {

                if (err) {
                    reject(err);
                }

                callback(data);
                resolve(false);

            });

        });

    }

    public async toBuffer(): Promise<Buffer> {

        // TODO: in the future migrate to a stream

        return new Promise<Buffer>((resolve, reject) => {

           fs.readFile(this.path, (err: ErrnoException | null, data: Buffer) => {

                if (err) {
                    reject(err);
                }

                resolve(data);

            });

        });

    }

    public async toStream(): Promise<NodeJS.ReadableStream> {
        return fs.createReadStream(this.path);
    }

}
