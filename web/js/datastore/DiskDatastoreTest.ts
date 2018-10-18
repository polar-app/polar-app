import {assert} from 'chai';
import {assertJSON} from '../test/Assertions';
import {MockDocMetas} from '../metadata/DocMetas';
import {DiskDatastore} from './DiskDatastore';
import {DefaultPersistenceLayer} from './DefaultPersistenceLayer';
import {DocMeta} from '../metadata/DocMeta';
import {isPresent} from '../Preconditions';

import os from 'os';
import fs from 'fs';
import {Files} from '../util/Files';
import {FilePaths} from '../util/FilePaths';
import {Dictionaries} from '../util/Dictionaries';
import {Directories, GlobalDataDir} from './Directories';
import {MockPHZWriter} from '../phz/MockPHZWriter';
import {DocMetaFileRef} from './DocMetaRef';
import {Backend} from './Backend';
import {Platform} from '../util/Platforms';

const rimraf = require('rimraf');

const tmpdir = os.tmpdir();

describe('DiskDatastore', function() {

    it("valid file names for attachments", async function() {

        assert.ok(DiskDatastore.validateFileName('test.jpg'));
        assert.ok(DiskDatastore.validateFileName('test.html'));
        assert.ok(DiskDatastore.validateFileName('abc124ABC.txt'));
        assert.ok(DiskDatastore.validateFileName('abc124ABC'));

        assert.ok(! DiskDatastore.validateFileName('test this.jpg'));
        assert.ok(! DiskDatastore.validateFileName('testthis.jpggg'));

    });

    it("init and test paths", async function() {

        const dataDir = FilePaths.join(tmpdir, 'test-paths');
        removeDirectory(dataDir);

        GlobalDataDir.set(dataDir);
        const diskDatastore = new DiskDatastore();

        await diskDatastore.init();

        assert.equal(diskDatastore.dataDir, FilePaths.join(tmpdir, 'test-paths'));

        assert.equal(diskDatastore.stashDir, FilePaths.join(tmpdir, 'test-paths', 'stash'));

        // now create it and

    });


    it("test async exists function", async function() {

        const dataDir = FilePaths.join(tmpdir, 'this-file-does-not-exist');
        removeDirectory(dataDir);

        assert.equal(fs.existsSync(dataDir), false);
        assert.equal(await Files.existsAsync(dataDir), false);

    });

    it("init dataDir directory on init()", async function() {

        const dataDir = FilePaths.join(tmpdir, 'disk-datastore.test');
        removeDirectory(dataDir);

        GlobalDataDir.set(dataDir);
        const diskDatastore = new DiskDatastore();

        assert.equal(await Files.existsAsync(dataDir), false);

        let expected: any = {

            "dataDirConfig": {
                "path": FilePaths.join(tmpdir, "disk-datastore.test"),
                "strategy": "manual"
            },
            "dataDir": FilePaths.join(tmpdir, "disk-datastore.test"),
            "stashDir": FilePaths.join(tmpdir, "disk-datastore.test", "stash"),
            "filesDir": FilePaths.join(tmpdir, "disk-datastore.test", "files"),
            "logsDir": FilePaths.join(tmpdir, "disk-datastore.test", "logs"),
            "configDir": FilePaths.join(tmpdir, "disk-datastore.test", "config"),

            "initialization": {

                "dataDir": {
                    "dir": FilePaths.join(tmpdir, 'disk-datastore.test'),
                    "created": true,
                },
                "stashDir": {
                    "dir": FilePaths.join(tmpdir, 'disk-datastore.test', 'stash'),
                    "created": true,
                },
                "filesDir": {
                    "dir": FilePaths.join(tmpdir, 'disk-datastore.test', 'files'),
                    "created": true,
                },
                "logsDir": {
                    "dir": FilePaths.join(tmpdir, 'disk-datastore.test', 'logs'),
                    "created": true,
                },
                "configDir": {
                    "dir": FilePaths.join(tmpdir, 'disk-datastore.test', 'config'),
                    "created": true,
                }

            },
        };

        // test double init...
        assertJSON(await diskDatastore.init(), expected );

        expected = {
            "dataDirConfig": {
                "path": FilePaths.join(tmpdir, "disk-datastore.test"),
                "strategy": "manual"
            },
            "dataDir": FilePaths.join(tmpdir, "disk-datastore.test"),
            "stashDir": FilePaths.join(tmpdir, "disk-datastore.test", "stash"),
            "filesDir": FilePaths.join(tmpdir, "disk-datastore.test", "files"),
            "logsDir": FilePaths.join(tmpdir, "disk-datastore.test", "logs"),
            "configDir": FilePaths.join(tmpdir, "disk-datastore.test", "config"),

            "initialization": {

                "dataDir": {
                    "dir": FilePaths.join(tmpdir, 'disk-datastore.test'),
                    "exists": true,
                },
                "stashDir": {
                    "dir": FilePaths.join(tmpdir, 'disk-datastore.test', 'stash'),
                    "exists": true,
                },
                "filesDir": {
                    "dir": FilePaths.join(tmpdir, 'disk-datastore.test', 'files'),
                    "exists": true,
                },
                "logsDir": {
                    "dir": FilePaths.join(tmpdir, 'disk-datastore.test', 'logs'),
                    "exists": true,
                },
                "configDir": {
                    "dir": FilePaths.join(tmpdir, 'disk-datastore.test', 'config'),
                    "exists": true,
                }
            }
        };

        assertJSON(await diskDatastore.init(), expected );

    });

    it("getDataDirsForPlatform MAC_OS", function() {

        const userHome = '/Users/alice';
        const platform = Platform.MACOS;

        assertJSON(DiskDatastore.getDataDirsForPlatform({userHome, platform}), {
            "paths": [
                "/Users/alice/.polar",
                "/Users/alice/Library/Application Support/Polar"
            ],
            "preferredPath": "/Users/alice/Library/Application Support/Polar"
        });

    });


    it("getDataDir", function() {

        const user = process.env['USER'];

        assert.notEqual(Directories.getDataDir(), null);
        // assertJSON(Directories.getDataDir(), {
        //     path:
        // });

    });

    describe('Write and discover documents', function() {

        const fingerprint = "0x001";

        const dataDir = FilePaths.join(tmpdir, 'test-data-dir');

        let diskDatastore: DiskDatastore;
        let persistenceLayer: DefaultPersistenceLayer;

        let docMeta: DocMeta;

        beforeEach(async function() {

            removeDirectory(dataDir);

            GlobalDataDir.set(dataDir);
            diskDatastore = new DiskDatastore();
            persistenceLayer = new DefaultPersistenceLayer(diskDatastore);

            await persistenceLayer.init();

            docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);

            docMeta.docInfo.filename = `${fingerprint}.phz`;

            const contains = await persistenceLayer.contains(fingerprint);

            assert.equal(contains, false);

            await MockPHZWriter.write(FilePaths.create(diskDatastore.stashDir, `${fingerprint}.phz`))

            await persistenceLayer.sync(fingerprint, docMeta);

        });

        it("write and read data to disk", async function() {
            //
            // let contains = await persistenceLayer.contains(fingerprint);
            //
            // assert.ok(! contains);

            const docMeta0 = await persistenceLayer.getDocMeta(fingerprint);

            assert.ok(docMeta0!.docInfo.lastUpdated !== undefined);

            delete docMeta0!.docInfo.lastUpdated;
            delete docMeta0!.docInfo.nrComments;
            delete docMeta0!.docInfo.nrFlashcards;
            delete docMeta0!.docInfo.nrAreaHighlights;
            delete docMeta0!.docInfo.nrTextHighlights;
            delete docMeta0!.docInfo.nrNotes;

            assert.equal(isPresent(docMeta0), true);

            assertJSON(Dictionaries.sorted(docMeta), Dictionaries.sorted(docMeta0));

        });


        it("write and then delete DocMeta...", async function() {

            const docMetaFileRef: DocMetaFileRef = {
                fingerprint,
                filename: `${fingerprint}.phz`,
                docInfo: docMeta.docInfo
            };

            // make sure the files exist on disk...

            const docPath = FilePaths.join(diskDatastore.stashDir, `${fingerprint}.phz`);
            const statePath = FilePaths.join(diskDatastore.dataDir, fingerprint, 'state.json');

            assert.ok(await Files.existsAsync(docPath));
            assert.ok(await Files.existsAsync(statePath));

            await persistenceLayer.delete(docMetaFileRef);

            // make sure the files were deleted

            assert.ok(! await Files.existsAsync(docPath));
            assert.ok(! await Files.existsAsync(statePath));

        });

        it("adding binary files", async function() {

            const data = 'fake image data';

            assert.ok(! await diskDatastore.containsFile(Backend.IMAGE, 'test.jpg'));

            const meta = {
                "foo": "bar"
            };

            await diskDatastore.addFile(Backend.IMAGE, 'test.jpg', data, meta);

            assert.ok(await diskDatastore.containsFile(Backend.IMAGE, 'test.jpg'));

            const datastoreFile = await diskDatastore.getFile(Backend.IMAGE, 'test.jpg')
            assert.ok(datastoreFile);
            assert.ok(datastoreFile.isPresent());
            assert.ok(datastoreFile.get());

            assertJSON(datastoreFile.get().meta, meta);


        });

        it("getDocMetaFiles", async function() {

            const docMetaFiles = await diskDatastore.getDocMetaFiles();

            assert.equal(docMetaFiles.length > 0, true);

            assert.equal(docMetaFiles.map((current) => current.fingerprint).includes(fingerprint), true);

        });

    });

    //     diskDatastore.init();
//     diskDatastore.init();
//     let fingerprint = "0x0000";
//     diskDatastore.sync(fingerprint, {});
//     var docMeta = await diskDatastore.getDocMeta(fingerprint)
//
//     // test for something that doesn't exits.
//     docMeta = await diskDatastore.getDocMeta("0xmissing")
//     assert.equal(docMeta, null)


});

