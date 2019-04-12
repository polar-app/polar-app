import * as stream from 'stream';
import {ReadableOptions} from 'stream';
import {ArrayBuffers} from './ArrayBuffers';
import {Logger} from '../logger/Logger';

const log = Logger.create();

export class Blobs {

    public static async toArrayBuffer(blob: Blob): Promise<ArrayBuffer> {

        return new Promise<ArrayBuffer>((resolve, reject) => {

            const reader = new FileReader();

            reader.addEventListener("loadend", () => {
                // reader.result contains the contents of blob as a typed array
                resolve(<ArrayBuffer> reader.result);
            });

            reader.addEventListener("error", (err) => {
                // reader.result contains the contents of blob as a typed array
                reject(err);
            });

            reader.readAsArrayBuffer(blob);

        });

    }

    public static async toText(blob: Blob): Promise<string> {

        return new Promise<string>((resolve, reject) => {

            const reader = new FileReader();

            reader.addEventListener("loadend", () => {
                // reader.result contains the contents of blob as a typed array
                resolve(<string> reader.result);
            });

            reader.addEventListener("error", (err) => {
                // reader.result contains the contents of blob as a typed array
                reject(err);
            });

            reader.readAsText(blob);

        });

    }



    public static toStream(blob: Blob): NodeJS.ReadableStream {

        const passThrough = new stream.PassThrough();

        const writeSize = 4096;

        let error: Error | undefined;

        let index: number = 0;

        passThrough.on('error', err => {
            // the reader had a problem and we need to stop pushing data.
            error = err;
        });

        passThrough.on('drain', err => {
            doPush();
        });

        const computeEnd = () => {

            let result = index + writeSize;
            if (result > blob.size) {
                // truncate the end.
                result = blob.size;
            }

            return result;

        };

        const pushAsync = async () => {

            while (true) {

                const end = computeEnd();
                const slice = blob.slice(index, end);

                const arrayBuffer = await Blobs.toArrayBuffer(slice);
                const buff = ArrayBuffers.toBuffer(arrayBuffer);

                const doNextRead = passThrough.write(buff);

                index = end;

                if (index >= blob.size) {
                    // we're done reading the document now.
                    passThrough.write(null);
                    return;
                } else if (! doNextRead) {
                    return;
                }

            }

        };

        const doPush = () => {
            pushAsync()
                .catch(err => {
                    // we had an issue pushing data so notify the reader
                    passThrough.emit('error', err);
                });
        };

        doPush();

        return passThrough;

    }

    // https://nodejs.org/api/stream.html#stream_implementing_a_readable_stream
    public static toStream2(blob: Blob, opts: ReadableOptions = {}): NodeJS.ReadableStream {

        console.log("FIXME blob size: " + blob.size);

        class BlobReadableStream extends stream.Readable {

            private index: number = 0;

            constructor(opts: ReadableOptions) {
                super(opts);
            }

            // https://nodejs.org/api/stream.html#stream_readable_read_size_1

            // When readable._read() is called, if data is available from the
            // resource, the implementation should begin pushing that data into
            // the read queue using the this.push(dataChunk) method. _read()
            // should continue reading from the resource and pushing data until
            // readable.push() returns false. Only when _read() is called again
            // after it has stopped should it resume pushing additional data
            // onto the queue.

            public _read(size: number): void {

                console.log("FIXME: _read called");

                const computeEnd = () => {

                    let result = this.index + size;
                    if (result > blob.size) {
                        // truncate the end.
                        result = blob.size;
                    }

                    return result;

                };

                const doReadAsync = async () => {

                    // FIXME: I think maybe streams and promises aren't a good
                    // combination...

                    console.log("FIXME: trying to read again... index " + this.index);

                    while (this.index < blob.size) {

                        console.log("FIXME: beginning of while");

                        // TODO: it would be better if we had more of an iterator/
                        // producer/generator API here to just get the next slice
                        // rather than compute them directly.

                        const end = computeEnd();
                        const slice = blob.slice(this.index, end);

                        // FIXME: I don't think this await is actually working
                        // here...

                        const arrayBuffer = await Blobs.toArrayBuffer(slice);
                        const buff = ArrayBuffers.toBuffer(arrayBuffer);

                        console.log("FIXME: did push... " + this.index);
                        const doNextRead = this.push(buff);

                        this.index += size;

                        if (this.index >= blob.size) {
                            // we're done reading the document now.
                            console.log("FIXME: finished");
                            this.push(null);
                            console.log("FIXME: wrote final chunk (going to return)");
                            return;
                        } else if (! doNextRead) {
                            // we have to read the next slice now.
                            console.log("pausing read.");
                            return;
                        }

                        console.log("FIXME: end of while");

                    }

                };

                const doRead = () => {

                    // It is recommended that errors occurring during the
                    // processing of the readable._read() method are emitted
                    // using the 'error' event rather than being thrown.
                    // Throwing an Error from within readable._read() can result
                    // in unexpected and inconsistent behavior depending on
                    // whether the stream is operating in flowing or paused
                    // mode. Using the 'error' event ensures consistent and
                    // predictable handling of errors.
                    doReadAsync().catch(err => {
                        log.error("Caught error while writing to stream", err);
                        this.emit('error', err);
                        this.push(null);
                    });

                };

                // we have to do the first read now... the rest should just
                // work automatically because _read will be called and we push
                // until no data is available.
                doRead();

            }


        }

        return new BlobReadableStream(opts);

    }

}
