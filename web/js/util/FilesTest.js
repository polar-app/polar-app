const assert = require('assert');
const {Files} = require('./Files');

describe('Files', function() {

    describe('writeFileAsync', function() {

        it("basic", async function () {

            await Files.writeFileAsync("/tmp/write-file-async.txt", "hello world");

        });

    });

    describe('readFileAsync', function() {

        it("basic", async function () {

            await Files.writeFileAsync("/tmp/write-file-async.txt", "hello world");
            let data = await Files.readFileAsync("/tmp/write-file-async.txt");

            assert.equal(data, "hello world")

        });

    });


});
