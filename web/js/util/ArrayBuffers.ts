import {array} from 'prop-types';

export class ArrayBuffers {

    public static toBuffer(arrayBuffer: ArrayBuffer) {
        return Buffer.from(arrayBuffer);
    }

}
