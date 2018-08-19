import {AnkiSyncEngine} from './framework/anki/AnkiSyncEngine';
import {DocMetaSet} from '../../metadata/DocMetaSet';
import {SyncProgressListener} from './framework/SyncProgressListener';
import {Logger} from '../../logger/Logger';
import {PersistenceLayer} from '../../datastore/PersistenceLayer';
import {DiskDatastore} from '../../datastore/DiskDatastore';
import {notNull} from '../../Preconditions';

const log = Logger.create();

export class SyncApp {

    async start() {

        let url = new URL(window.location.href);

        let fingerprint = notNull(url.searchParams.get("fingerprint"));

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
        };

        let pendingSyncJob = ankiSyncEngine.sync(docMetaSet, syncProgressListener);

        await pendingSyncJob.start();

    }

}
