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

    return new CloudAwareDatastore(diskDatastore, firebaseDatastore);
}

SpectronRenderer.run(async (state) => {

    new FirebaseTester(state).run(async () => {

        const fingerprint = "0x001";

        describe('Cloud datastore tests', function() {


            beforeEach(async function() {

                Files.removeDirectoryRecursively(PolarDataDir.get()!);

                const firebaseDatastore = new FirebaseDatastore();
                await firebaseDatastore.init();
                await Datastores.purge(firebaseDatastore);
                await firebaseDatastore.stop();

            });

            xit("Basic replication tests", async function() {

                // first purge the firebase datastore

                const firebaseDatastore = new FirebaseDatastore();

                await firebaseDatastore.init();

                await Datastores.purge(firebaseDatastore);

                // then write an initial doc to it...

                const firestorePersistenceLayer = new DefaultPersistenceLayer(firebaseDatastore);

                await firestorePersistenceLayer.writeDocMeta(MockDocMetas.createMockDocMeta('0x001'));

                // now startup a new cloud persistence layer and make sure we
                // get the doc in firebase written locally.

                // FIXME: wrote a test with a messy sync with multiple local
                // files and multiople remote files that gets merged.  Make
                // sure we get the events when the local store is loading too
                // so that we can determine progress.

                const persistenceLayer = new DefaultPersistenceLayer(await createDatastore());

                await persistenceLayer.init();

                const initialDocLatch = new Latch<boolean>();
                const externallyWrittenDocLatch = new Latch<boolean>();

                const snapshotResult = await persistenceLayer.snapshot(docMetaSnapshotEvent => {

                    (async () => {

                        console.log("FIXME: 999 Got snapshot from: " + docMetaSnapshotEvent.batch,
                                    docMetaSnapshotEvent);

                        for (const docMutation of docMetaSnapshotEvent.docMetaMutations) {
                            const docInfo = await docMutation.docInfoProvider();

                            if (docInfo.fingerprint === '0x001') {
                                initialDocLatch.resolve(true);
                                continue;
                            }

                            if (docInfo.fingerprint === '0x002') {
                                externallyWrittenDocLatch.resolve(true);
                                continue;
                            }

                        }

                    })().catch(err => console.error("unable to handle: ", err));

                });

                await initialDocLatch.get();

                await firestorePersistenceLayer.writeDocMeta(MockDocMetas.createMockDocMeta('0x002'));

                await externallyWrittenDocLatch.get();

                waitForExpect(async () => {
                    assert.ok(await persistenceLayer.contains('0x002'), "Does not contain second doc");
                });

                console.log("WORKED");

                await persistenceLayer.stop();
                await firestorePersistenceLayer.stop();

                snapshotResult.unsubscribe!();

            });

            // FIXME make these production tests again.

            it("Write a basic doc with synchronization listener", async function() {

                const cloudAwareDatastore = await createDatastore();
                const persistenceLayer = new DefaultPersistenceLayer(cloudAwareDatastore);

                cloudAwareDatastore.addSynchronizationEventListener(docMetaSnapshotEvent => {
                    console.log("FIXME: 9999 Got snapshot from: " + docMetaSnapshotEvent.datastore,
                                docMetaSnapshotEvent);

                });

                await persistenceLayer.init();

                const docMeta = MockDocMetas.createMockDocMeta('0x002');
                await persistenceLayer.writeDocMeta(docMeta);

                const firebasePersistenceLayer = new DefaultPersistenceLayer(new FirebaseDatastore());
                await firebasePersistenceLayer.init();
                await firebasePersistenceLayer.writeDocMeta(MockDocMetas.createMockDocMeta('0x003'));

                await Promises.waitFor(5000);

                await persistenceLayer.stop();
                await firebasePersistenceLayer.stop();

            });

            xit("Write a basic doc", async function() {

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

            xit("Test an existing firebase store with existing data replicating to a new CloudDatastore.", async function() {

                Files.removeDirectoryRecursively(PolarDataDir.get()!);

                const sourcePersistenceLayer = new DefaultPersistenceLayer(new FirebaseDatastore());
                await sourcePersistenceLayer.init();
                const docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);
                await sourcePersistenceLayer.write(fingerprint, docMeta);
                await sourcePersistenceLayer.stop();

                const targetPersistenceLayer = new DefaultPersistenceLayer(await createDatastore());

                let err: Error | undefined;
                await targetPersistenceLayer.init(error => {
                    err = error;
                });

                await waitForExpect(async () => {
                    const dataDir = PolarDataDir.get();
                    const path = FilePaths.join(dataDir!, '0x001', 'state.json');
                    assert.ok(await Files.existsAsync(path));
                });

                await targetPersistenceLayer.stop();

                // verify that we have received no errors.
                assert.ok(err === undefined);

            });

            xit("Verify unsubscribe works.", async function() {

                Files.removeDirectoryRecursively(PolarDataDir.get()!);

                const targetPersistenceLayer = new DefaultPersistenceLayer(await createDatastore());
                await targetPersistenceLayer.init();

                await Datastores.purge(targetPersistenceLayer.datastore);

                const docMetaFiles = await targetPersistenceLayer.getDocMetaFiles();
                assert.equal(docMetaFiles.length, 0);

                // FIXME: right now we ahve to manually create the snapshot to trigger replication...
                // it's not done in init

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

                await Promises.waitFor(5000);

                assert.ok(gotEventAfterUnsubscribe === false, "Nope.. we still got the event");

            });


            // FIXME: this wont' work yet due to the snapshot issue.
            xit("Test a remote write and a local replication to disk", async function() {

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

        // DatastoreTester.test(createDatastore, false);

    });

});


