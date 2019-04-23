import {Uint8Arrays} from './Uint8Arrays';

export class ArrayBuffers {

    public static toBuffer(arrayBuffer: ArrayBuffer) {
        return Buffer.from(arrayBuffer);
    }


    public static toBase64(buffer: ArrayBuffer) {
        const bytes = new Uint8Array( buffer );
        return Uint8Arrays.toBase64(bytes);

    }

}

