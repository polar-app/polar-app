import {PassThrough} from "stream";

export class Buffers {

    public static toStream(buffer: Buffer) {

        const result = new PassThrough();

        result.push(buffer);
        result.push(null);

        return result;

    }

}
