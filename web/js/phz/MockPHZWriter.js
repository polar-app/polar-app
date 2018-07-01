const {CapturedPHZWriter} = require("../capture/CapturedPHZWriter");
const {MockCapturedContent} = require("../capture/MockCapturedContent");

/**
 * Write mock PHZ data to a file we can work with.
 */
class MockPHZWriter {

    static async write(path) {

        let captured = MockCapturedContent.create();

        let capturedPHZWriter = new CapturedPHZWriter(path);
        await capturedPHZWriter.convert(captured);

    }

}

module.exports.MockPHZWriter = MockPHZWriter;
