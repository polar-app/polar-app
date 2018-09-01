/**
 * Write mock PHZ data to a file we can work with.
 */
import {MockCapturedContent} from '../capture/MockCapturedContent';
import {CapturedPHZWriter} from '../capture/CapturedPHZWriter';

export class MockPHZWriter {

    static async write(path: string) {

        let captured = MockCapturedContent.create();

        let capturedPHZWriter = new CapturedPHZWriter(path);
        await capturedPHZWriter.convert(captured);

    }

}
