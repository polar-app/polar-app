import React from 'react';
import {useDialogManager} from "../../../mui/dialogs/MUIDialogControllers";
import {RemoteDatastores} from "../../../datastore/RemoteDatastores";
import {DefaultPersistenceLayer} from "../../../datastore/DefaultPersistenceLayer";
import {usePersistenceContext} from "../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {PersistenceLayers} from "../../../datastore/PersistenceLayers";
import {useLogger} from "../../../mui/MUILogger";

function useDiskDatastoreMigrationPrompt() {

    const dialogs = useDialogManager();
    const diskDatastoreMigration = useDiskDatastoreMigration();
    return React.useCallback(() => {

        dialogs.confirm({
            title: "Start local data migration?",
            subtitle: (
                <div>

                    <p>
                        We are about to migrate all your data into the cloud.
                    </p>

                    <p>
                        This process will copy all your annotations, notes, and
                        documents.
                    </p>

                    <p>
                        All your data will be preserved locally and <b>WILL NOT</b>
                        be deleted after the transfer is completed.
                    </p>

                </div>
            ),
            onAccept: diskDatastoreMigration
        })

    },  [dialogs, diskDatastoreMigration]);

}

function useDiskDatastoreMigration() {

    const dialogs = useDialogManager();
    const log = useLogger();
    const remotePersistenceLayer = useRemotePersistenceLayer();
    const {persistenceLayerProvider} = usePersistenceContext();

    return React.useCallback(() => {

        const persistenceLayer = persistenceLayerProvider();

        async function doAsync() {

            const taskProgressCallback = await dialogs.taskbar({
                message: "Transferring local data to cloud... "
            })

            const source = await PersistenceLayers.toSyncOrigin(remotePersistenceLayer);
            const target = await PersistenceLayers.toSyncOrigin(persistenceLayer);

            await PersistenceLayers.transfer(source, target, async (snapshot) => {
                taskProgressCallback({value: snapshot.progress.progress});
            });

        }

        doAsync().catch(err => log.error(err));


    },  [dialogs, log, remotePersistenceLayer, persistenceLayerProvider]);

}

function useRemoteDatastore() {
    return RemoteDatastores.create();
}

function useRemotePersistenceLayer() {
    const remoteDatastore = useRemoteDatastore();
    return new DefaultPersistenceLayer(remoteDatastore);
}
