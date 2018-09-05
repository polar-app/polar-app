import {FilePaths} from '../util/FilePaths';
import {MockCapturedContent} from './MockCapturedContent';
import {CapturedPHZWriter} from './CapturedPHZWriter';
import {TestingTime} from '../test/TestingTime';

TestingTime.freeze();

describe('CapturedPHZWriter', function() {

    it("write out captured JSON", async function () {

        let captured = MockCapturedContent.create();

        let capturedPHZWriter = new CapturedPHZWriter(FilePaths.tmpfile("captured.phz"));
        await capturedPHZWriter.convert(captured);

    });

});
