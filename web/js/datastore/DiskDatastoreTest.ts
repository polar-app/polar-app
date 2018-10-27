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
import {DatastoreTester} from './DatastoreTester';

const rimraf = require('rimraf');

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

});
