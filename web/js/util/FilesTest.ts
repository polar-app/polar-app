import {assert} from 'chai';
import {Files} from './Files';
import {FilePaths} from './FilePaths';
import os from "os";
import fs from 'fs';

const tmpdir = os.tmpdir();

const rimraf = require('rimraf');

describe('Files', function() {

    describe('writeFileAsync', function() {

        it("basic", async function () {

            await Files.writeFileAsync(FilePaths.join(tmpdir, "write-file-async.txt"), "hello world");

        });

    });

    describe('readFileAsync', function() {

        it("basic", async function() {

            let path = FilePaths.join(tmpdir, "write-file-async.txt");

            await Files.writeFileAsync(path, "hello world");

            let data = await Files.readFileAsync(path);

            assert.equal(data.toString('utf8'), "hello world")

        });

        it("missing file", async function() {

            const missingPath = "this-is-a-missing-path.txt";

            await Files.readFileAsync(missingPath);

            // fs.readFile(missingPath, () => {});

        });

        async function failsProperly() {
            throw new Error("failing properly.");
        }

        it("proper exception example.", async function() {

            await failsProperly();

        });

    });


    describe('readdirAsync', function() {

        it("basic", async function () {

            let filename = "write-file-async.txt";
            let path = FilePaths.join(tmpdir, filename);

            await Files.writeFileAsync(path, "hello world");

            let files = await Files.readdirAsync(tmpdir);

            assert.equal(files.includes(filename), true);

        });

    });

    describe('statAsync', function() {

        it("basic", async function () {

            let filename = "write-file-async.txt";
            let path = FilePaths.join(tmpdir, filename);

            let stat = await Files.statAsync(path);

            assert.equal(stat !== null, true);
            assert.equal(stat.isFile(), true);
            assert.equal(stat.isDirectory(), false);

        });

        it("isDirectory", async function () {

            let stat = await Files.statAsync(tmpdir);
            assert.equal(stat.isDirectory(), true);

        });

        xit("missing file", async function () {

            assert.throw(async function() {
                await Files.statAsync(FilePaths.createTempName('invalid-file-name'));
            });

        });


    });

    describe('mkdirAsync', function() {

        it("basic", async function () {

            let path = FilePaths.join(tmpdir, '/test.dir');

            removeDirectory(path);

            await Files.mkdirAsync(path);

            assert.ok(await Files.existsAsync(path));

            let stat = await Files.statAsync(path);

            assert.equal(stat !== null, true);
            assert.equal(stat.isFile(), false);
            assert.equal(stat.isDirectory(), true);

        });

    });


});


function removeDirectory(path: string) {
    rimraf.sync(path);
}
