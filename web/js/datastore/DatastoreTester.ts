import {assert} from 'chai';
import {assertJSON} from '../test/Assertions';
import {MockDocMetas} from '../metadata/DocMetas';
import {DefaultPersistenceLayer} from './DefaultPersistenceLayer';
import {DocMeta} from '../metadata/DocMeta';
import {isPresent} from '../Preconditions';

import os from 'os';
import {Files} from '../util/Files';
import {FilePaths} from '../util/FilePaths';
import {Dictionaries} from '../util/Dictionaries';
import {Directories, GlobalDataDir} from './Directories';
import {MockPHZWriter} from '../phz/MockPHZWriter';
import {DocMetaFileRef} from './DocMetaRef';
import {Backend} from './Backend';
import {Datastore} from './Datastore';
import {DocInfo} from '../metadata/DocInfo';
import {DefaultDatastoreMutation} from './DatastoreMutation';
import {func} from 'prop-types';

const rimraf = require('rimraf');

const tmpdir = os.tmpdir();

export class DatastoreTester {

    public static test(datastoreFactory: () => Datastore, hasLocalFiles: boolean = true) {

        describe('DatastoreTester tests', function() {

            const fingerprint = "0x001";

            const dataDir = FilePaths.join(tmpdir, 'test-data-dir');

            let datastore: Datastore;
            let persistenceLayer: DefaultPersistenceLayer;

            let docMeta: DocMeta;

            let directories: Directories;

            beforeEach(async function() {

                console.log("===== before test ====");

                // TODO: might want to run
                Files.removeDirectoryRecursively(dataDir);

                GlobalDataDir.set(dataDir);
                datastore = datastoreFactory();
                directories = new Directories();

                persistenceLayer = new DefaultPersistenceLayer(datastore);

                await persistenceLayer.init();

                docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);

                docMeta.docInfo.filename = `${fingerprint}.phz`;

                await persistenceLayer.delete({fingerprint, docInfo: docMeta.docInfo});

                const contains = await persistenceLayer.contains(fingerprint);

                assert.equal(contains, false, "Document already exists in persistence layer: " + fingerprint);

                await MockPHZWriter.write(FilePaths.create(datastore.stashDir, `${fingerprint}.phz`));

                const datastoreMutation = new DefaultDatastoreMutation<DocInfo>();
                await persistenceLayer.write(fingerprint, docMeta, datastoreMutation);

                // make sure we're always using the datastore mutations
                await datastoreMutation.written.get();
                await datastoreMutation.committed.get();

            });

            afterEach(async function() {
                console.log("===== after test ====");
                await persistenceLayer.stop();
            });

            // FIXME: test and write a new / basic document to make sure we get the commits working...

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

                docMeta!.docInfo.uuid = '__canonicalized__';
                docMeta0!.docInfo.uuid = '__canonicalized__';

                assert.equal(isPresent(docMeta0), true, "docMeta0 is not present");

                assertJSON(Dictionaries.sorted(docMeta), Dictionaries.sorted(docMeta0));

            });


            it("Delete DocMeta and the associated stash file...", async function() {

                const docMetaFileRef: DocMetaFileRef = {
                    fingerprint,
                    docFile: {
                        name: `${fingerprint}.phz`
                    },
                    docInfo: docMeta.docInfo
                };

                // make sure the files exist on disk...

                const docPath = FilePaths.join(directories.stashDir, `${fingerprint}.phz`);
                const statePath = FilePaths.join(directories.dataDir, fingerprint, 'state.json');

                if (hasLocalFiles) {
                    assert.ok(await Files.existsAsync(docPath));
                    assert.ok(await Files.existsAsync(statePath));

                }

                await persistenceLayer.delete(docMetaFileRef);

                if (hasLocalFiles) {

                    // make sure the files were deleted

                    assert.ok(! await Files.existsAsync(docPath));
                    assert.ok(! await Files.existsAsync(statePath));

                }

                // perform the delete multiple times now to make sure we're idempotent for deletes
                await persistenceLayer.delete(docMetaFileRef);
                await persistenceLayer.delete(docMetaFileRef);
                await persistenceLayer.delete(docMetaFileRef);

            });

            it("adding binary files", async function() {

                const data = 'fake image data';
                const fileRef = {name: 'test.jpg'};

                await datastore.deleteFile(Backend.IMAGE, fileRef);
                await datastore.deleteFile(Backend.IMAGE, fileRef);

                assert.ok(! await datastore.containsFile(Backend.IMAGE, fileRef), "Datastore already contains file!");

                const meta = {
                    "foo": "bar"
                };

                await datastore.writeFile(Backend.IMAGE, fileRef, data, meta);
                await datastore.writeFile(Backend.IMAGE, fileRef, data, meta);

                assert.ok(await datastore.containsFile(Backend.IMAGE, fileRef));

                const datastoreFile = await datastore.getFile(Backend.IMAGE, fileRef);
                assert.ok(datastoreFile);
                assert.ok(datastoreFile.isPresent());
                assert.ok(datastoreFile.get());

                assertJSON(datastoreFile.get().meta, meta);

                await datastore.deleteFile(Backend.IMAGE, fileRef);
                await datastore.deleteFile(Backend.IMAGE, fileRef);

            });

            it("getDocMetaFiles", async function() {

                const docMetaFiles = await datastore.getDocMetaFiles();

                assert.equal(docMetaFiles.length > 0, true);

                assert.equal(docMetaFiles.map((current) => current.fingerprint).includes(fingerprint), true);

            });

        });

    }

}
