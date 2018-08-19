import {AnkiSyncEngine} from './framework/anki/AnkiSyncEngine';
import {DocMetaSet} from '../../metadata/DocMetaSet';
import {SyncProgressListener} from './framework/SyncProgressListener';
import {Logger} from '../../logger/Logger';
import {PersistenceLayer} from '../../datastore/PersistenceLayer';
import {DiskDatastore} from '../../datastore/DiskDatastore';
import {notNull} from '../../Preconditions';
import {ProgressLog} from '../../ui/progress_log/ProgressLog';

const log = Logger.create();

export class SyncApp {

    private progressLog: ProgressLog = new ProgressLog();

    async start() {

        let url = new URL(window.location.href);

        let fingerprint = url.searchParams.get("fingerprint");

        if(! fingerprint) {
            // TODO: for now just sync the default / example document for testing
            fingerprint = '110dd61fd57444010b1ab5ff38782f0f'
        }

        let ankiSyncEngine = new AnkiSyncEngine();

        let datastore = new DiskDatastore();

        await datastore.init();

        let persistenceLayer = new PersistenceLayer(datastore);

        await persistenceLayer.init();

        let docMeta = await persistenceLayer.getDocMeta(fingerprint);

        if(! docMeta) {
            throw new Error("No DocMeta for fingerprint: " + fingerprint);
        }

        log.info("Syncing document with title: ", docMeta.docInfo.title);

        let docMetaSet = new DocMetaSet(docMeta);

        let syncProgressListener: SyncProgressListener = syncProgress => {
            log.info("Sync progress: ", syncProgress);

            let message: string | undefined;

            syncProgress.taskResult.when(taskResult => {
                message = taskResult.message;
            });

            this.progressLog.update({
                percentage: syncProgress.percentage,
                message
            });

        };

        let pendingSyncJob = ankiSyncEngine.sync(docMetaSet, syncProgressListener);

        await pendingSyncJob.start();

        this.progressLog.update({ percentage: 100, message: 'Sync complete' });

    }

}
