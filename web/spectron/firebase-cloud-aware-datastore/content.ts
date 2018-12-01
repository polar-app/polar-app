import {SpectronRenderer, SpectronRendererState} from '../../js/test/SpectronRenderer';
import {Firebase} from '../../js/firestore/Firebase';
import {FirebaseUIAuth} from '../../js/firestore/FirebaseUIAuth';
import * as firebase from '../../js/firestore/lib/firebase';
import {Elements} from '../../js/util/Elements';
import {DiskDatastore} from '../../js/datastore/DiskDatastore';
import {DefaultPersistenceLayer} from '../../js/datastore/DefaultPersistenceLayer';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {assert} from "chai";
import {DatastoreTester} from '../../js/datastore/DatastoreTester';
import {Firestore} from '../../js/firestore/Firestore';
import {Hashcodes} from '../../js/Hashcodes';
import {Promises} from '../../js/util/Promises';
import {FirebaseDatastore} from '../../js/datastore/FirebaseDatastore';
import {DocLoader} from '../../js/apps/main/ipc/DocLoader';
import {FirebaseTester} from '../../js/firestore/FirebaseTester';
import {CloudAwareDatastore} from '../../js/datastore/CloudAwareDatastore';
import {FilePaths} from '../../js/util/FilePaths';
import {Datastore} from '../../js/datastore/Datastore';
import {DocMeta} from '../../js/metadata/DocMeta';
import {Directories, GlobalDataDir} from '../../js/datastore/Directories';
import {Files} from '../../js/util/Files';
import {MockPHZWriter} from '../../js/phz/MockPHZWriter';
import {DefaultDatastoreMutation} from '../../js/datastore/DatastoreMutation';
import {DocInfo} from '../../js/metadata/DocInfo';
import {PolarDataDir} from '../../js/test/PolarDataDir';
import waitForExpect from 'wait-for-expect';
import {Datastores} from '../../js/datastore/Datastores';
import {Latch} from '../../js/util/Latch';
import {NULL_FUNCTION} from '../../js/util/Functions';
import {PersistenceLayers} from '../../js/datastore/PersistenceLayers';

mocha.setup('bdd');
mocha.timeout(20000);
PolarDataDir.useFreshDirectory('.test-firebase-cloud-aware-datastore');

async function createDatastore() {

    const diskDatastore = new DiskDatastore();
    const firebaseDatastore = new FirebaseDatastore();

    await Promise.all([diskDatastore.init(), firebaseDatastore.init()]);

    const cloudAwareDatastore = new CloudAwareDatastore(diskDatastore, firebaseDatastore);

    cloudAwareDatastore.shutdownHook = async () => {
        const consistency = await Datastores.checkConsistency(diskDatastore, firebaseDatastore);
        assert.ok(consistency.consistent, "Datastores are not consistent");
        console.log("Filesystems are consistent.");
    };

    return cloudAwareDatastore;
}

