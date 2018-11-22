import {SpectronRenderer, SpectronRendererState} from '../../js/test/SpectronRenderer';
import {Firebase} from '../../js/firestore/Firebase';
import {FirebaseUIAuth} from '../../js/firestore/FirebaseUIAuth';
import * as firebase from '../../js/firestore/lib/firebase';
import {Elements} from '../../js/util/Elements';
import {DiskDatastore} from '../../js/datastore/DiskDatastore';
import {CompositeFirebaseDatastore} from '../../js/datastore/CompositeFirebaseDatastore';
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

mocha.setup('bdd');
PolarDataDir.useFreshDirectory('.test-firebase-cloud-aware-datastore');

function createDatastore() {

    const diskDatastore = new DiskDatastore();

    const firebaseDatastore = new FirebaseDatastore();

    return new CloudAwareDatastore(diskDatastore, firebaseDatastore);
}

SpectronRenderer.run(async (state) => {

    new FirebaseTester(state).run(async () => {

        const fingerprint = "0x001";

        describe('Cloud datastore tests', function() {

            it("Write a basic doc", async function() {

                const persistenceLayer = new DefaultPersistenceLayer(createDatastore());

                await persistenceLayer.init();

                const docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);

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

            it("Test a remote write and a local replication to disk", async function() {

                const sourcePersistenceLayer = new DefaultPersistenceLayer(new FirebaseDatastore());
                await sourcePersistenceLayer.init();

                const targetPersistenceLayer = new DefaultPersistenceLayer(createDatastore());
                await targetPersistenceLayer.init();

                const docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);
                await sourcePersistenceLayer.write(fingerprint, docMeta);

                await waitForExpect(async () => {
                    const dataDir = PolarDataDir.get();
                    const path = FilePaths.join(dataDir!, '0x001', 'state.json');
                    console.log("Checkign for path: " + path);
                    assert.ok(await Files.existsAsync(path));
                });

                await sourcePersistenceLayer.stop();
                await targetPersistenceLayer.stop();

            });

            it("Test an existing firebase store with existing data replicating to a new CloudDatastore.", async function() {

                Files.removeDirectoryRecursively(PolarDataDir.get()!);

                const sourcePersistenceLayer = new DefaultPersistenceLayer(new FirebaseDatastore());
                await sourcePersistenceLayer.init();
                const docMeta = MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);
                await sourcePersistenceLayer.write(fingerprint, docMeta);
                await sourcePersistenceLayer.stop();

                const targetPersistenceLayer = new DefaultPersistenceLayer(createDatastore());
                await targetPersistenceLayer.init();

                await waitForExpect(async () => {
                    const dataDir = PolarDataDir.get();
                    const path = FilePaths.join(dataDir!, '0x001', 'state.json');
                    assert.ok(await Files.existsAsync(path));
                });

                await targetPersistenceLayer.stop();

            });

        });

        DatastoreTester.test(createDatastore, false);

    });

});