function removeDirectory(path: string) {
    rimraf.sync(path);
}

//
//
//
// async function testBasicFileOperations() {
//
//     let testFilePath = `${tmpdir}/test.write";
//     let testDirPath = `${tmpdir}/test.dir";
//
//     // test removing files
//     await diskDatastore.unlinkAsync(testFilePath)
//                        .catch(function (err) {})
//     await diskDatastore.rmdirAsync(testDirPath)
//                        .catch(function (err) {console.error(err)})
//
//     // test access
//
//     var canAccess =
//         await diskDatastore.accessAsync(testFilePath, fs.constants.R_OK | fs.constants.W_OK)
//                            .then(() => true)
//                            .catch(() => false);
//
//     assert.equal(canAccess, false);
//
//     // test writing
//     await diskDatastore.writeFileAsync(testFilePath, "asdf", {});
//
//     // now see if the file exists.
//
//     var canAccess =
//         await diskDatastore.accessAsync(testFilePath, fs.constants.R_OK | fs.constants.W_OK)
//                            .then(() => true)
//                            .catch(() => false);
//
//     assert.equal(canAccess, true);
//
//     // test reading
//     var result = await diskDatastore.readFileAsync(testFilePath);
//     assert.equal("asdf", result);
//
//     // test removing files
//     await diskDatastore.unlinkAsync(testFilePath);
//
//     await diskDatastore.mkdirAsync(testDirPath)
//
//     // now stat() the dir to see that it's actuall a dir.
//     var stat = await diskDatastore.statAsync(testDirPath);
//
//     assert.equal(stat.isDirectory(), true);
//
//     // now test existsAsync
//     assert.equal(await diskDatastore.existsAsync(`${tmpdir}"), true );
//
//     assert.equal(await diskDatastore.existsAsync(`${tmpdir}asdf"), false );
//
//     assert.equal(await diskDatastore.existsAsync("/home/burton/.polar/0xmissing"), false );
//
//     console.log("Worked");
//
// }
//
// async function testDiskDatastore() {
//
//     diskDatastore.init();
//     diskDatastore.init();
//     let fingerprint = "0x0000";
//     diskDatastore.sync(fingerprint, {});
//     var docMeta = await diskDatastore.getDocMeta(fingerprint)
//
//     // test for something that doesn't exits.
//     docMeta = await diskDatastore.getDocMeta("0xmissing")
//     assert.equal(docMeta, null)
//
// }
//
// testBasicFileOperations();
//
// testDiskDatastore();
// //
// //  test2();
// //
// //
