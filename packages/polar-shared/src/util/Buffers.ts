import {PassThrough} from "stream";

export namespace Buffers {

    export function toStream(buffer: Buffer) {

        const result = new PassThrough();

        result.push(buffer);
        result.push(null);

        return result;

    }

    export function toArrayBuffer(buffer: Buffer) {
        return buffer.buffer;
    }

}