SpectronRenderer.run(async (state) => {

    new FirebaseTester(state).run(async () => {

        const fingerprint = "0x001";

        describe('Cloud datastore tests', function() {

            beforeEach(async function() {

                console.log("==== BEGIN beforeEach");

                // FIXME: this doesn't work reliably... find a better alternative
                await Files.removeDirectoryRecursivelyAsync(PolarDataDir.get()!);

                const firebaseDatastore = new FirebaseDatastore();
                await firebaseDatastore.init();

                await Datastores.purge(firebaseDatastore,
                                       purgeEvent => console.log("Purged: ", purgeEvent));

                await firebaseDatastore.stop();

                console.log("==== END beforeEach");

            });

            xit("Test1: null test to make sure we have no documents on startup", async function() {

                const persistenceLayer = new DefaultPersistenceLayer(await createDatastore());

                await persistenceLayer.init();

                const docMetaFiles = await persistenceLayer.getDocMetaFiles();
                assert.equal(docMetaFiles.length, 0);

                persistenceLayer.stop();

            });


            // FIXME make these production tests again.

            it("Test3: Write a basic doc with synchronization listener", async function() {

                const cloudAwareDatastore = await createDatastore();
                const persistenceLayer = new DefaultPersistenceLayer(cloudAwareDatastore);

                const latch0 = new Latch<boolean>();
                const latch1 = new Latch<boolean>();

                cloudAwareDatastore.addSynchronizationEventListener(docMetaSnapshotEvent => {

                    if (docMetaSnapshotEvent.consistency !== 'committed' ) {
                        return;
                    }

                    for (const docMetaMutation of docMetaSnapshotEvent.docMetaMutations) {
                        if (docMetaMutation.fingerprint === '0x002') {
                            latch0.resolve(true);
                        }
                        if (docMetaMutation.fingerprint === '0x003') {
                            latch1.resolve(true);
                        }
                    }

                });

                await persistenceLayer.init();

                const docMeta = MockDocMetas.createMockDocMeta('0x002');
                await persistenceLayer.writeDocMeta(docMeta);

                const firebasePersistenceLayer = new DefaultPersistenceLayer(new FirebaseDatastore());
                await firebasePersistenceLayer.init();
                await firebasePersistenceLayer.writeDocMeta(MockDocMetas.createMockDocMeta('0x003'));

                await latch0.get();
                await latch1.get();

                await persistenceLayer.stop();
                await firebasePersistenceLayer.stop();

            });

            it("Test4: Write a basic doc", async function() {

                const persistenceLayer = new DefaultPersistenceLayer(await createDatastore());

                await persistenceLayer.init();

                const docMeta = MockDocMetas.createMockDocMeta();

                const datastoreMutation = new DefaultDatastoreMutation<DocInfo>();

                let writtenDuration: number = 0;
                let committedDuration: number = 0;

                const before = Date.now();

                datastoreMutation.written.get().then(() => writtenDuration = Date.now() - before);
                datastoreMutation.committed.get().then(() => committedDuration = Date.now() - before);

                await persistenceLayer.write(fingerprint, docMeta, datastoreMutation);

                console.log(`writtenDuration: ${writtenDuration}, committedDuration: ${committedDuration}`);

                await persistenceLayer.stop();

            });

            it("Test5: Test an existing firebase store with existing data replicating to a new CloudDatastore.", async function() {

                let err: Error | undefined;

                const errorListener = (error: Error) => {
                    console.error("Got error:  ", err);
                    err = error;
                };

                const sourcePersistenceLayer = new DefaultPersistenceLayer(new FirebaseDatastore());
                await sourcePersistenceLayer.init(errorListener);
                await sourcePersistenceLayer.writeDocMeta(MockDocMetas.createMockDocMeta(fingerprint));
                await sourcePersistenceLayer.stop();

                const targetPersistenceLayer = new DefaultPersistenceLayer(await createDatastore());

                await targetPersistenceLayer.init(errorListener);

                await waitForExpect(async () => {
                    const dataDir = PolarDataDir.get();
                    const path = FilePaths.join(dataDir!, fingerprint, 'state.json');
                    assert.ok(await Files.existsAsync(path), "Path does not exist: " + path);
                });

                await targetPersistenceLayer.stop();

                // verify that we have received no errors.
                assert.ok(err === undefined, "Received an error: " + err);

            });

            it("Test6: Verify unsubscribe works.", async function() {

                Files.removeDirectoryRecursively(PolarDataDir.get()!);

                const targetPersistenceLayer = new DefaultPersistenceLayer(await createDatastore());
                await targetPersistenceLayer.init();

                await Datastores.purge(targetPersistenceLayer.datastore);

                const docMetaFiles = await targetPersistenceLayer.getDocMetaFiles();
                assert.equal(docMetaFiles.length, 0);

                let gotEventAfterUnsubscribe = false;
                let unsubscribed = false;

                const snapshotResult = await targetPersistenceLayer.snapshot(event => {
                    console.log("GOT AN EVENT with consistency: " + event.consistency, event);

                    if (event.consistency !== 'committed') {
                        return;
                    }

                    if (! unsubscribed) {
                        return;
                    }

                    gotEventAfterUnsubscribe = true;

                });

                snapshotResult.unsubscribe!();
                unsubscribed = true;

                const sidePersistenceLayer = new DefaultPersistenceLayer(new FirebaseDatastore());
                await sidePersistenceLayer.init();
                await sidePersistenceLayer.writeDocMeta(MockDocMetas.createMockDocMeta());
                await sidePersistenceLayer.stop();

                // TODO: unfortunately, we HAVE to sleep here because we're
                // waiting for any lagging events
                await Promises.waitFor(5000);

                assert.ok(gotEventAfterUnsubscribe === false, "Nope.. we still got the event");

            });


            // FIXME: this wont' work yet due to the snapshot issue.
            xit("Test7: Test a remote write and a local replication to disk", async function() {

                const sourcePersistenceLayer = new DefaultPersistenceLayer(new FirebaseDatastore());
                await sourcePersistenceLayer.init();

                const targetPersistenceLayer = new DefaultPersistenceLayer(await createDatastore());
                await targetPersistenceLayer.init();

                const docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);
                await sourcePersistenceLayer.write(fingerprint, docMeta);

                await waitForExpect(async () => {
                    const dataDir = PolarDataDir.get();
                    const path = FilePaths.join(dataDir!, '0x001', 'state.json');
                    console.log("Checkign for path: " + path);
                    assert.ok(await Files.existsAsync(path), 'Path for fingerprint never appeared');
                });

                await sourcePersistenceLayer.stop();
                await targetPersistenceLayer.stop();

            });

        });

        DatastoreTester.test(createDatastore, false);

    });

});


