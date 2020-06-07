import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {DiskDatastore} from '../../js/datastore/DiskDatastore';
import {DefaultPersistenceLayer} from '../../js/datastore/DefaultPersistenceLayer';
import {FirebaseDatastore} from '../../js/datastore/FirebaseDatastore';
import {FirebaseTestRunner} from '../../js/firebase/FirebaseTestRunner';
import {PersistenceLayer} from '../../js/datastore/PersistenceLayer';
import {
    PersistenceLayers,
    SyncOrigin
} from '../../js/datastore/PersistenceLayers';
import {CloudAwareDatastore} from '../../js/datastore/CloudAwareDatastore';
import {ProgressBar} from '../../js/ui/progress_bar/ProgressBar';
import {Logging} from '../../js/logger/Logging';

Logging.initForTesting();

SpectronRenderer.run(async (state) => {

    new FirebaseTestRunner(state).run(async () => {

        async function syncWithFirebase() {

            const diskDatastore = new DiskDatastore();
            const firebaseDatastore = new FirebaseDatastore();

            const cloudAwareDatastore = new CloudAwareDatastore(diskDatastore, firebaseDatastore);
            const progressBar = ProgressBar.create(false);

            cloudAwareDatastore.addDocMetaSnapshotEventListener(async docMetaSnapshotEvent => {
                console.log("Got event: ", docMetaSnapshotEvent);
                console.log("Progress percentage: " + docMetaSnapshotEvent.progress.progress);
                progressBar.update(docMetaSnapshotEvent.progress.progress);
            });

            await cloudAwareDatastore.init();

        }

        async function initialMergeWithFirebase() {

            const progressBar = ProgressBar.create(false);

            const source = new DefaultPersistenceLayer(new DiskDatastore());
            const target = new DefaultPersistenceLayer(new FirebaseDatastore());

            await Promise.all([source.init(), target.init()]);

            async function toSyncDocMap(persistenceLayer: PersistenceLayer) {

                const timeLabel = 'toSyncOrigin:' + persistenceLayer.datastore.id;

                try {
                    console.time(timeLabel);
                    return await PersistenceLayers.toSyncDocMap(persistenceLayer.datastore, progressState => {
                        progressBar.update(progressState.progress);
                    });

                } finally {
                    console.timeEnd(timeLabel);
                }

            }

            async function toSyncOrigin(persistenceLayer: PersistenceLayer): Promise<SyncOrigin> {

                const syncDocMap = await toSyncDocMap(persistenceLayer);

                return {
                    datastore: persistenceLayer.datastore,
                    syncDocMap
                };

            }

            await PersistenceLayers.merge(await toSyncOrigin(source), await toSyncOrigin(target), async (transferEvent) => {
                console.log("Transfer event: ", transferEvent);
                progressBar.update(transferEvent.progress.progress);
            });

            console.log("Transfer finished.");

            await Promise.all([source.stop(), target.stop()]);

        }

        // await syncWithFirebase();

        // await initialMergeWithFirebase();

    }).catch(err => console.error(err));

});
