import {assert} from 'chai';
import {Files, FileHandle} from './Files';
import {FilePaths} from './FilePaths';
import os from "os";
import fs from 'fs';

const tmpdir = os.tmpdir();

const rimraf = require('rimraf');

describe('Files', function() {

    describe('removeDirectoryRecursivelyAsync', function() {

        it("Test with non-existant directory", async function() {

            const path = FilePaths.join(tmpdir, 'non-existent-directory-path');

            const result = await Files.removeDirectoryRecursivelyAsync(path);

            assert.equal(result.files.length, 0);
            assert.equal(result.dirs.length, 0);

            assert.equal(result.path, path);

            assert.ok(! await Files.existsAsync(path));

        });


        it("Test with non-existant directory", async function() {

            const path = FilePaths.join(tmpdir, 'empty-dir-with-no-files');

            await Files.mkdirAsync(path);

            const result = await Files.removeDirectoryRecursivelyAsync(path);

            assert.equal(result.files.length, 0);
            assert.equal(result.dirs.length, 0);

            assert.equal(result.path, path);

            assert.ok(! await Files.existsAsync(path));

        });

        it("Test with one file", async function() {

            const path = FilePaths.join(tmpdir, 'dir-with-one-file');

            await Files.mkdirAsync(path);
            await Files.writeFileAsync(FilePaths.join(path, 'hello.txt'), 'hello');

            const result = await Files.removeDirectoryRecursivelyAsync(path);

            assert.equal(result.files.length, 1);
            assert.equal(result.dirs.length, 0);

            assert.equal(result.path, path);

            assert.ok(! await Files.existsAsync(path));

        });

        it("Test with nested dirs", async function() {

            const path = FilePaths.join(tmpdir, 'dir-with-one-file');

            await Files.mkdirAsync(path);
            await Files.writeFileAsync(FilePaths.join(path, 'hello.txt'), 'hello');
            await Files.mkdirAsync(FilePaths.join(path, 'dir0'));
            await Files.writeFileAsync(FilePaths.join(path, 'dir0', 'hello.txt'), 'hello');

            const result = await Files.removeDirectoryRecursivelyAsync(path);

            assert.equal(result.files.length, 1);
            assert.equal(result.dirs.length, 1);

            assert.equal(result.path, path);

            assert.ok(! await Files.existsAsync(path));

        });

    });


    describe('integrated', function() {

        it("Test delete with missing parent dirs", async function() {

            const path = FilePaths.join(tmpdir, 'missing', 'parent', 'example.txt');

            await Files.existsAsync(path);
            await Files.deleteAsync(path);

        });

    });

    describe('writeFileAsync', function() {

        it("basic", async function() {

            await Files.writeFileAsync(FilePaths.join(tmpdir, "write-file-async.txt"), "hello world");

        });

        it("from stream", async function() {

            const dataInputPath = FilePaths.join(tmpdir, "data-input.txt");
            await Files.writeFileAsync(dataInputPath, "hello world");

            const dataOutputPath = FilePaths.join(tmpdir, "data-output.txt");

            await Files.writeFileAsync(dataOutputPath, Files.createReadStream(dataInputPath));

            const output = await Files.readFileAsync(dataOutputPath);

            assert.ok(output, "hello world");

        });

        it("from FileRef", async function() {

            const dataInputPath = FilePaths.join(tmpdir, "data-input.txt");
            await Files.writeFileAsync(dataInputPath, "hello world");

            const dataOutputPath = FilePaths.join(tmpdir, "data-output.txt");

            const fileRef: FileHandle = {path: dataInputPath};

            await Files.writeFileAsync(dataOutputPath, fileRef);

            const output = await Files.readFileAsync(dataOutputPath);

            assert.ok(output, "hello world");

        });

    });

    describe('readFileAsync', function() {

        it("basic", async function() {

            const path = FilePaths.join(tmpdir, "write-file-async.txt");

            await Files.writeFileAsync(path, "hello world");

            const data = await Files.readFileAsync(path);

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

        it("basic", async function() {

            const filename = "write-file-async.txt";
            const path = FilePaths.join(tmpdir, filename);

            await Files.writeFileAsync(path, "hello world");

            const files = await Files.readdirAsync(tmpdir);

            assert.equal(files.includes(filename), true);

        });

    });

    describe('statAsync', function() {

        it("basic", async function() {

            const filename = "write-file-async.txt";
            const path = FilePaths.join(tmpdir, filename);

            const stat = await Files.statAsync(path);

            assert.equal(stat !== null, true);
            assert.equal(stat.isFile(), true);
            assert.equal(stat.isDirectory(), false);

        });

        it("isDirectory", async function() {

            const stat = await Files.statAsync(tmpdir);
            assert.equal(stat.isDirectory(), true);

        });

        xit("missing file", async function() {

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

        xit("nested", async function() {

            // this fails but at least we kwow it fails.

            const baseDir = FilePaths.join(tmpdir, 'base-of-nested-dirs');

            const nestedDirPath = FilePaths.join(tmpdir, 'base-of-nested-dirs', 'first', 'second', 'third');

            await Files.removeDirectoryRecursivelyAsync(baseDir);
            await Files.rmdirAsync(baseDir);

            // await Files.createDirAsync(nestedDirPath)

        });

        it("basic", async function() {

            const path = FilePaths.join(tmpdir, 'test-mkdir.dir');

            removeDirectory(path);

            await Files.mkdirAsync(path);

            assert.ok(await Files.existsAsync(path));

            const stat = await Files.statAsync(path);

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
