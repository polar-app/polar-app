import {Uint8Arrays} from "./Uint8Arrays";

export class ArrayBuffers {

    public static toBuffer(arrayBuffer: ArrayBuffer) {
        return Buffer.from(arrayBuffer);
    }

    public static toBlob(arrayBuffer: ArrayBuffer): Blob {
        return new Blob([new Uint8Array(arrayBuffer)]);
    }

    public static toBase64(arrayBuffer: ArrayBuffer) {
        const bytes = new Uint8Array( arrayBuffer );
        return Uint8Arrays.toBase64(bytes);

    }

}

