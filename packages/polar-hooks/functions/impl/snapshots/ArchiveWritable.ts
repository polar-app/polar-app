/* tslint:disable:no-console */

import archiver from 'archiver';
import { Writable, WritableOptions} from 'stream'
import {ZipStreamChunk} from './ZipStreamChunk';

/** Creates an archive stream that can be used to zip up and write data to the given out stream.
 * @param output The output stream to write zipped data to.
 * @returns a writable object stream. The objects should be of type ZipStreamChunk
 */
export class ArchiveWritable extends Writable {
    archive = archiver('tar', {gzip: true, gzipOptions: {level: 6}});
    output: NodeJS.WritableStream;
    count = 0;
    lastLogTime = Date.now();

    constructor(output: NodeJS.WritableStream, options: Omit<WritableOptions, 'objectMode'> = {}) {
        super({...options, objectMode: true})
        this.archive.pipe(output)
        this.output = output

        console.log('ArchiveWritable.constructor()')

        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', () => {
            console.log(this.archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
        });

        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the NodeJS Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_end
        output.on('end', function () {
            console.log('Data has been drained');
        });

        // good practice to catch warnings (ie stat failures and other non-blocking errors)
        this.archive.on('warning', function (err) {
            console.error(err);
            if (err.code === 'ENOENT') {
                // log warning
            } else {
                // throw error
                throw err;
            }
        });

        // good practice to catch this error explicitly
        this.archive.on('error', function (err) {
            console.error(err);
            throw err;
        });
    }

    _write(chunk: ZipStreamChunk,
           _encoding: BufferEncoding,
           callback: (error?: Error | null) => void) {

        if (Date.now() - this.lastLogTime >= 60000) {
            console.log(`Zipped ${this.count} files and counting...`)
            this.lastLogTime = Date.now()
        }
        this.count++

        console.log('this.count', this.count);

        const entryCB = () => {
            cleanup()
            callback()
        }
        const errorCB = (error: Error) => {
            console.error(error);
            cleanup()
            callback(error)
        }
        const cleanup = () => {
            this.archive.removeListener('entry', entryCB)
            this.archive.removeListener('error', errorCB)
        }
        this.archive.once('entry', entryCB)
        this.archive.once('error', errorCB)
        console.log(this.count, chunk.data);
        this.archive.append(chunk.source, chunk.data)
    }

    _final(callback: (error?: Error | null) => void) {
        console.log(`Done zipping all ${this.count} files.`)
        const finishCB = () => {
            cleanup()
            callback()
        }
        const errorCB = (error: Error) => {
            cleanup()
            callback(error)
        }
        const cleanup = () => {
            this.archive.removeListener('finish', finishCB)
            this.archive.removeListener('error', errorCB)
        }
        this.output.once('finish', finishCB)
        this.output.once('error', errorCB)
        return this.archive.finalize()
    }
}
