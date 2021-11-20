import crypto from 'crypto';
import {BS58} from "./BS58";

export namespace Base58Check {

    export function encode(data: string | Buffer,
                           prefix: string | Buffer = '00',
                           encoding: BufferEncoding = 'hex'): string {

        if (typeof data === 'string') {
            data = Buffer.from(data, encoding)
        }

        if (!(data instanceof Buffer)) {
            throw new TypeError('"data" argument must be an Array of Buffers')
        }

        if (!(prefix instanceof Buffer)) {
            prefix = Buffer.from(prefix, encoding)
        }
        let hash = Buffer.concat([prefix, data])
        hash = crypto.createHash('sha256').update(hash).digest()
        hash = crypto.createHash('sha256').update(hash).digest()
        hash = Buffer.concat([prefix, data,  hash.slice(0, 4)])
        return BS58.encode(hash);

    }

    export interface IDecoded {
        readonly prefix: string;
        readonly data: string;
    }

    // TODO: this is from the base58check library but I don't think this ever worked

    // export function decode(str: string, encoding: BufferEncoding = 'hex'): IDecoded {
    //
    //     const buffer = Buffer.from(BS58.decode(str));
    //     const prefix = buffer.slice(0, 1)
    //     const data = buffer.slice(1, -4)
    //     let hash = Buffer.concat([prefix, data])
    //     hash = crypto.createHash('sha256').update(hash).digest()
    //     hash = crypto.createHash('sha256').update(hash).digest()
    //     buffer.slice(-4).forEach((check, index) => {
    //         if (check !== hash[index]) {
    //             throw new Error('Invalid checksum')
    //         }
    //     })
    //
    //
    //
    //     return {
    //         prefix: prefix.toString(encoding),
    //         data: data.toString(encoding)
    //     }
    //
    // }

}
