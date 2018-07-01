const assert = require('assert');
const fs = require('fs');
const {MockPHZWriter} = require("./MockPHZWriter");

require("../test/TestingTime").freeze();

describe('MockPHZWriter', function() {

    it("Write basic file", async function () {
        let path = "/tmp/test-mock-phz-writer.phz";
        await MockPHZWriter.write(path);
        assert.equal(fs.existsSync(path), true);

    });

});

