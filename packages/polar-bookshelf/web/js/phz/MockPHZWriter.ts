import {MockCapturedContent} from 'polar-content-capture/src/phz/MockCapturedContent';
import {CapturedPHZWriter} from 'polar-content-capture/src/phz/CapturedPHZWriter';
import {PHZWriter} from "polar-content-capture/src/phz/PHZWriter";

/**
 * Write mock PHZ data to a file we can work with.
 * @Deprecated This is from Polar 1.0
 */
export class MockPHZWriter {

    public static async write(path: string) {

        const captured = MockCapturedContent.create();

        const output = new PHZWriter(path);
        const capturedPHZWriter = new CapturedPHZWriter(output);
        await capturedPHZWriter.convert(captured);

    }

}
