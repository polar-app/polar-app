import * as stream from 'stream';
import {ReadableOptions} from 'stream';

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

                    // It is recommended that errors occurring during the processing
                    // of the readable._read() method are emitted using the 'error'
                    // event rather than being thrown. Throwing an Error from within
                    // readable._read() can result in unexpected and inconsistent
                    // behavior depending on whether the stream is operating in
                    // flowing or paused mode. Using the 'error' event ensures
                    // consistent and predictable handling of errors.
                    doReadAsync().catch(err => {
                        this.emit('error', err);
                        this.push(null);
                    });

                };

                const doReadAsync = async () => {

                    const end = computeEnd();
                    const slice = blob.slice(this.index, end);

                    const buff = await Blobs.toArrayBuffer(slice);
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

            }


        }

        return new BlobReadableStream(opts);

    }


    // public static async toStream(blob: Blob): Promise<NodeJS.ReadableStream> {
    //
    //     const result = new stream.Readable();
    //
    //     try {
    //         const chunkSize = 4096;
    //
    //         let index: number = 0;
    //
    //         const computeEnd = () => {
    //
    //             let result = index + chunkSize;
    //             if (result > blob.size) {
    //                 result = blob.size;
    //             }
    //
    //             return result;
    //
    //         };
    //
    //         result.on()
    //
    //         while (index < blob.size) {
    //
    //             const end = computeEnd();
    //             const slice = blob.slice(index, end);
    //
    //             // now read the slice and write it to the stream
    //             const buff = await this.toArrayBuffer(slice);
    //
    //
    //             // If .push() returns a false value, the stream will stop
    //             // reading from the source. Otherwise, it will continue without
    //             // pause.
    //
    //             result.push(buff);
    //
    //             index += chunkSize;
    //
    //         }
    //
    //         result.push(null);
    //
    //     } catch (e) {
    //         result.emit('error', e);
    //         result.push(null);
    //     }
    //
    //
    // //     if (e) {
    // //         rs.emit('error', e)
    // //         rs.push(null)
    // //     }
    // //     rs.push(buffer)
    // //     rs.push(null)
    // // })
    //
    //     return result;
    //
    // }

}
