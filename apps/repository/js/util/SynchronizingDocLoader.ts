import {FileRef} from '../../../../web/js/datastore/Datastore';
import {Backend} from '../../../../web/js/datastore/Backend';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {Hashcode} from '../../../../web/js/metadata/Hashcode';
import {Logger} from '../../../../web/js/logger/Logger';
import {DocLoader} from '../../../../web/js/apps/main/doc_loaders/DocLoader';
import {AppRuntime} from '../../../../web/js/AppRuntime';
import {Stopwatches} from '../../../../web/js/util/Stopwatches';
import {BackendFileRef} from '../../../../web/js/datastore/Datastore';

const log = Logger.create();

export class SynchronizingDocLoader {

    private persistenceLayerManager: PersistenceLayerManager;
    private readonly docLoader: DocLoader;

    constructor(persistenceLayerManager: PersistenceLayerManager) {
        this.persistenceLayerManager = persistenceLayerManager;
        this.docLoader = new DocLoader(persistenceLayerManager);
    }

    public async load(fingerprint: string, backendFileRef: BackendFileRef) {

        const persistenceLayer = this.persistenceLayerManager.get();

        const docLoaderRequest = this.docLoader.create({
             fingerprint,
             backendFileRef,
             newWindow: true
        });

        if (AppRuntime.isElectron()) {

            // TODO: this is only need when using the cloud aware datastore.

            // NOTE: these operations execute locally first, so it's a quick
            // way to verify that the file needs to be synchronized.
            const requiresSynchronize =
                ! await persistenceLayer.contains(fingerprint) ||
                ! await persistenceLayer.containsFile(backendFileRef.backend, backendFileRef);

            if (requiresSynchronize) {
                await persistenceLayer.synchronizeDocs({fingerprint});
                log.notice("Forcing synchronization (doc not local): " + fingerprint);
            }

        }

        await docLoaderRequest.load();

    }

}
