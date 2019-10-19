/**
 * Write mock PHZ data to a file we can work with.
 */
import {MockCapturedContent} from 'polar-content-capture/src/phz/MockCapturedContent';
import {CapturedPHZWriter} from 'polar-content-capture/src/phz/CapturedPHZWriter';

export class MockPHZWriter {

    public static async write(path: string) {

        const captured = MockCapturedContent.create();

        const capturedPHZWriter = new CapturedPHZWriter(path);
        await capturedPHZWriter.convert(captured);

    }

}
