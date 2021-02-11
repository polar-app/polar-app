/**
 * Write mock PHZ data to a file we can work with.
 */
import {MockCapturedContent} from 'polar-content-capture/src/phz/MockCapturedContent';
import {CapturedPHZWriter} from 'polar-content-capture/src/phz/CapturedPHZWriter';
import {PHZWriter} from "polar-content-capture/src/phz/PHZWriter";

export class MockPHZWriter {

    public static async write(path: string) {

        const captured = MockCapturedContent.create();

        const output = new PHZWriter(path);
        const capturedPHZWriter = new CapturedPHZWriter(output);
        await capturedPHZWriter.convert(captured);

    }

}
