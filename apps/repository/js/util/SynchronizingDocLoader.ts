import {FileRef} from '../../../../web/js/datastore/Datastore';
import {Backend} from '../../../../web/js/datastore/Backend';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {Hashcode} from '../../../../web/js/metadata/Hashcode';
import {Logger} from '../../../../web/js/logger/Logger';
import {DocLoader} from '../../../../web/js/apps/main/doc_loaders/DocLoader';

const log = Logger.create();

export class SynchronizingDocLoader {

    private persistenceLayerManager: PersistenceLayerManager;

    constructor(persistenceLayerManager: PersistenceLayerManager) {
        this.persistenceLayerManager = persistenceLayerManager;
    }

    public async load(fingerprint: string,
                      filename: string,
                      hashcode?: Hashcode) {

        const persistenceLayer = this.persistenceLayerManager.get();

        const ref: FileRef = {
            name: filename,
            hashcode
        };

        // NOTE: these operations execute locally first, so it's a quick
        // way to verify that the file needs to be synchronized.
        const requiresSynchronize =
            ! await persistenceLayer.contains(fingerprint) ||
            ! await persistenceLayer.containsFile(Backend.STASH, ref);

        if (requiresSynchronize) {
            await persistenceLayer.synchronizeDocs({fingerprint});
            log.notice("Forcing synchronization (doc not local): " + fingerprint);
        }

        await DocLoader.load({
             fingerprint,
             filename,
             newWindow: true
         });

    }

}
