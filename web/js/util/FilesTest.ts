import assert from 'assert';
import {Files} from './Files';
import {assertJSON} from '../test/Assertions';

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


    describe('readdirAsync', function() {

        it("basic", async function () {

            let files = await Files.readdirAsync(__dirname);

            assert.equal(files.includes("FilesTest.ts"), true);

        });

    });

    describe('statAsync', function() {

        it("basic", async function () {

            let stat = await Files.statAsync(__dirname + '/FilesTest.ts');

            assert.equal(stat !== null, true);
            assert.equal(stat.isFile(), true);
            assert.equal(stat.isDirectory(), false);

        });

        it("isDirectory", async function () {

            let stat = await Files.statAsync(__dirname);
            assert.equal(stat.isDirectory(), true);

        });

    });

});
