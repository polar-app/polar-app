/* tslint:disable:no-console */

import archiver from 'archiver';
import { Readable, Writable, WritableOptions } from 'stream'
import { ZipStreamChunk } from './ZipStreamChunk';

/** Creates an archive stream that can be used to zip up and write data to the given out stream.
 * @param output The output stream to write zipped data to.
 * @returns a writable object stream. The objects should be of type ZipStreamChunk
 */
export class ArchiveWritable extends Writable {
    archive = archiver('zip', { zlib: { level: 9 } })
    output: NodeJS.WritableStream
    count = 0
    lastLogTime = Date.now()
    constructor(output: NodeJS.WritableStream, options: Omit<WritableOptions, 'objectMode'> = {}) {
        super({ ...options, objectMode: true })
        this.archive.pipe(output)
        this.output = output
    }

    _write(chunk: ZipStreamChunk,
           _encoding: BufferEncoding,
           callback: (error?: Error | null) => void) {

        if (Date.now() - this.lastLogTime >= 60000) {
            // console.log(`Zipped ${this.count} files and counting...`)
            this.lastLogTime = Date.now()
        }
        this.count++
        const entryCB = () => {
            cleanup()
            callback()
        }
        const errorCB = (error: Error) => {
            cleanup()
            callback(error)
        }
        const cleanup = () => {
            this.archive.removeListener('entry', entryCB)
            this.archive.removeListener('error', errorCB)
        }
        this.archive.once('entry', entryCB)
        this.archive.once('error', errorCB)
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
        this.archive.finalize()
    }
}
