const assert = require('assert');
const url = require('url');
const fs = require('fs');
const MockCapturedContent = require("./MockCapturedContent").MockCapturedContent;
const {CapturedPHZWriter} = require("./CapturedPHZWriter");
const {Files} = require("../util/Files");
const {assertJSON} = require("../test/Assertions");
const {Time} = require("../util/Time");

require("../test/TestingTime").freeze();

describe('CapturedPHZWriter', function() {

    it("write out captured JSON", async function () {

        let captured = MockCapturedContent.create();

        let capturedPHZWriter = new CapturedPHZWriter("/tmp/captured.phz");
        await capturedPHZWriter.convert(captured);

    });

});
