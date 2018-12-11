import {Blobs} from './Blobs';
import {ArrayBuffers} from './ArrayBuffers';
// import fetch from './Fetch';

export class URLs {

    public static async toStream(url: string): Promise<Buffer> {

        const response = await fetch(url);
        const blob = await response.blob();
        const arrayBuffer = await Blobs.toArrayBuffer(blob);
        const buffer = ArrayBuffers.toBuffer(arrayBuffer);
        return buffer;

    }

}
