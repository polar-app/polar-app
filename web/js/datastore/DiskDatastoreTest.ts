import {assert} from 'chai';
import {assertJSON} from '../test/Assertions';
import {DiskDatastore} from './DiskDatastore';

import os from 'os';
import fs from 'fs';
import {Files} from '../util/Files';
import {FilePaths} from '../util/FilePaths';
import {Directories, GlobalDataDir} from './Directories';
import {Platform} from '../util/Platforms';
import {DatastoreTester} from './DatastoreTester';
import {Backend} from './Backend';
import {DefaultPersistenceLayer} from './DefaultPersistenceLayer';
import {MockDocMetas} from '../metadata/DocMetas';
import {DocMetaFileRef} from './DocMetaRef';
import {MockPHZWriter} from '../phz/MockPHZWriter';

const tmpdir = os.tmpdir();

describe("DiskDatastore", async function() {

    DatastoreTester.test(() => new DiskDatastore());

    it("getDataDir", function() {
        assert.notEqual(Directories.getDataDir(), null);
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


    it("init dataDir directory on init()", async function() {

        const dataDir = FilePaths.join(tmpdir, 'disk-datastore.test');
        Files.removeDirectoryRecursively(dataDir);

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


    it("init and test paths", async function() {

        const dataDir = FilePaths.join(tmpdir, 'test-paths');
        Files.removeDirectoryRecursively(dataDir);

        GlobalDataDir.set(dataDir);
        const diskDatastore = new DiskDatastore();

        await diskDatastore.init();

        assert.equal(diskDatastore.dataDir, FilePaths.join(tmpdir, 'test-paths'));

        assert.equal(diskDatastore.stashDir, FilePaths.join(tmpdir, 'test-paths', 'stash'));

        // now create it and

    });

    it("test async exists function", async function() {

        const dataDir = FilePaths.join(tmpdir, 'this-file-does-not-exist');
        Files.removeDirectoryRecursively(dataDir);

        assert.equal(fs.existsSync(dataDir), false);
        assert.equal(await Files.existsAsync(dataDir), false);

    });

    it("Add file and remove file from the stash and see if it exists.", async function() {

        const path = FilePaths.join("..", "..", "docs", "example.pdf");

        assert.ok(await Files.existsAsync(path), "No file found from: " + process.cwd());

        const dataDir = FilePaths.join(tmpdir, 'datastore-stash-backend');
        Files.removeDirectoryRecursively(dataDir);

        GlobalDataDir.set(dataDir);
        const diskDatastore = new DiskDatastore();
        await diskDatastore.init();

        await diskDatastore.addFile(Backend.STASH, 'example.pdf', await Files.readFileAsync(path));

        const pdfPath = FilePaths.join(dataDir, "stash", "example.pdf");

        assert.ok(await Files.existsAsync(pdfPath), "Could not find file: " + pdfPath);

        assert.ok(await diskDatastore.containsFile(Backend.STASH, 'example.pdf'));

        await diskDatastore.deleteFile(Backend.STASH, 'example.pdf');

        assert.isFalse(await Files.existsAsync(pdfPath));

    });

    it("Delete file and make sure state.json and dir are no longer present", async function() {

        const dataDir = FilePaths.join(tmpdir, 'datastore-delete-test');

        GlobalDataDir.set(dataDir);
        const diskDatastore = new DiskDatastore();
        await diskDatastore.init();

        const persistenceLayer = new DefaultPersistenceLayer(diskDatastore);

        await persistenceLayer.init();

        const fingerprint = '0x00datadelete';
        const docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);

        await persistenceLayer.sync(fingerprint, docMeta);

        const stateFile = FilePaths.join(dataDir, fingerprint, 'state.json');

        assert.ok(await Files.existsAsync(stateFile));

        const docMetaFileRef: DocMetaFileRef = {
            fingerprint,
            filename: `${fingerprint}.phz`,
            docInfo: docMeta.docInfo
        };

        await MockPHZWriter.write(FilePaths.create(diskDatastore.stashDir, `${fingerprint}.phz`));

        await persistenceLayer.delete(docMetaFileRef);

        assert.isFalse(await persistenceLayer.contains(stateFile));

    });


});
