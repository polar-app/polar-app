
import assert from 'assert';
import {assertJSON} from '../test/Assertions';
import {DocMetas} from '../metadata/DocMetas';
import {DiskDatastore} from './DiskDatastore';
import {PersistenceLayer} from './PersistenceLayer';
import {DocMeta} from '../metadata/DocMeta';
import {isPresent} from '../Preconditions';

import os from 'os';
import {Files} from '../util/Files';

const fs = require('fs');

const rimraf = require('rimraf');

const tmpdir = os.tmpdir();

describe('DiskDatastore', function() {

    it("init and test paths", async function () {

        let dataDir = `${tmpdir}/test-paths`;

        let diskDatastore = new DiskDatastore(dataDir);

        await diskDatastore.init();

        assert.equal(diskDatastore.dataDir, `${tmpdir}/test-paths`);

        assert.equal(diskDatastore.stashDir, `${tmpdir}/test-paths/stash`);

        // now create it and

    });


    it("test async exists function", async function () {

        let dataDir = `${tmpdir}/this-file-does-not-exist`;

        let diskDatastore = new DiskDatastore(dataDir);

        assert.equal(fs.existsSync(dataDir), false);
        assert.equal(await Files.existsAsync(dataDir), false)

    });

    it("init dataDir directory on init()", async function () {

        let dataDir = `${tmpdir}/disk-datastore.test`;
        rimraf.sync(dataDir);

        let diskDatastore = new DiskDatastore(dataDir);

        assert.equal(await Files.existsAsync(dataDir), false);

        let expected: any = {
            "dataDir": {
                "dir": `${tmpdir}/disk-datastore.test`,
                "created": true,
            },
            "stashDir": {
                "dir": `${tmpdir}/disk-datastore.test/stash`,
                "created": true,
            },
            "logsDir": {
                "dir": `${tmpdir}/disk-datastore.test/logs`,
                "created": true,
            }
        };

        // test double init...
        assertJSON(await diskDatastore.init(), expected );

        expected = {
            "dataDir": {
                "dir": `${tmpdir}/disk-datastore.test`,
                "exists": true,
            },
            "stashDir": {
                "dir": `${tmpdir}/disk-datastore.test/stash`,
                "exists": true,
            },
            "logsDir": {
                "dir": `${tmpdir}/disk-datastore.test/logs`,
                "exists": true,
            }
        };

        assertJSON(await diskDatastore.init(), expected );

    });

    it("getDataDir", function () {

        assert.notEqual(DiskDatastore.getDataDir(), null);

    });

    describe('Write and discovery documents', function() {

        let fingerprint = "0x001";

        let dataDir = `${tmpdir}/test-data-dir`;

        let diskDatastore: DiskDatastore;
        let persistenceLayer: PersistenceLayer;

        let docMeta: DocMeta;

        beforeEach(async function () {

            diskDatastore = new DiskDatastore(dataDir);
            persistenceLayer = new PersistenceLayer(diskDatastore);

            await persistenceLayer.init();

            docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, 14);

            await persistenceLayer.sync(fingerprint, docMeta);

        });

        it("write and read data to disk", async function () {

            let docMeta0 = await persistenceLayer.getDocMeta(fingerprint);

            assert.equal(isPresent(docMeta0), true);

            assertJSON(docMeta, docMeta0);

        });


        it("getDocMetaFiles", async function () {

            let docMetaFiles = await diskDatastore.getDocMetaFiles();

            assert.equal(docMetaFiles.length > 0, true);

            assert.equal(docMetaFiles.map(current => current.fingerprint).includes(fingerprint), true);

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
