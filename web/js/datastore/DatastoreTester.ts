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
import {Datastore} from './Datastore';

const rimraf = require('rimraf');

const tmpdir = os.tmpdir();

export class DatastoreTester {

    public static test(datastoreFactory: () => Datastore) {

        describe('Write and discover documents', function() {

            const fingerprint = "0x001";

            const dataDir = FilePaths.join(tmpdir, 'test-data-dir');

            let datastore: Datastore;
            let persistenceLayer: DefaultPersistenceLayer;

            let docMeta: DocMeta;

            let directories: Directories;

            beforeEach(async function() {

                Files.removeDirectoryRecursively(dataDir);

                GlobalDataDir.set(dataDir);
                datastore = datastoreFactory();
                directories = new Directories();

                persistenceLayer = new DefaultPersistenceLayer(datastore);

                await persistenceLayer.init();

                docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);

                docMeta.docInfo.filename = `${fingerprint}.phz`;

                const contains = await persistenceLayer.contains(fingerprint);

                assert.equal(contains, false);

                await MockPHZWriter.write(FilePaths.create(datastore.stashDir, `${fingerprint}.phz`))

                const datastoreMutation = await persistenceLayer.sync(fingerprint, docMeta);
                await datastoreMutation.committed.get();

            });

            it("write and read data to disk", async function() {

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
                delete docMeta0!.docInfo.nrAnnotations;
                delete docMeta0!.docInfo.uuid;

                assert.equal(isPresent(docMeta0), true);

                assertJSON(Dictionaries.sorted(docMeta), Dictionaries.sorted(docMeta0));

            });


            it("Delete DocMeta and the associated stash file...", async function() {

                const docMetaFileRef: DocMetaFileRef = {
                    fingerprint,
                    filename: `${fingerprint}.phz`,
                    docInfo: docMeta.docInfo
                };

                // make sure the files exist on disk...

                const docPath = FilePaths.join(directories.stashDir, `${fingerprint}.phz`);
                const statePath = FilePaths.join(directories.dataDir, fingerprint, 'state.json');

                assert.ok(await Files.existsAsync(docPath));
                assert.ok(await Files.existsAsync(statePath));

                await persistenceLayer.delete(docMetaFileRef);

                // make sure the files were deleted

                assert.ok(! await Files.existsAsync(docPath));
                assert.ok(! await Files.existsAsync(statePath));

            });

            it("adding binary files", async function() {

                const data = 'fake image data';

                assert.ok(! await datastore.containsFile(Backend.IMAGE, 'test.jpg'));

                const meta = {
                    "foo": "bar"
                };

                await datastore.addFile(Backend.IMAGE, 'test.jpg', data, meta);

                assert.ok(await datastore.containsFile(Backend.IMAGE, 'test.jpg'));

                const datastoreFile = await datastore.getFile(Backend.IMAGE, 'test.jpg')
                assert.ok(datastoreFile);
                assert.ok(datastoreFile.isPresent());
                assert.ok(datastoreFile.get());

                assertJSON(datastoreFile.get().meta, meta);


            });

            it("getDocMetaFiles", async function() {

                const docMetaFiles = await datastore.getDocMetaFiles();

                assert.equal(docMetaFiles.length > 0, true);

                assert.equal(docMetaFiles.map((current) => current.fingerprint).includes(fingerprint), true);

            });

        });

    }

}
