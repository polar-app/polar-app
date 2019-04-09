import * as stream from 'stream';
import {ReadableOptions} from 'stream';
import {ArrayBuffers} from './ArrayBuffers';

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

    // https://nodejs.org/api/stream.html#stream_implementing_a_readable_stream
    public static toStream(blob: Blob, opts: ReadableOptions = {}): NodeJS.ReadableStream {

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

                const computeEnd = () => {

                    let result = this.index + size;
                    if (result > blob.size) {
                        // truncate the end.
                        result = blob.size;
                    }

                    return result;

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
                        this.emit('error', err);
                        this.push(null);
                    });

                };

                const doReadAsync = async () => {

                    const end = computeEnd();
                    const slice = blob.slice(this.index, end);

                    const arrayBuffer = await Blobs.toArrayBuffer(slice);
                    const buff = ArrayBuffers.toBuffer(arrayBuffer);

                    const doNextRead = this.push(buff);

                    this.index += size;

                    if (this.index >= blob.size) {
                        // we're done reading the document now.
                        this.push(null);
                    } else if (doNextRead) {
                        // we have to read the next slice now.
                        doRead();
                    }

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
