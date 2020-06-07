import {Logger} from 'polar-shared/src/logger/Logger';
import {DocLoader} from '../../../../web/js/apps/main/doc_loaders/DocLoader';
import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";

const log = Logger.create();

export class SynchronizingDocLoader {

    private readonly docLoader: DocLoader;

    constructor(private readonly persistenceLayerProvider: PersistenceLayerProvider) {
        this.docLoader = new DocLoader(persistenceLayerProvider);
    }

    public async load(fingerprint: string, backendFileRef: BackendFileRef) {


        const docLoaderRequest = this.docLoader.create({
             fingerprint,
             backendFileRef,
             newWindow: true
        });

        // if (AppRuntime.isElectron()) {
        //     const persistenceLayer = this.persistenceLayerProvider();
        //
        //     // TODO: this is only need when using the cloud aware datastore.
        //
        //     // NOTE: these operations execute locally first, so it's a quick
        //     // way to verify that the file needs to be synchronized.
        //     const requiresSynchronize =
        //         ! await persistenceLayer.contains(fingerprint) ||
        //         ! await persistenceLayer.containsFile(backendFileRef.backend, backendFileRef);
        //
        //     if (requiresSynchronize) {
        //         await persistenceLayer.synchronizeDocs({fingerprint});
        //         log.notice("Forcing synchronization (doc not local): " + fingerprint);
        //     }
        //
        // }

        await docLoaderRequest.load();

    }

}
