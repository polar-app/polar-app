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

            assert.equal(data.toString('utf8'), "hello world");

        });

        xit("missing file", async function() {

            const missingPath = "this-is-a-missing-path.txt";

            await Files.readFileAsync(missingPath);

            // fs.readFile(missingPath, () => {});

        });

        async function failsProperly() {
            throw new Error("failing properly.");
        }

        xit("proper exception example.", async function() {

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

    describe('createDirAsync', function() {

        it("basic", async function() {

            const path = FilePaths.join(tmpdir, 'test-createDirAsync.dir');

            removeDirectory(path);

            await Files.createDirAsync(path);

            assert.ok(await Files.existsAsync(path));

            const stat = await Files.statAsync(path);

            assert.equal(stat !== null, true);
            assert.equal(stat.isFile(), false);
            assert.equal(stat.isDirectory(), true);

            await Files.createDirAsync(path);

        });

        it("test EEXIST", async function() {

            // TODO test what happens if we get an EEXIST in mkdir using mocks.

        });

    });

    describe('mkdirAsync', function() {

        it("basic", async function () {

            let path = FilePaths.join(tmpdir, 'test-mkdir.dir');

            removeDirectory(path);

            await Files.mkdirAsync(path);

            assert.ok(await Files.existsAsync(path));

            let stat = await Files.statAsync(path);

            assert.equal(stat !== null, true);
            assert.equal(stat.isFile(), false);
            assert.equal(stat.isDirectory(), true);

        });


        it("test errno on second call", async function() {

            const path = FilePaths.join(tmpdir, 'test-mkdir-second-call.dir');

            removeDirectory(path);

            assert.ok(!await Files.existsAsync(path));

            await Files.mkdirAsync(path);

            assert.ok(await Files.existsAsync(path));

            const stat = await Files.statAsync(path);

            assert.equal(stat !== null, true);
            assert.equal(stat.isFile(), false);
            assert.equal(stat.isDirectory(), true);

            try {

                await Files.mkdirAsync(path);

                assert.ok(false, "This should not have worked");

            } catch (e) {
                assert.equal(e.code, "EEXIST");
                assert.ok(e.message.indexOf("EEXIST:") === 0);
            }

        });

    });


});


function removeDirectory(path: string) {
    rimraf.sync(path);
}
