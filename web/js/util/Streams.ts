const convertStream = require("convert-stream");

export class Streams {

    public static async toBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
        return await convertStream.toBuffer(stream);
    }

}
